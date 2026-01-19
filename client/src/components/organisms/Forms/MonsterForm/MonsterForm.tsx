import { AddMonster, Monster } from "@/types/monster";
import type { InputMode } from "../types";
import { ButtonProps } from "@/components/atoms/Button/Button";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher/MonsterDataFetcher";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { useReducer } from "react";
import {
  initialState,
  MonsterFormActionTypes,
  monsterFormReducer,
} from "./reducer";
import { useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";

type Props = {
  onSubmitCallback: (entity: Monster) => void;
  onCancelCallback: () => void;
};

export const MonsterForm = ({ onCancelCallback, onSubmitCallback }: Props) => {
  const [state, dispatch] = useReducer(monsterFormReducer, initialState);
  const toastsDispatch = useToastsDispatch();

  const submitForm = async () => {
    const dataFetcher = new MonsterDataFetcher();
    const { entity, httpCode } = await dataFetcher.addSingle(state);
    if (entity === undefined) {
      toastsDispatch({
        type: "add",
        toast: {
          message: `Could not add entity. HTTP ${httpCode}`,
          type: ToastType.WARNING,
        },
      });
    } else {
      onSubmitCallback(entity);
      toastsDispatch({
        type: "add",
        toast: {
          message: `Added entity`,
          type: ToastType.SUCCESS,
        },
      });
    }
  };

  console.log(state);

  return (
    <>
      <p>Please select a monster or create a new one below</p>
      <form
        data-testid="monster-form"
        onSubmit={async (e: React.FormEvent) => {
          await submitForm();
        }}
      >
        <div className="flex flex-col gap-2">
          <FormTextInput
            id="monster-name"
            formInputName="name"
            ariaLabel="Monster name"
            formLabelText="Name"
            placeholder="e.g. Goblin"
            pattern="(\\w|\\s){1,}"
            patternMessage="Alphanumeric characters"
            value={state.name}
            isRequired={true}
            onChangeCallback={(monsterName) =>
              dispatch({
                type: MonsterFormActionTypes.UPDATE_NAME,
                payload: monsterName,
              })
            }
          />
          <FormTextInput
            id="monster-xp"
            formInputName="xp"
            ariaLabel="Monster XP value"
            formLabelText="XP Value"
            placeholder="e.g. 50"
            pattern="[0-9]{1,}"
            patternMessage="Numeric values"
            value={`${state.xp}`}
            isRequired={true}
            onChangeCallback={(monsterXp) =>
              dispatch({
                type: MonsterFormActionTypes.UPDATE_XP,
                payload: monsterXp,
              })
            }
          />
        </div>
        <div className="mt-4">
          <ButtonRow
            buttons={[
              {
                text: "Save",
                onClick: async () => {
                  console.log("Hi");
                },
                variant: "primaryFilled",
                isSubmit: true,
              },
              {
                text: "Cancel",
                onClick: onCancelCallback,
                variant: "tertiaryOutline",
              },
            ]}
          />
        </div>
      </form>
    </>
  );
};
