import { AddRoom, Room } from "@/types/room";
import { RoomDataFetcher } from "@/services/RoomDataFetcher.ts/RoomDataFetcher";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { useReducer } from "react";
import {
  getInitialState,
  RoomFormActionTypes,
  roomFormReducer,
} from "./reducer";
import { useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";

type Props = {
  onSubmitCallback: (entity: Room) => void;
  onCancelCallback: () => void;
  existingRoom?: Room;
};

export const RoomForm = ({
  onCancelCallback,
  onSubmitCallback,
  existingRoom,
}: Props) => {
  const [state, dispatch] = useReducer(
    roomFormReducer,
    getInitialState(existingRoom),
  );
  const toastsDispatch = useToastsDispatch();

  const validateInputs = () => {
    let errorsPresent = false;
    const roomNameRegex = /(\w|\s){1,}/;
    const roomDescriptionRegex = /(\w|\s){1,}/;

    if (!state.name.match(roomNameRegex)) {
      dispatch({
        type: RoomFormActionTypes.SET_NAME_ERROR,
        payload: "Alphanumerical characters only.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: RoomFormActionTypes.SET_NAME_ERROR,
        payload: "",
      });
    }

    if (!state.description.match(roomDescriptionRegex)) {
      dispatch({
        type: RoomFormActionTypes.SET_DESCRIPTION_ERROR,
        payload: "Alphanumerical characters only.",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: RoomFormActionTypes.SET_DESCRIPTION_ERROR,
        payload: "",
      });
    }

    return errorsPresent;
  };

  const submitForm = async () => {
    if (validateInputs()) return;

    const dataFetcher = new RoomDataFetcher();

    const roomData: AddRoom = {
      name: state.name,
      description: state.description,
      dungeonId: state.dungeonId || "",
      monsters: state.monsters,
      traps: state.traps,
    };

    const roomToEdit: Room = {
      ...roomData,
      id: state.id,
    };

    const { entity, httpCode } = state.id
      ? await dataFetcher.editSingle(roomToEdit)
      : await dataFetcher.addSingle(roomData);

    if (entity === undefined) {
      toastsDispatch({
        type: "add",
        toast: {
          message: `Could not add entity. HTTP ${httpCode}`,
          type: ToastType.WARNING,
        },
      });
    } else {
      onSubmitCallback(entity);
      toastsDispatch({
        type: "add",
        toast: {
          message: `Added entity`,
          type: ToastType.SUCCESS,
        },
      });
    }
  };

  return (
    <>
      {!state.id && <p>Please select a room or create a new one below</p>}
      <form data-testid="room-form" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-2">
          <FormTextInput
            id="room-name"
            formInputName="name"
            ariaLabel="Room name"
            formLabelText="Name"
            placeholder="e.g. The Treasure Chamber"
            pattern="(\w|\s){1,}"
            patternMessage="Alphanumeric characters"
            value={state.name}
            isRequired={true}
            onChangeCallback={(roomName) =>
              dispatch({
                type: RoomFormActionTypes.UPDATE_NAME,
                payload: roomName,
              })
            }
            errorMessage={state.roomNameInputError}
          />
          <FormTextInput
            id="room-description"
            formInputName="description"
            ariaLabel="Room description"
            formLabelText="Description"
            placeholder="e.g. A large chamber filled with golden treasures and ancient artifacts"
            pattern="(\w|\s){1,}"
            patternMessage="Alphanumeric characters"
            value={state.description}
            isRequired={true}
            onChangeCallback={(roomDescription) =>
              dispatch({
                type: RoomFormActionTypes.UPDATE_DESCRIPTION,
                payload: roomDescription,
              })
            }
            errorMessage={state.roomDescriptionInputError}
          />
        </div>
        <div className="mt-4">
          <ButtonRow
            buttons={[
              {
                text: "Save",
                onClick: async () => {
                  submitForm();
                },
                variant: "primaryFilled",
                isSubmit: true,
              },
              {
                text: "Cancel",
                onClick: onCancelCallback,
                variant: "tertiaryOutline",
              },
            ]}
          />
        </div>
      </form>
    </>
  );
};
