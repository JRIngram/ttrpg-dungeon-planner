import { AddOrEditMonster, Monster } from "@/types/monster";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher/MonsterDataFetcher";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { useReducer } from "react";
import {
  getInitialState,
  MonsterFormActionTypes,
  monsterFormReducer,
} from "./reducer";
import { useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";

type Props = {
  onSubmitCallback: (entity: Monster) => void;
  onCancelCallback: () => void;
  existingMonster?: Monster;
};

export const MonsterForm = ({
  onCancelCallback,
  onSubmitCallback,
  existingMonster,
}: Props) => {
  const [state, dispatch] = useReducer(
    monsterFormReducer,
    getInitialState(existingMonster),
  );
  const toastsDispatch = useToastsDispatch();

  const validateInputs = () => {
    let errorsPresent = false;
    const monsterNameRegex = /(\w|\s){1,}/;
    const monsterXPRegex = /^\d+$/;

    if (!state.name.match(monsterNameRegex)) {
      dispatch({
        type: MonsterFormActionTypes.SET_NAME_ERROR,
        payload: "Alphanumerical characters only.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: MonsterFormActionTypes.SET_NAME_ERROR,
        payload: "",
      });
    }

    if (!state.xp.match(monsterXPRegex)) {
      dispatch({
        type: MonsterFormActionTypes.SET_XP_ERROR,
        payload: "Numerical characters only.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: MonsterFormActionTypes.SET_XP_ERROR,
        payload: "",
      });
    }

    return errorsPresent;
  };

  const submitForm = async () => {
    if (validateInputs()) return;

    const dataFetcher = new MonsterDataFetcher();
    const monsterToSubmit: AddOrEditMonster = {
      name: state.name,
      xp: state.xp,
      id: state?.id,
    };

    const { entity, httpCode } = monsterToSubmit.id
      ? await dataFetcher.editSingle(monsterToSubmit)
      : await dataFetcher.addSingle(monsterToSubmit);

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

  return (
    <>
      {!state.id && <p>Please select a monster or create a new one below</p>}
      <form data-testid="monster-form" onSubmit={(e) => e.preventDefault()}>
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
            errorMessage={state.monsterNameInputError}
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
            errorMessage={state.monsterXpInputError}
          />
        </div>
        <div className="mt-4">
          <ButtonRow
            buttons={[
              {
                text: "Save",
                onClick: async () => {
                  submitForm();
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
