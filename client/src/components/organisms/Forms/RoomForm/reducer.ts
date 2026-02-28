import { MonsterWithQuantity } from "@/types/monster";
import {
  Room,
  UpsertRoom,
  UpsertRoomMonster,
  UpsertRoomTrap,
} from "@/types/room";
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
  payload: UpsertRoomMonster[];
};

type UpdateTraps = {
  type: RoomFormActionTypes.UPDATE_TRAPS;
  payload: UpsertRoomTrap[];
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

export type RoomForm = UpsertRoom & {
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

export const getInitialState = (
  existingRoom: UpsertRoom | undefined,
  dungeonId: string,
): RoomForm => {
  const baseInitialValue = {
    id: "",
    name: "",
    description: "",
    dungeon: dungeonId,
    monsters: [],
    traps: [],
    roomNameInputError: "",
    roomDescriptionInputError: "",
    monsterIdError: "",
    monsterQuantityError: "",
    trapIdError: "",
    trapQuantityError: "",
  };

  if (existingRoom) {
    const formattedExistingRoom: UpsertRoom = {
      id: existingRoom?.id ?? "",
      name: existingRoom?.name ?? "",
      description: existingRoom?.description ?? "",
      dungeon: existingRoom?.dungeon ?? "",
      monsters: existingRoom?.monsters ?? [],
      traps: existingRoom?.traps ?? [],
    };

    return {
      ...baseInitialValue,
      ...formattedExistingRoom,
    };
  }

  return baseInitialValue;
};
