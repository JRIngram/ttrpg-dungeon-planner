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
        name: action.payload,
      };
    default:
      return state;
  }
};

export const initialState: MonsterForm = {
  name: "",
  xp: 0,
  monsterNameInputError: "",
  monsterXpInputError: "",
};
