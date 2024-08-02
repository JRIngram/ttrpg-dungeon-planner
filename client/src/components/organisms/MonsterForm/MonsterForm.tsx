"use client";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher";
import { Monster } from "@/types/monster";

export enum InputMode {
  "NEW",
  "EDIT",
}

type Props = {
  inputMode: InputMode;
  onSubmit: (message: string, monster?: Monster) => void;
  onCancel: () => void;
  monster?: Monster;
};

export const MonsterForm = ({
  monster,
  inputMode,
  onSubmit,
  onCancel,
}: Props) => {
  const submitForm = async (formData: FormData) => {
    try {
      const monsterName = formData.get("monster-name")?.toString();
      const monsterXpString = formData.get("monster-xp")?.toString();
      if (monsterName && monsterXpString) {
        const dataFetcher = new MonsterDataFetcher();
        const monsterXp = parseInt(monsterXpString);

        if (inputMode === InputMode.NEW) {
          try {
            const addedMonster = await dataFetcher.addMonster({
              name: monsterName,
              xp: monsterXp,
            });
            onSubmit("Successfully added monster", addedMonster);
          } catch (err) {
            throw new Error("Error adding monster");
          }
        } else if (inputMode === InputMode.EDIT) {
          try {
            if (!monster) {
              throw new Error("No monster id value");
            }
            const editedMonster = await dataFetcher.editMonster({
              id: monster.id,
              name: monsterName,
              xp: monsterXp,
            });
            onSubmit("Successfully edited monster", editedMonster);
          } catch (err) {
            throw new Error("Error adding monster");
          }
        }
      } else {
        throw new Error("Invalid form values");
      }
    } catch (err) {
      console.log("Error submitting form", err);
      onSubmit(`Error submitting form: ${err}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form action={submitForm}>
        <div className="flex flex-col gap-2">
          <FormTextInput
            id="monster-name"
            formInputName="monster-name"
            ariaLabel="Monster name"
            formLabelText="Name"
            placeholder="e.g. Goblin"
            initialValue={
              inputMode === InputMode.EDIT && monster?.name
                ? monster.name
                : undefined
            }
            isRequired
          />
          <FormTextInput
            id="monster-xp"
            formInputName="monster-xp"
            ariaLabel="Monster XP value"
            formLabelText="XP Value"
            placeholder="e.g. 50"
            initialValue={
              inputMode === InputMode.EDIT && monster?.xp
                ? monster?.xp.toString()
                : undefined
            }
            isRequired
          />
          <ButtonRow
            buttons={[
              {
                text: "Save",
                onClick: async () => {},
                variant: "primaryFilled",
                isSubmit: true,
              },
              {
                text: "Cancel",
                onClick: onCancel,
                variant: "tertiaryOutline",
              },
            ]}
          />
        </div>
      </form>
    </div>
  );
};
