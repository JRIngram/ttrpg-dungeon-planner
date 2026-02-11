import { MonsterWithQuantity } from "@/types/monster";
import { Room } from "@/types/room";
import { TrapWithQuantity } from "@/types/trap";

export enum RoomFormActionTypes {
  "UPDATE_NAME",
  "UPDATE_DESCRIPTION",
  "SET_NAME_ERROR",
  "SET_DESCRIPTION_ERROR",
  "UPDATE_MONSTERS",
  "UPDATE_TRAPS",
  "SET_MONSTER_ID_ERROR",
  "SET_MONSTER_QUANTITY_ERROR",
  "SET_TRAP_ID_ERROR",
  "SET_TRAP_QUANTITY_ERROR",
}

type UpdateName = {
  type: RoomFormActionTypes.UPDATE_NAME;
  payload: string;
};

type UpdateDescription = {
  type: RoomFormActionTypes.UPDATE_DESCRIPTION;
  payload: string;
};

type SetNameError = {
  type: RoomFormActionTypes.SET_NAME_ERROR;
  payload: string;
};

type SetDescriptionError = {
  type: RoomFormActionTypes.SET_DESCRIPTION_ERROR;
  payload: string;
};

type UpdateMonsters = {
  type: RoomFormActionTypes.UPDATE_MONSTERS;
  payload: MonsterWithQuantity[];
};

type UpdateTraps = {
  type: RoomFormActionTypes.UPDATE_TRAPS;
  payload: TrapWithQuantity[];
};

type SetMonsterIdError = {
  type: RoomFormActionTypes.SET_MONSTER_ID_ERROR;
  payload: string;
};

type SetMonsterQuantityError = {
  type: RoomFormActionTypes.SET_MONSTER_QUANTITY_ERROR;
  payload: string;
};

type SetTrapIdError = {
  type: RoomFormActionTypes.SET_TRAP_ID_ERROR;
  payload: string;
};

type SetTrapQuantityError = {
  type: RoomFormActionTypes.SET_TRAP_QUANTITY_ERROR;
  payload: string;
};

type RoomFormAction =
  | UpdateName
  | UpdateDescription
  | SetNameError
  | SetDescriptionError
  | UpdateMonsters
  | UpdateTraps
  | SetMonsterIdError
  | SetMonsterQuantityError
  | SetTrapIdError
  | SetTrapQuantityError;

type RoomForm = Room & {
  roomNameInputError: string;
  roomDescriptionInputError: string;
  monsterIdError: string;
  monsterQuantityError: string;
  trapIdError: string;
  trapQuantityError: string;
};

export const roomFormReducer = (state: RoomForm, action: RoomFormAction) => {
  switch (action.type) {
    case RoomFormActionTypes.UPDATE_NAME:
      return {
        ...state,
        name: action.payload,
      };
    case RoomFormActionTypes.UPDATE_DESCRIPTION:
      return {
        ...state,
        description: action.payload,
      };
    case RoomFormActionTypes.UPDATE_MONSTERS:
      return {
        ...state,
        monsters: action.payload,
      };
    case RoomFormActionTypes.UPDATE_TRAPS:
      return {
        ...state,
        traps: action.payload,
      };
    case RoomFormActionTypes.SET_NAME_ERROR:
      return {
        ...state,
        roomNameInputError: action.payload,
      };
    case RoomFormActionTypes.SET_DESCRIPTION_ERROR:
      return {
        ...state,
        roomDescriptionInputError: action.payload,
      };
    case RoomFormActionTypes.SET_MONSTER_ID_ERROR:
      return {
        ...state,
        monsterIdError: action.payload,
      };
    case RoomFormActionTypes.SET_MONSTER_QUANTITY_ERROR:
      return {
        ...state,
        monsterQuantityError: action.payload,
      };
    case RoomFormActionTypes.SET_TRAP_ID_ERROR:
      return {
        ...state,
        trapIdError: action.payload,
      };
    case RoomFormActionTypes.SET_TRAP_QUANTITY_ERROR:
      return {
        ...state,
        trapQuantityError: action.payload,
      };
    default:
      return state;
  }
};

export const getInitialState = (existingRoom: Room | undefined): RoomForm => {
  const baseInitialValue = {
    id: "",
    name: "",
    description: "",
    dungeonId: "",
    monsters: [],
    traps: [],
    roomNameInputError: "",
    roomDescriptionInputError: "",
    monsterIdError: "",
    monsterQuantityError: "",
    trapIdError: "",
    trapQuantityError: "",
  };

  return existingRoom
    ? {
        ...baseInitialValue,
        ...existingRoom,
        roomNameInputError: "",
        roomDescriptionInputError: "",
        monsterIdError: "",
        monsterQuantityError: "",
        trapIdError: "",
        trapQuantityError: "",
      }
    : baseInitialValue;
};
