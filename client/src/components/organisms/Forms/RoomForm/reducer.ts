import { MonsterWithQuantity } from "@/types/monster";
import { Room } from "@/types/room";
import { TrapWithQuantity } from "@/types/trap";

export enum RoomFormActionTypes {
  "UPDATE_NAME",
  "UPDATE_DESCRIPTION",
  "SET_NAME_ERROR",
  "SET_DESCRIPTION_ERROR",
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

type RoomFormAction = UpdateName | UpdateDescription | SetNameError | SetDescriptionError;

type RoomForm = Room & {
  roomNameInputError: string;
  roomDescriptionInputError: string;
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
  };

  return existingRoom
    ? {
        ...baseInitialValue,
        ...existingRoom,
      }
    : baseInitialValue;
};
