import { useState } from "react";
import { FieldTextDisplayGroup } from "@/components/molecules/FieldTextDisplayGroup/FieldTextDisplayGroup";
import {
  FormBuilder,
  FormInputField,
  InputType,
} from "@/components/organisms/FormBuilder/FormBuilder";
import { InputMode } from "@/components/organisms/FormBuilder/FormBuilder";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { ToastType } from "@/types/toast";
import type { Dungeon, Dungeon as DungeonType } from "@/types/dungeon";
import { DungeonDataFetcher } from "@/services/DungeonDataFetcher/DungeonDataFetcher";
import { useToastsDispatch } from "@/context/ToastContext";

type Props = {
  selectedDungeon?: Dungeon;
  refetchDungeonCallback: () => Promise<{}>;
  setSelectedDungeonCallback: (dungeonId?: string) => void;
};
export const DungeonTab = ({
  selectedDungeon,
  setSelectedDungeonCallback,
  refetchDungeonCallback,
}: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toastDispatch = useToastsDispatch();

  const dungeonDataFetcher = new DungeonDataFetcher();
  const DungeonForm = FormBuilder<DungeonType>;
  const formFields: FormInputField[] = [
    {
      inputType: InputType.Text,
      id: "dungeon-name",
      formInputName: "name",
      ariaLabel: "Dungeon name",
      formLabelText: "Name",
      placeholder: "e.g. The Lost Ruins",
      pattern: `(\\w|\\s){1,}`,
      patternMessage: "Alphanumeric characters",
      value: "",
      isRequired: true,
      onChangeCallback: () => {}
    },
    {
      inputType: InputType.Text,
      id: "dungeon-summary",
      formInputName: "summary",
      ariaLabel: "Dungeon summary",
      formLabelText: "Summary",
      placeholder: "e.g. Shadowy ruins of an old Dwarvern mining outpost",
      pattern: `(\\w|\\s){1,}`,
      patternMessage: "Alphanumeric characters",
      value: "",
      isRequired: true,
      onChangeCallback: () => {}
    },
    {
      inputType: InputType.Text,
      id: "dungeon-level-min",
      formInputName: "levelMin",
      ariaLabel: "Dungeon Minimum Level",
      formLabelText: "Minimum Level",
      placeholder: "1",
      pattern: `(\\d){1,}`,
      patternMessage: "Numerical characters",
      value: "",
      isRequired: true,
      onChangeCallback: () => {}
    },
    {
      inputType: InputType.Text,
      id: "dungeon-level-max",
      formInputName: "levelMax",
      ariaLabel: "Dungeon Maximum Level",
      formLabelText: "Maximum Level",
      placeholder: "3",
      pattern: `(\\d){1,}`,
      patternMessage: "Numerical characters",
      value: "",
      isRequired: true,
      onChangeCallback: () => {}
    },
    {
      inputType: InputType.Text,
      id: "dungeon-player-count",
      formInputName: "playerCount",
      ariaLabel: "Dungeon Player Count",
      formLabelText: "Intended Player Count",
      placeholder: "4",
      pattern: `(\\d){1,}`,
      patternMessage: "Numerical characters",
      value: "",
      isRequired: true,
      onChangeCallback: () => {}
    },
  ];

  if (!selectedDungeon?.id) {
    return (
      <>
        <p>Please select a dungeon or create a new one below</p>
        <DungeonForm
          dataFetcher={dungeonDataFetcher}
          inputMode={InputMode.NEW}
          onCancelCallback={() => {
            return;
          }}
          onSubmitCallback={async (dungeon) => {
            await refetchDungeonCallback();
            setSelectedDungeonCallback(dungeon?.id);
          }}
          fields={formFields}
        />
      </>
    );
  } else {
    if (selectedDungeon) {
      if (isEditing) {
        return (
          <DungeonForm
            dataFetcher={new DungeonDataFetcher()}
            inputMode={InputMode.EDIT}
            existingEntity={selectedDungeon}
            onSubmitCallback={async (dungeon) => {
              await refetchDungeonCallback();
              setIsEditing(false);
              setSelectedDungeonCallback(dungeon?.id);
            }}
            onCancelCallback={() => setIsEditing(false)}
            fields={formFields}
          />
        );
      }

      const dungeonFields = Object.entries(selectedDungeon).map((e) => {
        return {
          fieldName: e[0],
          fieldValue: `${e[1]}`,
        };
      });

      return (
        <div className="flex flex-col gap-4">
          <FieldTextDisplayGroup fields={dungeonFields} />
          <ButtonRow
            buttons={[
              {
                text: "Edit",
                onClick: () => setIsEditing(true),
                variant: "secondaryOutline",
              },
              {
                text: "Delete",
                onClick: async () => {
                  const { httpCode } = await dungeonDataFetcher.deleteSingle(
                    selectedDungeon?.id,
                  );
                  if (!dungeonDataFetcher.isSuccessfulHTTPCode(httpCode)) {
                    toastDispatch({
                      type: "add",
                      toast: {
                        type: ToastType.WARNING,
                        message: `Could not delete dungeon ${selectedDungeon.name}. HTTP ${httpCode}`,
                      },
                    });
                  } else {
                    await refetchDungeonCallback();
                    setSelectedDungeonCallback(undefined);
                    toastDispatch({
                      type: "add",
                      toast: {
                        type: ToastType.SUCCESS,
                        message: "Successfully deleted dungeon",
                      },
                    });
                  }
                },
                variant: "tertiaryOutline",
                // Dungeons will always be deletable as they're the root data type.
                disabled: false,
              },
            ]}
          />
        </div>
      );
    }
  }

  return;
};
