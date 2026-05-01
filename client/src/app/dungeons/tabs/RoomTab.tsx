import { PropsWithChildren, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FieldTextDisplayGroup } from "@/components/molecules/FieldTextDisplayGroup/FieldTextDisplayGroup";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { ToastType } from "@/types/toast";
import type { Room } from "@/types/room";
import { useToastsDispatch } from "@/context/ToastContext";
import { RoomDataFetcher } from "@/services/RoomDataFetcher.ts/RoomDataFetcher";
import { RoomForm } from "@/components/organisms/Forms/RoomForm/RoomForm";
import { MonsterWithQuantity } from "@/types/monster";
import { EncounterMultiplierService } from "@/services/EncounterMultiplierService/EncounterMultiplierService";
import {
  EncounterMultiplierConfigRow,
  EncounterRatingConfigRow,
} from "@/types/configs";
import { EncounterRatingService } from "@/services/EncounterRatingService/EncounterRatingService";
import { Dungeon } from "@/types/dungeon";

type Props = {
  selectedDungeon?: Dungeon;
};

export const RoomTab = ({ selectedDungeon }: Props) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>();
  const toastDispatch = useToastsDispatch();

  const roomDataFetcher = new RoomDataFetcher();
  const encounterMultiplierService = new EncounterMultiplierService();
  const encounterRatingService = new EncounterRatingService();

  const {
    data: dungeonRooms,
    isLoading: isLoadingDungeonRooms,
    isError: errorLoadingDungeonRooms,
    refetch,
  } = useQuery({
    queryKey: [`dungeon-${selectedDungeon?.id}-room-list`],
    queryFn: (): Promise<Room[]> | [] => {
      return selectedDungeon
        ? roomDataFetcher.getListForDungeon(selectedDungeon?.id)
        : [];
    },
  });

  const {
    data: multiplierConfigRows,
    isLoading: isLoadingMultiplierConfigRows,
    isError: errorLoadingMultiplierConfigRows,
  } = useQuery({
    queryKey: ["encounter-multiplier-config"],
    queryFn: (): Promise<EncounterMultiplierConfigRow[]> => {
      return encounterMultiplierService.getList();
    },
  });

  const {
    data: encounterRatingConfigRows,
    isLoading: isLoadingEncounterRatingConfigRows,
    isError: errorLoadingEncounterRatingConfigRows,
  } = useQuery({
    queryKey: ["encounter-rating-config"],
    queryFn: (): Promise<EncounterRatingConfigRow[]> => {
      return encounterRatingService.getList();
    },
  });

  const displayMultiplierConfigRowsMessage = () => {
    if (isLoadingMultiplierConfigRows) {
      return <p>Loading multiplier config rows</p>;
    } else if (errorLoadingMultiplierConfigRows) {
      return (
        <>
          <p>
            Error loading multiplier config rows, room XP will be inaccurate.
          </p>
          <p>Check the network tab for details of the failure.</p>
        </>
      );
    }
  };

  const displayEncounterRatingConfigRows = () => {
    if (isLoadingEncounterRatingConfigRows) {
      return <p>Loading encounter rating config rows</p>;
    } else if (errorLoadingEncounterRatingConfigRows) {
      return (
        <>
          <p>
            Error loading encounter rating config rows; room encounter rating
            will not be available.
          </p>
          <p>Check the network tab for details of the failure.</p>
        </>
      );
    }
  };

  if (selectedDungeon === undefined)
    return <p>Error: dungeon must be selected!</p>;

  if (isLoadingDungeonRooms) {
    return <p>Loading...</p>;
  } else if (errorLoadingDungeonRooms) {
    return <p>Error loading dungeon rooms.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <ListItemContainer>
        <p>Create a new room or edit an existing one below</p>
        <RoomForm
          dungeonId={selectedDungeon.id}
          onCancelCallback={() => {
            return;
          }}
          onSubmitCallback={async () => {
            await refetch();
          }}
        />
      </ListItemContainer>
      <div>
        {displayMultiplierConfigRowsMessage()}
        {displayEncounterRatingConfigRows()}
      </div>
      {dungeonRooms?.map((room) => {
        const stringifiedRoom = roomDataFetcher.stringifyRoomFields(room);
        if (stringifiedRoom.id === selectedRoomId) {
          return (
            <ListItemContainer key={room.id}>
              <RoomForm
                dungeonId={selectedDungeon.id}
                onCancelCallback={() => {
                  setSelectedRoomId("");
                  return;
                }}
                onSubmitCallback={async () => {
                  await refetch();
                }}
                existingRoom={room}
              />
            </ListItemContainer>
          );
        }

        if (stringifiedRoom.id !== selectedRoomId) {
          const roomFields = formatRoomFields(
            room,
            selectedDungeon,
            multiplierConfigRows,
            encounterRatingConfigRows,
          );

          return (
            <ListItemContainer key={room.id}>
              <FieldTextDisplayGroup fields={roomFields} />
              <ButtonRow
                buttons={[
                  {
                    text: "Edit",
                    onClick: () => setSelectedRoomId(stringifiedRoom.id),
                    variant: "secondaryOutline",
                  },
                  {
                    text: "Delete",
                    onClick: async () => {
                      const { httpCode } = await roomDataFetcher.deleteSingle(
                        `${room.id}`,
                      );
                      if (!roomDataFetcher.isSuccessfulHTTPCode(httpCode)) {
                        toastDispatch({
                          type: "add",
                          toast: {
                            type: ToastType.WARNING,
                            message: `Could not delete room ${room.name}. HTTP ${httpCode}`,
                          },
                        });
                      } else {
                        await refetch();
                        toastDispatch({
                          type: "add",
                          toast: {
                            type: ToastType.SUCCESS,
                            message: "Successfully deleted room",
                          },
                        });
                      }
                    },
                    variant: "tertiaryOutline",
                    // Rooms will always be deletable via the UI as they're onlt accessible via the dungeon UI.
                    disabled: false,
                  },
                ]}
              />
            </ListItemContainer>
          );
        }
      })}
    </div>
  );
};

const ListItemContainer = ({ children }: PropsWithChildren) => {
  return <div className="border-b-2 border-primary-50 pb-4">{children}</div>;
};

const formatRoomFields = (
  room: Room,
  selectedDungeon: Dungeon,
  multiplierConfigRows: EncounterMultiplierConfigRow[] | undefined,
  ratingConfigRows: EncounterRatingConfigRow[] | undefined,
) => {
  const isSimpleField = (value: unknown): value is string | number =>
    typeof value === "string" || typeof value === "number";

  const simpleFields = Object.entries(room)
    .filter((e) => isSimpleField(e[1]))
    .filter((e) => e[0] !== "id")
    .map((entry) => ({
      fieldName: entry[0].charAt(0).toLocaleUpperCase() + entry[0].slice(1),
      fieldValue: `${entry[1]}`,
    }));

  const calculateTotalMonsterXp = (monster: MonsterWithQuantity) =>
    monster.xp ? parseInt(monster.xp) * monster.quantity : -1;

  const calculateAdjustedTotalXp = (
    totalXp: number,
    roomMonsters: MonsterWithQuantity[],
  ) => {
    if (!multiplierConfigRows) return;

    const monsterCount = roomMonsters.reduce((accumulator, currentMonster) => {
      return accumulator + currentMonster.quantity;
    }, 0);

    const getEncounterMultiplier = () =>
      multiplierConfigRows.find(
        (row) => monsterCount >= row.min && monsterCount <= row.max,
      )?.multiplier ?? 1;

    return totalXp * getEncounterMultiplier();
  };

  // TODO - fix, this should account for player count too!
  const calculateRoomRatings = (
    adjustedXp: number,
    levelMin: number,
    levelMax: number,
    roomRatingConfig: EncounterRatingConfigRow[] | undefined,
  ) => {
    if (roomRatingConfig === undefined)
      return [
        { fieldName: "Room Ratings", fieldValue: "No room rating config" },
      ];

    const minPlayerLevel = levelMin;
    const maxPlayerLevel = levelMax;
    const meanPlayLevel = (levelMin + levelMax) / 2;

    const roomRatingForLevel = (level: number, encounterXp: number): string => {
      const ratingForLevel = roomRatingConfig.find(
        (rating) => rating.level === level,
      );

      if (ratingForLevel === undefined) return "No rating for level";

      const { easy, medium, hard, extreme } = ratingForLevel;

      if (encounterXp < easy) return "Trivial";
      if (encounterXp >= easy && encounterXp < medium) return "Easy";
      if (encounterXp >= medium && encounterXp < hard) return "Medium";
      if (encounterXp >= hard && encounterXp < extreme) return "Hard";
      if (encounterXp >= extreme) return "Extreme";

      return "Error calculating rating. No matching Rating.";
    };

    return [
      {
        fieldName: "Min Level Rating",
        fieldValue: roomRatingForLevel(minPlayerLevel, adjustedXp),
      },
      {
        fieldName: "Average Level Rating",
        fieldValue: roomRatingForLevel(meanPlayLevel, adjustedXp),
      },
      {
        fieldName: "Max Level Rating",
        fieldValue: roomRatingForLevel(maxPlayerLevel, adjustedXp),
      },
    ];
  };

  const monsterFields = room.monsters?.map((monster) => {
    return {
      fieldName: monster.name,
      fieldValue: `${monster.xp}xp each; ${monster.quantity} in room. (${calculateTotalMonsterXp(monster)}xp total)`,
    };
  });

  const trapFields = room.traps.map((trap) => {
    return {
      fieldName: trap.name,
      fieldValue: `${trap.quantity} in room.`,
    };
  });

  const totalXp = room.monsters.length
    ? room.monsters
        .map((monster) => calculateTotalMonsterXp(monster))
        .reduce(
          (accumulator, currentMonsterXp) => accumulator + currentMonsterXp,
        )
    : 0;

  const adjustedXpByMultiplier = calculateAdjustedTotalXp(
    totalXp,
    room.monsters,
  );

  const totalAdjustedXp = adjustedXpByMultiplier
    ? adjustedXpByMultiplier
    : totalXp;

  const xpBeforeAdjustment = {
    fieldName: "XP before adjustment",
    fieldValue: `${totalXp}xp`,
  };

  const totalXpField = {
    fieldName: "Total Room XP",
    fieldValue: `${totalAdjustedXp}xp`,
  };

  return [
    simpleFields,
    monsterFields,
    trapFields,
    xpBeforeAdjustment,
    totalXpField,
    ...calculateRoomRatings(
      totalAdjustedXp,
      selectedDungeon.levelMin,
      selectedDungeon.levelMax,
      ratingConfigRows,
    ),
  ].flat();
};
