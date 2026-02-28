import { Trap } from "@/types/trap";

export enum TrapFormActionTypes {
  "UPDATE_NAME",
  "UPDATE_EFFECT",
  "SET_NAME_ERROR",
  "SET_EFFECT_ERROR",
}

type UpdateName = {
  type: TrapFormActionTypes.UPDATE_NAME;
  payload: string;
};

type UpdateEffect = {
  type: TrapFormActionTypes.UPDATE_EFFECT;
  payload: string;
};

type SetNameError = {
  type: TrapFormActionTypes.SET_NAME_ERROR;
  payload: string;
};

type SetEffectError = {
  type: TrapFormActionTypes.SET_EFFECT_ERROR;
  payload: string;
};

type TrapFormAction = UpdateName | UpdateEffect | SetNameError | SetEffectError;

type TrapForm = Omit<Trap, "isDeletable"> & {
  trapNameInputError: string;
  trapEffectInputError: string;
};

export const trapFormReducer = (state: TrapForm, action: TrapFormAction) => {
  switch (action.type) {
    case TrapFormActionTypes.UPDATE_NAME:
      return {
        ...state,
        name: action.payload,
      };
    case TrapFormActionTypes.UPDATE_EFFECT:
      return {
        ...state,
        effect: action.payload,
      };
    case TrapFormActionTypes.SET_NAME_ERROR:
      return {
        ...state,
        trapNameInputError: action.payload,
      };
    case TrapFormActionTypes.SET_EFFECT_ERROR:
      return {
        ...state,
        trapEffectInputError: action.payload,
      };
    default:
      return state;
  }
};

export const initialState = (existingTrap: Trap | undefined): TrapForm => {
  const baseInitialValue = {
    id: "",
    name: "",
    effect: "",
    trapNameInputError: "",
    trapEffectInputError: "",
  };

  return existingTrap
    ? {
        ...baseInitialValue,
        ...existingTrap,
      }
    : baseInitialValue;
};
