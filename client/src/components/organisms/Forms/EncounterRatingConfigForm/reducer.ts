import { AddOrEditEncounterRatingConfigRow } from "@/types/configs";

export enum EncounterRatingConfigFormActionTypes {
  UPDATE_LEVEL = "UPDATE_LEVEL",
  UPDATE_EASY = "UPDATE_EASY",
  UPDATE_MEDIUM = "UPDATE_MEDIUM",
  UPDATE_HARD = "UPDATE_HARD",
  UPDATE_EXTREME = "UPDATE_EXTREME",
  SET_LEVEL_ERROR = "SET_LEVEL_ERROR",
  SET_EASY_ERROR = "SET_EASY_ERROR",
  SET_MEDIUM_ERROR = "SET_MEDIUM_ERROR",
  SET_HARD_ERROR = "SET_HARD_ERROR",
  SET_EXTREME_ERROR = "SET_EXTREME_ERROR",
}

export type EncounterRatingConfigFormState = {
  id?: number;
  level: string;
  easy: string;
  medium: string;
  hard: string;
  extreme: string;
  levelError: string;
  easyError: string;
  mediumError: string;
  hardError: string;
  extremeError: string;
};

export const getInitialState = (
  existingConfig?: AddOrEditEncounterRatingConfigRow
): EncounterRatingConfigFormState => {
  return {
    id: existingConfig?.id,
    level: existingConfig ? `${existingConfig.level}` : "",
    easy: existingConfig ? `${existingConfig.easy}` : "",
    medium: existingConfig ? `${existingConfig.medium}` : "",
    hard: existingConfig ? `${existingConfig.hard}` : "",
    extreme: existingConfig ? `${existingConfig.extreme}` : "",
    levelError: "",
    easyError: "",
    mediumError: "",
    hardError: "",
    extremeError: "",
  };
};

export const encounterRatingConfigFormReducer = (
  state: EncounterRatingConfigFormState,
  action: {
    type: EncounterRatingConfigFormActionTypes;
    payload: string;
  }
): EncounterRatingConfigFormState => {
  switch (action.type) {
    case EncounterRatingConfigFormActionTypes.UPDATE_LEVEL:
      return {
        ...state,
        level: action.payload,
      };
    case EncounterRatingConfigFormActionTypes.UPDATE_EASY:
      return {
        ...state,
        easy: action.payload,
      };
    case EncounterRatingConfigFormActionTypes.UPDATE_MEDIUM:
      return {
        ...state,
        medium: action.payload,
      };
    case EncounterRatingConfigFormActionTypes.UPDATE_HARD:
      return {
        ...state,
        hard: action.payload,
      };
    case EncounterRatingConfigFormActionTypes.UPDATE_EXTREME:
      return {
        ...state,
        extreme: action.payload,
      };
    case EncounterRatingConfigFormActionTypes.SET_LEVEL_ERROR:
      return {
        ...state,
        levelError: action.payload,
      };
    case EncounterRatingConfigFormActionTypes.SET_EASY_ERROR:
      return {
        ...state,
        easyError: action.payload,
      };
    case EncounterRatingConfigFormActionTypes.SET_MEDIUM_ERROR:
      return {
        ...state,
        mediumError: action.payload,
      };
    case EncounterRatingConfigFormActionTypes.SET_HARD_ERROR:
      return {
        ...state,
        hardError: action.payload,
      };
    case EncounterRatingConfigFormActionTypes.SET_EXTREME_ERROR:
      return {
        ...state,
        extremeError: action.payload,
      };
    default:
      return state;
  }
};
