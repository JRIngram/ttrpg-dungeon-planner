export enum EncounterMultiplierConfigFormActionTypes {
  "UPDATE_MIN",
  "SET_MIN_ERROR",
  "UPDATE_MAX",
  "SET_MAX_ERROR",
  "UPDATE_MULTIPLIER",
  "SET_MULTIPLIER_ERROR",
}

type UpdateMin = {
  type: EncounterMultiplierConfigFormActionTypes.UPDATE_MIN;
  payload: number;
};

type UpdateMax = {
  type: EncounterMultiplierConfigFormActionTypes.UPDATE_MAX;
  payload: number;
};

type UpdateMultiplier = {
  type: EncounterMultiplierConfigFormActionTypes.UPDATE_MULTIPLIER;
  payload: number;
};

type SetMinError = {
  type: EncounterMultiplierConfigFormActionTypes.SET_MIN_ERROR;
  payload: string;
};

type SetMaxError = {
  type: EncounterMultiplierConfigFormActionTypes.SET_MAX_ERROR;
  payload: string;
};

type SetMultiplierError = {
  type: EncounterMultiplierConfigFormActionTypes.SET_MULTIPLIER_ERROR;
  payload: string;
};
