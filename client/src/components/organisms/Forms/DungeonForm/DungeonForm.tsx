import { AddOrEditDungeon, Dungeon } from "@/types/dungeon";
import { DungeonDataFetcher } from "@/services/DungeonDataFetcher/DungeonDataFetcher";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { useReducer } from "react";
import {
  getInitialState,
  DungeonFormActionTypes,
  dungeonFormReducer,
} from "./reducer";
import { useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";

type Props = {
  onSubmitCallback: (entity: Dungeon) => void;
  onCancelCallback: () => void;
  existingDungeon?: Dungeon;
};

export const DungeonForm = ({
  onCancelCallback,
  onSubmitCallback,
  existingDungeon,
}: Props) => {
  const [state, dispatch] = useReducer(
    dungeonFormReducer,
    getInitialState(existingDungeon),
  );
  const toastsDispatch = useToastsDispatch();

  const validateInputs = () => {
    let errorsPresent = false;
    const dungeonNameRegex = /(\w|\s){1,}/;
    const dungeonSummaryRegex = /(\w|\s){1,}/;
    const dungeonLevelRegex = /^\d+$/;
    const dungeonPlayerCountRegex = /^\d+$/;

    if (!state.name.match(dungeonNameRegex)) {
      dispatch({
        type: DungeonFormActionTypes.SET_NAME_ERROR,
        payload: "Alphanumerical characters only.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: DungeonFormActionTypes.SET_NAME_ERROR,
        payload: "",
      });
    }

    if (!state.summary.match(dungeonSummaryRegex)) {
      dispatch({
        type: DungeonFormActionTypes.SET_SUMMARY_ERROR,
        payload: "Alphanumerical characters only.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: DungeonFormActionTypes.SET_SUMMARY_ERROR,
        payload: "",
      });
    }

    if (!state.levelMin.match(dungeonLevelRegex)) {
      dispatch({
        type: DungeonFormActionTypes.SET_LEVEL_MIN_ERROR,
        payload: "Numerical characters only.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: DungeonFormActionTypes.SET_LEVEL_MIN_ERROR,
        payload: "",
      });
    }

    if (!state.levelMax.match(dungeonLevelRegex)) {
      dispatch({
        type: DungeonFormActionTypes.SET_LEVEL_MAX_ERROR,
        payload: "Numerical characters only.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: DungeonFormActionTypes.SET_LEVEL_MAX_ERROR,
        payload: "",
      });
    }

    if (!state.playerCount.match(dungeonPlayerCountRegex)) {
      dispatch({
        type: DungeonFormActionTypes.SET_PLAYER_COUNT_ERROR,
        payload: "Numerical characters only.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: DungeonFormActionTypes.SET_PLAYER_COUNT_ERROR,
        payload: "",
      });
    }

    return errorsPresent;
  };

  const submitForm = async () => {
    if (validateInputs()) return;

    const dataFetcher = new DungeonDataFetcher();

    const dungeonToSubmit: AddOrEditDungeon = {
      id: state?.id,
      name: state.name,
      summary: state.summary,
      levelMin: parseInt(state.levelMin),
      levelMax: parseInt(state.levelMax),
      playerCount: parseInt(state.playerCount),
    };

    const { entity, httpCode } = dungeonToSubmit.id
      ? await dataFetcher.editSingle(dungeonToSubmit)
      : await dataFetcher.addSingle(dungeonToSubmit);

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
      {!state.id && <p>Please select a dungeon or create a new one below</p>}
      <form data-testid="dungeon-form" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-2">
          <FormTextInput
            id="dungeon-name"
            formInputName="name"
            ariaLabel="Dungeon name"
            formLabelText="Name"
            placeholder="e.g. The Lost Ruins"
            pattern="(\w|\s){1,}"
            patternMessage="Alphanumeric characters"
            value={state.name}
            isRequired={true}
            onChangeCallback={(dungeonName) =>
              dispatch({
                type: DungeonFormActionTypes.UPDATE_NAME,
                payload: dungeonName,
              })
            }
            errorMessage={state.dungeonNameInputError}
          />
          <FormTextInput
            id="dungeon-summary"
            formInputName="summary"
            ariaLabel="Dungeon summary"
            formLabelText="Summary"
            placeholder="e.g. Shadowy ruins of an old Dwarvern mining outpost"
            pattern="(\w|\s){1,}"
            patternMessage="Alphanumeric characters"
            value={state.summary}
            isRequired={true}
            onChangeCallback={(dungeonSummary) =>
              dispatch({
                type: DungeonFormActionTypes.UPDATE_SUMMARY,
                payload: dungeonSummary,
              })
            }
            errorMessage={state.dungeonSummaryInputError}
          />
          <FormTextInput
            id="dungeon-level-min"
            formInputName="levelMin"
            ariaLabel="Dungeon Minimum Level"
            formLabelText="Minimum Level"
            placeholder="1"
            pattern="(\d){1,}"
            patternMessage="Numerical characters"
            value={state.levelMin}
            isRequired={true}
            onChangeCallback={(dungeonLevelMin) =>
              dispatch({
                type: DungeonFormActionTypes.UPDATE_LEVEL_MIN,
                payload: dungeonLevelMin,
              })
            }
            errorMessage={state.dungeonLevelMinInputError}
          />
          <FormTextInput
            id="dungeon-level-max"
            formInputName="levelMax"
            ariaLabel="Dungeon Maximum Level"
            formLabelText="Maximum Level"
            placeholder="3"
            pattern="(\d){1,}"
            patternMessage="Numerical characters"
            value={state.levelMax}
            isRequired={true}
            onChangeCallback={(dungeonLevelMax) =>
              dispatch({
                type: DungeonFormActionTypes.UPDATE_LEVEL_MAX,
                payload: dungeonLevelMax,
              })
            }
            errorMessage={state.dungeonLevelMaxInputError}
          />
          <FormTextInput
            id="dungeon-player-count"
            formInputName="playerCount"
            ariaLabel="Dungeon Player Count"
            formLabelText="Intended Player Count"
            placeholder="4"
            pattern="(\d){1,}"
            patternMessage="Numerical characters"
            value={state.playerCount}
            isRequired={true}
            onChangeCallback={(dungeonPlayerCount) =>
              dispatch({
                type: DungeonFormActionTypes.UPDATE_PLAYER_COUNT,
                payload: dungeonPlayerCount,
              })
            }
            errorMessage={state.dungeonPlayerCountInputError}
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
