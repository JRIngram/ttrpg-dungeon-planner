import { PropsWithChildren, useState } from "react";
import { FieldTextDisplayGroup } from "@/components/molecules/FieldTextDisplayGroup/FieldTextDisplayGroup";
import {
  FormBuilder,
  FormInputField,
  InputType,
} from "@/components/organisms/FormBuilder/FormBuilder";
import { InputMode } from "@/components/organisms/FormBuilder/FormBuilder";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { ToastType } from "@/types/toast";
import type { Room } from "@/types/room";
import { useToastsDispatch } from "@/context/ToastContext";
import { RoomDataFetcher } from "@/services/RoomDataFetcher.ts/RoomDataFetcher";
import { useQuery } from "@tanstack/react-query";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher/MonsterDataFetcher";
import { DropdownOption } from "@/components/atoms/Dropdown/Dropdown";
import { TrapDataFetcher } from "@/services/TrapDataFetcher/TrapDataFetcher";
import { Monster, MonsterWithQuantity } from "@/types/monster";

type Props = {
  selectedDungeonId?: string;
};
export const RoomTab = ({ selectedDungeonId }: Props) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>();
  const toastDispatch = useToastsDispatch();

  const roomDataFetcher = new RoomDataFetcher();
  const monsterDataFetcher = new MonsterDataFetcher();
  const trapDataFetcher = new TrapDataFetcher();

  const {
    data,
    isLoading: isLoadingDungeonRooms,
    isError: errorLoadingDungeonRooms,
    refetch,
  } = useQuery({
    queryKey: [`dungeon-${selectedDungeonId}-room-list`],
    queryFn: (): Promise<Room[]> | [] => {
      return selectedDungeonId
        ? roomDataFetcher.getListForDungeon(selectedDungeonId)
        : [];
    },
  });

  const {
    data: monsters,
    isLoading: isLoadingMonsters,
    isError: isErrorLoadingMonsters,
  } = useQuery({
    queryKey: [`get-all-monsters`],
    queryFn: async (): Promise<DropdownOption[]> =>
      (await monsterDataFetcher.getList()).map((monster) => ({
        label: `${monster.name} - ${monster.xp}`,
        value: monster.id,
      })),
  });

  const {
    data: traps,
    isLoading: isLoadingTraps,
    isError: isErrorLoadingTraps,
  } = useQuery({
    queryKey: [`get-all-traps`],
    queryFn: async (): Promise<DropdownOption[]> =>
      (await trapDataFetcher.getList()).map((trap) => ({
        label: `${trap.name}`,
        value: trap.id,
      })),
  });

  const getPlacerholderMessage = (
    category: string,
    isLoading: boolean,
    isError: Boolean
  ) => {
    if (isLoading) {
      return `Loading ${category}`;
    } else if (isError) {
      return `Error loading ${category}`;
    } else {
      return `No ${category}`;
    }
  };

  const RoomForm = FormBuilder<Room>;
  const formFields: FormInputField[] = [
    {
      inputType: InputType.Text,
      id: "room-name",
      formInputName: "name",
      ariaLabel: "Room name",
      formLabelText: "Name",
      placeholder: "e.g. Guard Barracks",
      pattern: `(\\w|\\s){1,}`,
      patternMessage: "Alphanumeric characters",
      initialValue: undefined,
      isRequired: true,
    },
    {
      inputType: InputType.Text,
      id: "room-description",
      formInputName: "description",
      ariaLabel: "Room description",
      formLabelText: "Description",
      placeholder: "e.g. A dusty old barracks, with a few bunk beds.",
      pattern: `(\\w|\\s){1,}`,
      patternMessage: "Alphanumeric characters",
      initialValue: undefined,
      isRequired: true,
    },
    {
      inputType: InputType.QuantitySelector,
      id: "room-monster",
      textInputFormName: "monsters",
      itemName: "monsters",
      dropdownConfig: {
        placeholder: getPlacerholderMessage(
          "monsters",
          isLoadingMonsters,
          isErrorLoadingMonsters
        ),
        options: monsters ?? [],
      },
      isRequired: false,
      allowMultipleOfSame: true,
    },
    {
      inputType: InputType.QuantitySelector,
      id: "room-trap",
      textInputFormName: "traps",
      itemName: "traps",
      dropdownConfig: {
        placeholder: getPlacerholderMessage(
          "traps",
          isLoadingTraps,
          isErrorLoadingTraps
        ),
        options: traps ?? [],
      },
      allowMultipleOfSame: true,
      isRequired: false,
    },
  ];

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
          dataFetcher={roomDataFetcher}
          inputMode={InputMode.NEW}
          onCancelCallback={() => {
            return;
          }}
          onSubmitCallback={async () => {
            await refetch();
          }}
          fields={formFields}
          requiredNonFormData={{
            dungeonId: selectedDungeonId,
          }}
          endOfFormButtons={[
            {
              text: "Save",
              onClick: async () => {},
              variant: "primaryFilled",
              isSubmit: true,
            },
          ]}
        />
      </ListItemContainer>

      {data?.map((room) => {
        if (room.id === selectedRoomId) {
          return (
            <ListItemContainer key={room.id}>
              <RoomForm
                dataFetcher={roomDataFetcher}
                inputMode={InputMode.EDIT}
                onCancelCallback={() => {
                  setSelectedRoomId("");
                  return;
                }}
                onSubmitCallback={async () => {
                  await refetch();
                }}
                fields={formFields}
                requiredNonFormData={{
                  dungeonId: selectedDungeonId,
                  monsters: [],
                  traps: [],
                }}
                existingEntity={room}
              />
            </ListItemContainer>
          );
        }

        if (room.id !== selectedRoomId) {
          const roomFields = formatRoomFields(room);

          return (
            <ListItemContainer key={room.id}>
              <FieldTextDisplayGroup fields={roomFields} />
              <ButtonRow
                buttons={[
                  {
                    text: "Edit",
                    onClick: () => setSelectedRoomId(room.id),
                    variant: "secondaryOutline",
                  },
                  {
                    text: "Delete",
                    onClick: async () => {
                      const { httpCode } = await roomDataFetcher.deleteSingle(
                        room.id
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

const formatRoomFields = (room: Room) => {
  const isSimpleField = (value: unknown): value is string | number => typeof value ==='string' || typeof value === 'number';
  
  const simpleFields = Object.entries(room)
    .filter((e) => isSimpleField(e[1]))
    .map((entry) => ({
      fieldName: entry[0],
      fieldValue: `${entry[1]}`,
    }));

  const monsterFields = room.monsters?.map(monster => {
    return {
      fieldName: monster.name,
      fieldValue: `${monster.xp}xp each; ${monster.quantity} in room. (${monster.xp * monster.quantity}xp total)`,
    }
  });

  const trapFields = room.traps.map(trap => {
    return {
      fieldName: trap.name,
      fieldValue: `${trap.quantity} in room.`
    }
  });

  const totalXp = room.monsters.map(monster => monster.xp * monster.quantity).reduce((accumulator, currentMonsterXp) => accumulator + currentMonsterXp);
  const totalXpField = {
    fieldName: "Total Room XP",
    fieldValue: `${totalXp}xp`,
  }

  return [simpleFields, monsterFields, trapFields, totalXpField].flat()
};
