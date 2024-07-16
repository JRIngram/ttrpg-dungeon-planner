"use client";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher";

export enum InputMode {
  "NEW",
  "EDIT",
}

type Props = {
  inputMode: InputMode;
  monsterId?: string;
};

export const MonsterForm = ({ monsterId, inputMode }: Props) => {
  // test code to remove
  if (monsterId) {
    const df = new MonsterDataFetcher();
    const mon = df.getMonsterById(monsterId);
    console.log(mon);
  }
  // end of test code

  const submitForm = async (formData: FormData) => {
    try {
      const monsterName = formData.get("monster-name")?.toString();
      const monsterXpString = formData.get("monster-xp")?.toString();
      if (monsterName && monsterXpString) {
        const dataFetcher = new MonsterDataFetcher();
        const monsterXp = parseInt(monsterXpString);

        if (inputMode === InputMode.NEW) {
          try {
            await dataFetcher.addMonster({ name: monsterName, xp: monsterXp });
          } catch (err) {
            throw new Error("Error adding monster");
          }
        } else if (inputMode === InputMode.EDIT) {
          try {
            if (!monsterId) {
              throw new Error("No monster id value");
            }
            await dataFetcher.editMonster({
              id: monsterId,
              name: monsterName,
              xp: monsterXp,
            });
          } catch (err) {
            throw new Error("Error adding monster");
          }
        }
      } else {
        throw new Error("Invalid form values");
      }
    } catch (err) {
      console.log("Error submitting form", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold">Monster</p>
      <form action={submitForm}>
        <div className="flex flex-col gap-2">
          <FormTextInput
            id="monster-name"
            formInputName="monster-name"
            ariaLabel="Monster name"
            formLabelText="Name"
            placeholder="e.g. Goblin"
            isRequired
          />
          <FormTextInput
            id="monster-xp"
            formInputName="monster-xp"
            ariaLabel="Monster XP value"
            formLabelText="XP Value"
            placeholder="e.g. 50"
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
                onClick: async () => {},
                variant: "tertiaryOutline",
              },
            ]}
          />
        </div>
      </form>
    </div>
  );
};
