import { AddOrEditTrap, AddTrap, Trap } from "@/types/trap";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";
import { useReducer } from "react";
import { initialState, TrapFormActionTypes, trapFormReducer } from "./reducer";
import { useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";
import { TrapDataFetcher } from "@/services/TrapDataFetcher/TrapDataFetcher";

type Props = {
  onSubmitCallback: (entity: Trap) => void;
  onCancelCallback: () => void;
  existingTrap?: Trap;
};

export const TrapForm = ({
  onCancelCallback,
  onSubmitCallback,
  existingTrap,
}: Props) => {
  const [state, dispatch] = useReducer(
    trapFormReducer,
    initialState(existingTrap),
  );
  const toastsDispatch = useToastsDispatch();

  const validateInputs = () => {
    let errorsPresent = false;
    const trapNameRegex = /(\w|\s){1,}/;
    const trapEffectRegex = /(\w|\s){1,}/;

    if (!state.name.match(trapNameRegex)) {
      dispatch({
        type: TrapFormActionTypes.SET_NAME_ERROR,
        payload: "Alphanumerical characters only.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: TrapFormActionTypes.SET_NAME_ERROR,
        payload: "",
      });
    }

    if (!state.effect.match(trapEffectRegex)) {
      dispatch({
        type: TrapFormActionTypes.SET_EFFECT_ERROR,
        payload: "Alphanumerical characters only.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: TrapFormActionTypes.SET_EFFECT_ERROR,
        payload: "",
      });
    }

    return errorsPresent;
  };

  const submitForm = async () => {
    if (validateInputs()) return;

    const dataFetcher = new TrapDataFetcher();
    const trapToSubmit: AddOrEditTrap = {
      id: state?.id,
      name: state.name,
      effect: state.effect,
    };
    const { entity, httpCode } = existingTrap
      ? await dataFetcher.editSingle(trapToSubmit)
      : await dataFetcher.addSingle(trapToSubmit);

    if (entity === undefined) {
      toastsDispatch({
        type: "add",
        toast: {
          message: `Could not ${existingTrap ? "edit" : "add"} entity. HTTP ${httpCode}`,
          type: ToastType.WARNING,
        },
      });
    } else {
      onSubmitCallback(entity);
      toastsDispatch({
        type: "add",
        toast: {
          message: `${existingTrap ? "Edited" : "Added"} entity`,
          type: ToastType.SUCCESS,
        },
      });
    }
  };

  return (
    <>
      <p>Please select a trap or create a new one below</p>
      <div className="flex flex-col gap-2">
        <FormTextInput
          id="trap-name"
          formInputName="name"
          ariaLabel="Trap name"
          formLabelText="Name"
          placeholder="e.g. Hidden Pit"
          pattern="(\\w|\\s){1,}"
          patternMessage="Alphanumeric characters"
          value={state.name}
          isRequired={true}
          onChangeCallback={(trapName) =>
            dispatch({
              type: TrapFormActionTypes.UPDATE_NAME,
              payload: trapName,
            })
          }
          errorMessage={state.trapNameInputError}
        />
        <FormTextInput
          id="trap-effect"
          formInputName="effect"
          ariaLabel="Trap effect"
          formLabelText="Trap Effect"
          placeholder="e.g. 1d4 falling damage"
          pattern="(\\w|\\s){1,}"
          patternMessage="Alphanumeric characters"
          value={state.effect}
          isRequired={true}
          onChangeCallback={(trapEffect) =>
            dispatch({
              type: TrapFormActionTypes.UPDATE_EFFECT,
              payload: trapEffect,
            })
          }
          errorMessage={state.trapEffectInputError}
        />
      </div>
      <div className="mt-4">
        <ButtonRow
          buttons={[
            {
              text: "Save",
              onClick: submitForm,
              variant: "primaryFilled",
            },
            {
              text: "Cancel",
              onClick: onCancelCallback,
              variant: "tertiaryOutline",
            },
          ]}
        />
      </div>
    </>
  );
};
