import { AddOrEditEncounterRatingConfigRow, EncounterRatingConfigRow } from "@/types/configs";
import { EncounterRatingService } from "@/services/EncounterRatingService/EncounterRatingService";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { useReducer } from "react";
import {
  getInitialState,
  EncounterRatingConfigFormActionTypes,
  encounterRatingConfigFormReducer,
} from "./reducer";
import { useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";

type Props = {
  onSubmitCallback: (entity: EncounterRatingConfigRow) => void;
  onCancelCallback: () => void;
  existingConfig?: EncounterRatingConfigRow;
};

export const EncounterRatingConfigForm = ({
  onCancelCallback,
  onSubmitCallback,
  existingConfig,
}: Props) => {
  const [state, dispatch] = useReducer(
    encounterRatingConfigFormReducer,
    getInitialState(existingConfig),
  );
  const toastsDispatch = useToastsDispatch();

  const validateInputs = () => {
    let errorsPresent = false;
    const numberRegex = /^\d+$/;

    if (!state.level.match(numberRegex)) {
      dispatch({
        type: EncounterRatingConfigFormActionTypes.SET_LEVEL_ERROR,
        payload: "Must be a positive integer.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: EncounterRatingConfigFormActionTypes.SET_LEVEL_ERROR,
        payload: "",
      });
    }

    if (!state.easy.match(numberRegex)) {
      dispatch({
        type: EncounterRatingConfigFormActionTypes.SET_EASY_ERROR,
        payload: "Must be a positive integer.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: EncounterRatingConfigFormActionTypes.SET_EASY_ERROR,
        payload: "",
      });
    }

    if (!state.medium.match(numberRegex)) {
      dispatch({
        type: EncounterRatingConfigFormActionTypes.SET_MEDIUM_ERROR,
        payload: "Must be a positive integer.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: EncounterRatingConfigFormActionTypes.SET_MEDIUM_ERROR,
        payload: "",
      });
    }

    if (!state.hard.match(numberRegex)) {
      dispatch({
        type: EncounterRatingConfigFormActionTypes.SET_HARD_ERROR,
        payload: "Must be a positive integer.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: EncounterRatingConfigFormActionTypes.SET_HARD_ERROR,
        payload: "",
      });
    }

    if (!state.extreme.match(numberRegex)) {
      dispatch({
        type: EncounterRatingConfigFormActionTypes.SET_EXTREME_ERROR,
        payload: "Must be a positive integer.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: EncounterRatingConfigFormActionTypes.SET_EXTREME_ERROR,
        payload: "",
      });
    }

    return errorsPresent;
  };

  const submitForm = async () => {
    if (validateInputs()) return;

    const dataFetcher = new EncounterRatingService();
    const configToSubmit: AddOrEditEncounterRatingConfigRow = {
      id: state.id,
      level: parseInt(state.level),
      easy: parseInt(state.easy),
      medium: parseInt(state.medium),
      hard: parseInt(state.hard),
      extreme: parseInt(state.extreme),
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
          message: `${existingConfig ? "Edited" : "Added"} encounter rating config`,
          type: ToastType.SUCCESS,
        },
      });
    }
  };

  return (
    <>
      {!state.id && <p>Please select a config or create a new one below</p>}
      <form data-testid="encounter-rating-config-form" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-2">
          <FormTextInput
            id="config-level"
            formInputName="level"
            ariaLabel="Player level"
            formLabelText="Player Level"
            placeholder="e.g. 1"
            pattern="[0-9]{1,}"
            patternMessage="Positive integer only"
            value={state.level}
            isRequired={true}
            onChangeCallback={(level) =>
              dispatch({
                type: EncounterRatingConfigFormActionTypes.UPDATE_LEVEL,
                payload: level,
              })
            }
            errorMessage={state.levelError}
          />
          <FormTextInput
            id="config-easy"
            formInputName="easy"
            ariaLabel="Easy threshold"
            formLabelText="Easy XP Threshold"
            placeholder="e.g. 50"
            pattern="[0-9]{1,}"
            patternMessage="Positive integer only"
            value={state.easy}
            isRequired={true}
            onChangeCallback={(easy) =>
              dispatch({
                type: EncounterRatingConfigFormActionTypes.UPDATE_EASY,
                payload: easy,
              })
            }
            errorMessage={state.easyError}
          />
          <FormTextInput
            id="config-medium"
            formInputName="medium"
            ariaLabel="Medium threshold"
            formLabelText="Medium XP Threshold"
            placeholder="e.g. 100"
            pattern="[0-9]{1,}"
            patternMessage="Positive integer only"
            value={state.medium}
            isRequired={true}
            onChangeCallback={(medium) =>
              dispatch({
                type: EncounterRatingConfigFormActionTypes.UPDATE_MEDIUM,
                payload: medium,
              })
            }
            errorMessage={state.mediumError}
          />
          <FormTextInput
            id="config-hard"
            formInputName="hard"
            ariaLabel="Hard threshold"
            formLabelText="Hard XP Threshold"
            placeholder="e.g. 150"
            pattern="[0-9]{1,}"
            patternMessage="Positive integer only"
            value={state.hard}
            isRequired={true}
            onChangeCallback={(hard) =>
              dispatch({
                type: EncounterRatingConfigFormActionTypes.UPDATE_HARD,
                payload: hard,
              })
            }
            errorMessage={state.hardError}
          />
          <FormTextInput
            id="config-extreme"
            formInputName="extreme"
            ariaLabel="Extreme threshold"
            formLabelText="Extreme XP Threshold"
            placeholder="e.g. 200"
            pattern="[0-9]{1,}"
            patternMessage="Positive integer only"
            value={state.extreme}
            isRequired={true}
            onChangeCallback={(extreme) =>
              dispatch({
                type: EncounterRatingConfigFormActionTypes.UPDATE_EXTREME,
                payload: extreme,
              })
            }
            errorMessage={state.extremeError}
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
