import { AddOrEditEncounterMultiplierConfigRow } from "@/types/configs";

export enum EncounterMultiplierConfigFormActionTypes {
  UPDATE_MIN = "UPDATE_MIN",
  UPDATE_MAX = "UPDATE_MAX",
  UPDATE_MULTIPLIER = "UPDATE_MULTIPLIER",
  SET_MIN_ERROR = "SET_MIN_ERROR",
  SET_MAX_ERROR = "SET_MAX_ERROR",
  SET_MULTIPLIER_ERROR = "SET_MULTIPLIER_ERROR",
}

export type EncounterMultiplierConfigFormState = {
  id?: number;
  min: string;
  max: string;
  multiplier: string;
  minError: string;
  maxError: string;
  multiplierError: string;
};

export const getInitialState = (
  existingConfig?: AddOrEditEncounterMultiplierConfigRow
): EncounterMultiplierConfigFormState => {
  return {
    id: existingConfig?.id,
    min: existingConfig ? `${existingConfig.min}` : "",
    max: existingConfig && existingConfig.max !== null ? `${existingConfig.max}` : "",
    multiplier: existingConfig ? `${existingConfig.multiplier}` : "",
    minError: "",
    maxError: "",
    multiplierError: "",
  };
};

export const encounterMultiplierConfigFormReducer = (
  state: EncounterMultiplierConfigFormState,
  action: {
    type: EncounterMultiplierConfigFormActionTypes;
    payload: string;
  }
): EncounterMultiplierConfigFormState => {
  switch (action.type) {
    case EncounterMultiplierConfigFormActionTypes.UPDATE_MIN:
      return {
        ...state,
        min: action.payload,
      };
    case EncounterMultiplierConfigFormActionTypes.UPDATE_MAX:
      return {
        ...state,
        max: action.payload,
      };
    case EncounterMultiplierConfigFormActionTypes.UPDATE_MULTIPLIER:
      return {
        ...state,
        multiplier: action.payload,
      };
    case EncounterMultiplierConfigFormActionTypes.SET_MIN_ERROR:
      return {
        ...state,
        minError: action.payload,
      };
    case EncounterMultiplierConfigFormActionTypes.SET_MAX_ERROR:
      return {
        ...state,
        maxError: action.payload,
      };
    case EncounterMultiplierConfigFormActionTypes.SET_MULTIPLIER_ERROR:
      return {
        ...state,
        multiplierError: action.payload,
      };
    default:
      return state;
  }
};
