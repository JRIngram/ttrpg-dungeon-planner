"use client";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";
import { useToastsDispatch } from "@/context/ToastContext";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher";
import { Monster } from "@/types/monster";
import { ToastType } from "@/types/toast";

export enum InputMode {
  "NEW",
  "EDIT",
}

type Props = {
  inputMode: InputMode;
  onSubmit: (monster?: Monster) => void;
  onCancel: () => void;
  monster?: Monster;
};

export const MonsterForm = ({
  monster,
  inputMode,
  onSubmit,
  onCancel,
}: Props) => {
  const dispatch = useToastsDispatch();
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
            onSubmit(addedMonster);
            dispatch({
              type: "add",
              toast: {
                message: `Added monster: ${monsterName}`,
                type: ToastType.SUCCESS,
              },
            });
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
            onSubmit(editedMonster);
            dispatch({
              type: "add",
              toast: {
                message: `Edited monster: ${editedMonster.name}`,
                type: ToastType.SUCCESS,
              },
            });
          } catch (err) {
            throw new Error("Error adding monster");
          }
        }
      } else {
        throw new Error("Invalid form values");
      }
    } catch (err) {
      dispatch({
        type: "add",
        toast: {
          message: `Error submitting form: ${err}`,
          type: ToastType.ERROR,
        },
      });
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
            pattern="\w{1,}"
            patternMessage="Alphanumeric characters"
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
            pattern="[0-9]{1,}"
            patternMessage="Numeric values"
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
