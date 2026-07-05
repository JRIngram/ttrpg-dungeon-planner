import { AddOrEditEncounterMultiplierConfigRow, EncounterMultiplierConfigRow } from "@/types/configs";
import { EncounterMultiplierService } from "@/services/EncounterMultiplierService/EncounterMultiplierService";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { useReducer } from "react";
import {
  getInitialState,
  EncounterMultiplierConfigFormActionTypes,
  encounterMultiplierConfigFormReducer,
} from "./reducer";
import { useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";

type Props = {
  onSubmitCallback: (entity: EncounterMultiplierConfigRow) => void;
  onCancelCallback: () => void;
  existingConfig?: EncounterMultiplierConfigRow;
};

export const EncounterMultiplierConfigForm = ({
  onCancelCallback,
  onSubmitCallback,
  existingConfig,
}: Props) => {
  const [state, dispatch] = useReducer(
    encounterMultiplierConfigFormReducer,
    getInitialState(existingConfig),
  );
  const toastsDispatch = useToastsDispatch();

  const validateInputs = () => {
    let errorsPresent = false;
    const numberRegex = /^\d+$/;
    const floatRegex = /^\d+(\.\d+)?$/;

    if (!state.min.match(numberRegex)) {
      dispatch({
        type: EncounterMultiplierConfigFormActionTypes.SET_MIN_ERROR,
        payload: "Must be a positive integer.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: EncounterMultiplierConfigFormActionTypes.SET_MIN_ERROR,
        payload: "",
      });
    }

    if (state.max && !state.max.match(numberRegex)) {
      dispatch({
        type: EncounterMultiplierConfigFormActionTypes.SET_MAX_ERROR,
        payload: "Must be a positive integer or empty.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: EncounterMultiplierConfigFormActionTypes.SET_MAX_ERROR,
        payload: "",
      });
    }

    if (!state.multiplier.match(floatRegex)) {
      dispatch({
        type: EncounterMultiplierConfigFormActionTypes.SET_MULTIPLIER_ERROR,
        payload: "Must be a number.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: EncounterMultiplierConfigFormActionTypes.SET_MULTIPLIER_ERROR,
        payload: "",
      });
    }

    return errorsPresent;
  };

  const submitForm = async () => {
    if (validateInputs()) return;

    const dataFetcher = new EncounterMultiplierService();
    const configToSubmit: AddOrEditEncounterMultiplierConfigRow = {
      id: state.id,
      min: parseInt(state.min),
      max: state.max ? parseInt(state.max) : null,
      multiplier: parseFloat(state.multiplier),
    };

    const { entity, httpCode } = existingConfig
      ? await dataFetcher.editSingle(configToSubmit)
      : await dataFetcher.addSingle(configToSubmit);

    if (entity === undefined) {
      toastsDispatch({
        type: "add",
        toast: {
          message: `Could not ${existingConfig ? "edit" : "add"} entity. HTTP ${httpCode}`,
          type: ToastType.WARNING,
        },
      });
    } else {
      onSubmitCallback(entity);
      toastsDispatch({
        type: "add",
        toast: {
          message: `${existingConfig ? "Edited" : "Added"} encounter multiplier config`,
          type: ToastType.SUCCESS,
        },
      });
    }
  };

  return (
    <>
      {!state.id && <p>Please select a config or create a new one below</p>}
      <form data-testid="encounter-multiplier-config-form" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-2">
          <FormTextInput
            id="config-min"
            formInputName="min"
            ariaLabel="Minimum monster count"
            formLabelText="Minimum Monster Count"
            placeholder="e.g. 1"
            pattern="[0-9]{1,}"
            patternMessage="Positive integer only"
            value={state.min}
            isRequired={true}
            onChangeCallback={(min) =>
              dispatch({
                type: EncounterMultiplierConfigFormActionTypes.UPDATE_MIN,
                payload: min,
              })
            }
            errorMessage={state.minError}
          />
          <FormTextInput
            id="config-max"
            formInputName="max"
            ariaLabel="Maximum monster count"
            formLabelText="Maximum Monster Count"
            placeholder="e.g. 2 (optional)"
            pattern="[0-9]{1,}"
            patternMessage="Positive integer or empty"
            value={state.max}
            isRequired={false}
            onChangeCallback={(max) =>
              dispatch({
                type: EncounterMultiplierConfigFormActionTypes.UPDATE_MAX,
                payload: max,
              })
            }
            errorMessage={state.maxError}
          />
          <FormTextInput
            id="config-multiplier"
            formInputName="multiplier"
            ariaLabel="XP multiplier"
            formLabelText="XP Multiplier"
            placeholder="e.g. 1.5"
            pattern="[0-9]{1,}(\.[0-9]{1,})?"
            patternMessage="Number only"
            value={state.multiplier}
            isRequired={true}
            onChangeCallback={(multiplier) =>
              dispatch({
                type: EncounterMultiplierConfigFormActionTypes.UPDATE_MULTIPLIER,
                payload: multiplier,
              })
            }
            errorMessage={state.multiplierError}
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
