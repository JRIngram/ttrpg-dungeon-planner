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
            const { monster, httpCode } = await dataFetcher.addMonster({
              name: monsterName,
              xp: monsterXp,
            });
            if (monster) {
              onSubmit(monster);
              dispatch({
                type: "add",
                toast: {
                  message: `Added monster: ${monsterName}`,
                  type: ToastType.SUCCESS,
                },
              });
            } else {
              dispatch({
                type: "add",
                toast: {
                  message: `Could not add monster. HTTP ${httpCode}`,
                  type: ToastType.WARNING,
                },
              });
            }
          } catch (err) {
            throw new Error("could not add monster");
          }
        } else if (inputMode === InputMode.EDIT) {
          try {
            if (!monster) {
              throw new Error("no monster id value");
            }
            const { monster: editedMonster, httpCode } =
              await dataFetcher.editMonster({
                id: monster.id,
                name: monsterName,
                xp: monsterXp,
              });
            if (editedMonster) {
              onSubmit(editedMonster);
              dispatch({
                type: "add",
                toast: {
                  message: `Edited monster: ${editedMonster.name}`,
                  type: ToastType.SUCCESS,
                },
              });
            } else {
              dispatch({
                type: "add",
                toast: {
                  message: `Could not edit monster. HTTP ${httpCode}`,
                  type: ToastType.WARNING,
                },
              });
            }
          } catch (err) {
            throw new Error("failed to add monster");
          }
        }
      } else {
        throw new Error("invalid form values");
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
            pattern="(\w|\s){1,}"
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
