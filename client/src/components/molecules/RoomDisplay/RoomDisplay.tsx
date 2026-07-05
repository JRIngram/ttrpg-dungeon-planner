import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/atoms/Text/Text";
import {
  RoomWithStringifiedFields,
  StringifiedRoomMonster,
  StringifiedRoomTrap,
} from "@/types/room";
import { EncounterMultiplierService } from "@/services/EncounterMultiplierService/EncounterMultiplierService";
import {
  EncounterMultiplierConfigRow,
  EncounterRatingConfigRow,
} from "@/types/configs";
import { EncounterRatingService } from "@/services/EncounterRatingService/EncounterRatingService";
import { MonsterWithQuantity } from "@/types/monster";
import { Dungeon } from "@/types/dungeon";
import {
  EncounterRating,
  EncounterRatingPill,
} from "@/components/atoms/EncounterRatingPill/EncounterRatingPill";

type RoomDisplayProps = {
  dungeon: Dungeon;
  room: RoomWithStringifiedFields;
};

export const RoomDisplay = ({ dungeon, room }: RoomDisplayProps) => {
  const encounterMultiplierService = new EncounterMultiplierService();

  const {
    data: multiplierConfigRows,
    isLoading: isLoadingMultiplierConfigRows,
  } = useQuery({
    queryKey: ["encounter-multiplier-config"],
    queryFn: (): Promise<EncounterMultiplierConfigRow[]> => {
      return encounterMultiplierService.getList();
    },
  });

  const calculateTotalMonsterXp = (monster: MonsterWithQuantity) =>
    monster.xp ? parseInt(monster.xp) * monster.quantity : -1;

  const calculateAdjustedTotalXp = (
    totalXp: number,
    roomMonsters: MonsterWithQuantity[],
  ) => {
    if (!multiplierConfigRows) return 0;

    const monsterCount = roomMonsters.reduce((accumulator, currentMonster) => {
      return accumulator + currentMonster.quantity;
    }, 0);

    const getEncounterMultiplier = () =>
      multiplierConfigRows.find(
        (row) => monsterCount >= row.min && (row.max === null || monsterCount <= row.max),
      )?.multiplier ?? 1;

    return totalXp * getEncounterMultiplier();
  };

  const monstersWithNumericalQuantity = room.monsters.map((monster) => ({
    ...monster,
    // stringify quantity
    quantity: parseInt(monster.quantity),
  }));

  const xpPriorToAdjustment = monstersWithNumericalQuantity.reduce(
    (accumulator, currentValue) =>
      accumulator + calculateTotalMonsterXp(currentValue),
    0,
  );

  const adjustedXp = calculateAdjustedTotalXp(
    xpPriorToAdjustment,
    monstersWithNumericalQuantity,
  );

  return (
    <div className="flex gap-4 flex-col my-4 px-4">
      <Text text={room.name} textType="header" />
      <Text text={room.description} textType="default" />
      <MonsterList monsters={room.monsters} />
      <TrapList traps={room.traps} />
      <>
        <Text text="XP Information" textType="subheader"></Text>
        <ul className="pl-4">
          <li className="list-disc">
            <Text
              text={`Pre multiplier adjustment: ${xpPriorToAdjustment}xp`}
              textType="default"
            />
          </li>
          {isLoadingMultiplierConfigRows && (
            <li className="list-disc">
              <Text
                text="Loading post multiplier adjustment XP..."
                textType="default"
              />
            </li>
          )}
          {!isLoadingMultiplierConfigRows && (
            <li className="list-disc">
              <Text
                text={`Post multiplier adjustment: ${adjustedXp}xp`}
                textType="default"
              ></Text>
            </li>
          )}
        </ul>
      </>
      <RoomRatingsForLevels
        adjustedXp={adjustedXp}
        playerCount={dungeon.playerCount}
        levelMin={dungeon.levelMin}
        levelMax={dungeon.levelMax}
      />
    </div>
  );
};

type MonsterListProps = {
  monsters: StringifiedRoomMonster[];
};

const MonsterList = ({ monsters }: MonsterListProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Text text="Monsters" textType="subheader"></Text>
      <ul className="pl-4">
        {monsters.map((monster) => {
          return (
            <li key={monster.id} className="list-disc">
              {monster.quantity} {monster.name} - {monster.xp}xp each
            </li>
          );
        })}
      </ul>
    </div>
  );
};

type TrapListProps = {
  traps: StringifiedRoomTrap[];
};

const TrapList = ({ traps }: TrapListProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Text text="Traps" textType="subheader"></Text>
      <ul className="pl-4">
        {traps.map((trap) => {
          return (
            <li key={trap.id} className="list-disc">
              {trap.quantity} {trap.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

type RoomRatingsProps = {
  adjustedXp: number;
  playerCount: number;
  levelMin: number;
  levelMax: number;
};

const RoomRatingsForLevels = ({
  adjustedXp,
  playerCount,
  levelMin,
  levelMax,
}: RoomRatingsProps) => {
  const encounterRatingService = new EncounterRatingService();

  const {
    data: encounterRatingConfigRows,
    isLoading: encounterRatingConfigRowsLoading,
  } = useQuery({
    queryKey: ["encounter-rating-config"],
    queryFn: (): Promise<EncounterRatingConfigRow[]> => {
      return encounterRatingService.getList();
    },
  });

  const minPlayerLevel = levelMin;
  const maxPlayerLevel = levelMax;
  const meanPlayLevel = (levelMin + levelMax) / 2;

  const roomRatingForLevel = (
    level: number,
    encounterXp: number,
  ): EncounterRating => {
    if (encounterRatingConfigRowsLoading || !encounterRatingConfigRows)
      return "unavailable";

    const ratingForLevel = encounterRatingConfigRows.find(
      (rating) => rating.level === level,
    );

    if (ratingForLevel === undefined) return "unavailable";

    const { easy, medium, hard, extreme } = ratingForLevel;
    const xpPerPlayer = encounterXp / playerCount;

    if (xpPerPlayer < easy) return "trivial";
    if (xpPerPlayer >= easy && xpPerPlayer < medium) return "easy";
    if (xpPerPlayer >= medium && xpPerPlayer < hard) return "medium";
    if (xpPerPlayer >= hard && xpPerPlayer < extreme) return "hard";
    if (xpPerPlayer >= extreme) return "extreme";

    return "unavailable";
  };

  const ratings = [
    {
      field: "Min Players",
      rating: roomRatingForLevel(minPlayerLevel, adjustedXp),
    },
    {
      field: "Average Players",
      rating: roomRatingForLevel(meanPlayLevel, adjustedXp),
    },
    {
      field: "Max Players",
      rating: roomRatingForLevel(maxPlayerLevel, adjustedXp),
    },
  ];

  const ratingPills = ratings.map(({ field, rating }) => (
    <div
      key={field}
      className="flex flex-col justify-center items-center gap-1"
    >
      <Text text={field} textType="default" />
      <EncounterRatingPill rating={rating} />
    </div>
  ));

  return <div className="flex flex-row gap-8">{ratingPills}</div>;
};
