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

type Props = {
  selectedDungeonId?: string;
};
export const RoomTab = ({ selectedDungeonId }: Props) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>();
  const toastDispatch = useToastsDispatch();

  const roomDataFetcher = new RoomDataFetcher();
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
      textInputFormName: "description",
      itemName: "Monster",
      dropdownConfig: {
        placeholder: "Select a monster",
        options: [
          {
            label: "Monster 1",
            value: "mon-1",
          },
        ],
      },
      isRequired: true,
    },
        {
      inputType: InputType.QuantitySelector,
      id: "room-trap",
      textInputFormName: "description",
      itemName: "Trap",
      dropdownConfig: {
        placeholder: "Select a trap",
        options: [
          {
            label: "Trap 1",
            value: "trap-1",
          },
        ],
      },
      isRequired: true,
    },
  ];

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
            monsters: [],
            traps: [],
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
        const roomFields = Object.entries(room).map((e) => {
          return {
            fieldName: e[0],
            fieldValue: `${e[1]}`,
          };
        });

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
