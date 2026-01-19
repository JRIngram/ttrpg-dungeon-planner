import { AddMonster } from "@/types/monster";

export enum MonsterFormActionTypes {
  "UPDATE_NAME",
  "UPDATE_XP",
  "SET_NAME_ERROR",
  "SET_XP_ERROR",
}

type UpdateName = {
  type: MonsterFormActionTypes.UPDATE_NAME;
  payload: string;
};

type UpdateXP = {
  type: MonsterFormActionTypes.UPDATE_XP;
  payload: string;
};

type SetNameError = {
  type: MonsterFormActionTypes.SET_NAME_ERROR;
  payload: string;
};

type SetXPError = {
  type: MonsterFormActionTypes.SET_XP_ERROR;
  payload: string;
};

type MonsterFormAction = UpdateName | UpdateXP | SetNameError | SetXPError;

type MonsterForm = AddMonster & {
  monsterNameInputError: string;
  monsterXpInputError: string;
};

export const monsterFormReducer = (
  state: MonsterForm,
  action: MonsterFormAction,
) => {
  switch (action.type) {
    case MonsterFormActionTypes.UPDATE_NAME:
      return {
        ...state,
        name: action.payload,
      };
    case MonsterFormActionTypes.UPDATE_XP:
      return {
        ...state,
        xp: action.payload,
      };
    case MonsterFormActionTypes.SET_NAME_ERROR:
      return {
        ...state,
        monsterNameInputError: action.payload,
      };
    case MonsterFormActionTypes.SET_XP_ERROR:
      return {
        ...state,
        monsterXpInputError: action.payload,
      };
    default:
      return state;
  }
};

export const initialState: MonsterForm = {
  name: "",
  xp: "",
  monsterNameInputError: "",
  monsterXpInputError: "",
};
