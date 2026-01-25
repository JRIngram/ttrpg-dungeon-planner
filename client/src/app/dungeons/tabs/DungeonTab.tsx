import { useState } from "react";
import { FieldTextDisplayGroup } from "@/components/molecules/FieldTextDisplayGroup/FieldTextDisplayGroup";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { ToastType } from "@/types/toast";
import type { Dungeon } from "@/types/dungeon";
import { DungeonDataFetcher } from "@/services/DungeonDataFetcher/DungeonDataFetcher";
import { useToastsDispatch } from "@/context/ToastContext";
import { DungeonForm } from "@/components/organisms/Forms/DungeonForm/DungeonForm";

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

  if (!selectedDungeon?.id) {
    return (
      <>
        <DungeonForm
          onCancelCallback={() => {
            return;
          }}
          onSubmitCallback={async (dungeon) => {
            await refetchDungeonCallback();
            setSelectedDungeonCallback(dungeon?.id);
          }}
        />
      </>
    );
  } else {
    if (selectedDungeon) {
      if (isEditing) {
        return (
          <DungeonForm
            existingDungeon={selectedDungeon}
            onSubmitCallback={async (dungeon) => {
              await refetchDungeonCallback();
              setIsEditing(false);
              setSelectedDungeonCallback(dungeon?.id);
            }}
            onCancelCallback={() => setIsEditing(false)}
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
