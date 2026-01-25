import { Dungeon } from "@/types/dungeon";

export enum DungeonFormActionTypes {
  "UPDATE_NAME",
  "UPDATE_SUMMARY",
  "UPDATE_LEVEL_MIN",
  "UPDATE_LEVEL_MAX",
  "UPDATE_PLAYER_COUNT",
  "SET_NAME_ERROR",
  "SET_SUMMARY_ERROR",
  "SET_LEVEL_MIN_ERROR",
  "SET_LEVEL_MAX_ERROR",
  "SET_PLAYER_COUNT_ERROR",
}

type UpdateName = {
  type: DungeonFormActionTypes.UPDATE_NAME;
  payload: string;
};

type UpdateSummary = {
  type: DungeonFormActionTypes.UPDATE_SUMMARY;
  payload: string;
};

type UpdateLevelMin = {
  type: DungeonFormActionTypes.UPDATE_LEVEL_MIN;
  payload: string;
};

type UpdateLevelMax = {
  type: DungeonFormActionTypes.UPDATE_LEVEL_MAX;
  payload: string;
};

type UpdatePlayerCount = {
  type: DungeonFormActionTypes.UPDATE_PLAYER_COUNT;
  payload: string;
};

type SetNameError = {
  type: DungeonFormActionTypes.SET_NAME_ERROR;
  payload: string;
};

type SetSummaryError = {
  type: DungeonFormActionTypes.SET_SUMMARY_ERROR;
  payload: string;
};

type SetLevelMinError = {
  type: DungeonFormActionTypes.SET_LEVEL_MIN_ERROR;
  payload: string;
};

type SetLevelMaxError = {
  type: DungeonFormActionTypes.SET_LEVEL_MAX_ERROR;
  payload: string;
};

type SetPlayerCountError = {
  type: DungeonFormActionTypes.SET_PLAYER_COUNT_ERROR;
  payload: string;
};

type DungeonFormAction =
  | UpdateName
  | UpdateSummary
  | UpdateLevelMin
  | UpdateLevelMax
  | UpdatePlayerCount
  | SetNameError
  | SetSummaryError
  | SetLevelMinError
  | SetLevelMaxError
  | SetPlayerCountError;

type DungeonForm = {
  id: string;
  name: string;
  summary: string;
  levelMin: string;
  levelMax: string;
  playerCount: string;
  dungeonNameInputError: string;
  dungeonSummaryInputError: string;
  dungeonLevelMinInputError: string;
  dungeonLevelMaxInputError: string;
  dungeonPlayerCountInputError: string;
};

export const dungeonFormReducer = (
  state: DungeonForm,
  action: DungeonFormAction,
) => {
  switch (action.type) {
    case DungeonFormActionTypes.UPDATE_NAME:
      return {
        ...state,
        name: action.payload,
      };
    case DungeonFormActionTypes.UPDATE_SUMMARY:
      return {
        ...state,
        summary: action.payload,
      };
    case DungeonFormActionTypes.UPDATE_LEVEL_MIN:
      return {
        ...state,
        levelMin: action.payload,
      };
    case DungeonFormActionTypes.UPDATE_LEVEL_MAX:
      return {
        ...state,
        levelMax: action.payload,
      };
    case DungeonFormActionTypes.UPDATE_PLAYER_COUNT:
      return {
        ...state,
        playerCount: action.payload,
      };
    case DungeonFormActionTypes.SET_NAME_ERROR:
      return {
        ...state,
        dungeonNameInputError: action.payload,
      };
    case DungeonFormActionTypes.SET_SUMMARY_ERROR:
      return {
        ...state,
        dungeonSummaryInputError: action.payload,
      };
    case DungeonFormActionTypes.SET_LEVEL_MIN_ERROR:
      return {
        ...state,
        dungeonLevelMinInputError: action.payload,
      };
    case DungeonFormActionTypes.SET_LEVEL_MAX_ERROR:
      return {
        ...state,
        dungeonLevelMaxInputError: action.payload,
      };
    case DungeonFormActionTypes.SET_PLAYER_COUNT_ERROR:
      return {
        ...state,
        dungeonPlayerCountInputError: action.payload,
      };
    default:
      return state;
  }
};

export const getInitialState = (
  existingDungeon: Dungeon | undefined,
): DungeonForm => {
  const baseInitialValue = {
    id: "",
    name: "",
    summary: "",
    levelMin: "",
    levelMax: "",
    playerCount: "",
    dungeonNameInputError: "",
    dungeonSummaryInputError: "",
    dungeonLevelMinInputError: "",
    dungeonLevelMaxInputError: "",
    dungeonPlayerCountInputError: "",
  };

  return existingDungeon
    ? {
        ...baseInitialValue,
        id: existingDungeon.id,
        name: existingDungeon.name,
        summary: existingDungeon.summary,
        levelMin: existingDungeon.levelMin.toString(),
        levelMax: existingDungeon.levelMax.toString(),
        playerCount: existingDungeon.playerCount.toString(),
      }
    : baseInitialValue;
};
