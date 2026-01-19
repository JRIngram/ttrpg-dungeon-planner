import { AddMonster } from "@/types/monster";

export enum MonsterFormActionTypes {
  "UPDATE_NAME",
  "UPDATE_XP",
}

type UpdateName = {
  type: MonsterFormActionTypes.UPDATE_NAME;
  payload: string;
};

type UpdateXP = {
  type: MonsterFormActionTypes.UPDATE_XP;
  payload: string;
};

type MonsterFormAction = UpdateName | UpdateXP;

export const monsterFormReducer = (
  state: AddMonster,
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
        name: action.payload,
      };
    default:
      return state;
  }
};

export const initialState: AddMonster = {
  name: "",
  xp: 0,
};
