import { AddRoom, Room } from "@/types/room";
import { RoomDataFetcher } from "@/services/RoomDataFetcher.ts/RoomDataFetcher";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { useReducer, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getInitialState,
  RoomFormActionTypes,
  roomFormReducer,
} from "./reducer";
import { useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher/MonsterDataFetcher";
import { TrapDataFetcher } from "@/services/TrapDataFetcher/TrapDataFetcher";
import { DropdownOption } from "@/components/atoms/Dropdown/Dropdown";
import { ItemQuantitySelector } from "@/components/molecules/ItemQuantitySelector/ItemQuantitySelector";
import { MonsterWithQuantity, Monster } from "@/types/monster";
import { TrapWithQuantity, Trap } from "@/types/trap";

type Props = {
  dungeonId: string;
  onSubmitCallback: (entity: Room) => void;
  onCancelCallback: () => void;
  existingRoom?: Room;
};

export const RoomForm = ({
  dungeonId,
  onCancelCallback,
  onSubmitCallback,
  existingRoom,
}: Props) => {
  const [state, dispatch] = useReducer(
    roomFormReducer,
    getInitialState(existingRoom),
  );
  const toastsDispatch = useToastsDispatch();

  const monsterDataFetcher = new MonsterDataFetcher();
  const trapDataFetcher = new TrapDataFetcher();

  const {
    data: monsters = [],
    isLoading: isLoadingMonsters,
    isError: monsterError,
  } = useQuery({
    queryKey: ["get-all-monsters"],
    queryFn: async (): Promise<DropdownOption[]> =>
      (await monsterDataFetcher.getList()).map((monster) => ({
        label: `${monster.name} - ${monster.xp}xp`,
        value: monster.id,
      })),
  });

  const {
    data: traps = [],
    isLoading: isLoadingTraps,
    isError: trapError,
  } = useQuery({
    queryKey: ["get-all-traps"],
    queryFn: async (): Promise<DropdownOption[]> =>
      (await trapDataFetcher.getList()).map((trap) => ({
        label: `${trap.name}`,
        value: trap.id,
      })),
  });

  // State for managing multiple selectors
  const [monsterSelectors, setMonsterSelectors] = useState([{ id: 1 }]);
  const [trapSelectors, setTrapSelectors] = useState([{ id: 1 }]);

  // Helper functions for managing selectors
  const addMonsterSelector = () => {
    const newId = monsterSelectors.length > 0
      ? Math.max(...monsterSelectors.map(s => s.id)) + 1
      : 1;
    setMonsterSelectors([...monsterSelectors, { id: newId }]);
  };

  const removeMonsterSelector = (id: number) => {
    if (monsterSelectors.length > 1) {
      setMonsterSelectors(monsterSelectors.filter(selector => selector.id !== id));
    }
  };

  const addTrapSelector = () => {
    const newId = trapSelectors.length > 0
      ? Math.max(...trapSelectors.map(s => s.id)) + 1
      : 1;
    setTrapSelectors([...trapSelectors, { id: newId }]);
  };

  const removeTrapSelector = (id: number) => {
    if (trapSelectors.length > 1) {
      setTrapSelectors(trapSelectors.filter(selector => selector.id !== id));
    }
  };

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

    // Validate monsters
    if (
      state.monsters.some((monster) => !monster.id || monster.quantity <= 0)
    ) {
      dispatch({
        type: RoomFormActionTypes.SET_MONSTER_ID_ERROR,
        payload: "Please select valid monsters with quantity > 0",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: RoomFormActionTypes.SET_MONSTER_ID_ERROR,
        payload: "",
      });
    }

    // Validate traps
    if (state.traps.some((trap) => !trap.id || trap.quantity <= 0)) {
      dispatch({
        type: RoomFormActionTypes.SET_TRAP_ID_ERROR,
        payload: "Please select valid traps with quantity > 0",
      });
      errorsPresent = true;
    } else {
      dispatch({
        type: RoomFormActionTypes.SET_TRAP_ID_ERROR,
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
      dungeonId: dungeonId,
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

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Monsters</h3>
            <ItemQuantitySelector
              id="room-monster-selector"
              itemName="monsters"
              textInputFormName="monster-quantity"
              dropdownConfig={{
                placeholder: isLoadingMonsters
                  ? "Loading monsters..."
                  : monsterError
                  ? "Error loading monsters!"
                  : "Select monster",
                options: monsters,
              }}
              isRequired={false}
              onItemQuantityChangeCallback={(itemQuantityPair) => {
                const selectedMonsterId = itemQuantityPair.itemValue;
                const quantity = parseInt(itemQuantityPair.quantity) || 0;

                if (selectedMonsterId && quantity > 0) {
                  const selectedMonster = monsters.find(
                    (m) => m.value === selectedMonsterId,
                  );
                  if (selectedMonster) {
                    const monsterName = selectedMonster.label.split(" - ")[0];
                    const monsterXp =
                      selectedMonster.label
                        .split(" - ")[1]
                        ?.replace("xp", "") || "0";

                    const newMonster: MonsterWithQuantity = {
                      id: selectedMonsterId,
                      name: monsterName,
                      xp: monsterXp,
                      quantity: quantity,
                    };

                    const updatedMonsters = [...state.monsters];
                    const existingIndex = updatedMonsters.findIndex(
                      (m) => m.id === selectedMonsterId,
                    );

                    if (existingIndex >= 0) {
                      updatedMonsters[existingIndex].quantity = quantity;
                    } else {
                      updatedMonsters.push(newMonster);
                    }

                    dispatch({
                      type: RoomFormActionTypes.UPDATE_MONSTERS,
                      payload: updatedMonsters,
                    });
                  }
                }
              }}
            />
            {state.monsterIdError && (
              <p className="text-red-500 text-sm mt-1">
                {state.monsterIdError}
              </p>
            )}
            {state.monsterQuantityError && (
              <p className="text-red-500 text-sm mt-1">
                {state.monsterQuantityError}
              </p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Traps</h3>
            <ItemQuantitySelector
              id="room-trap-selector"
              itemName="traps"
              textInputFormName="trap-quantity"
              dropdownConfig={{
                placeholder: isLoadingTraps
                  ? "Loading traps..."
                  : trapError
                  ? "Error loading traps!"
                  : "Select trap",
                options: traps,
              }}
              isRequired={false}
              onItemQuantityChangeCallback={(itemQuantityPair) => {
                const selectedTrapId = itemQuantityPair.itemValue;
                const quantity = parseInt(itemQuantityPair.quantity) || 0;

                if (selectedTrapId && quantity > 0) {
                  const selectedTrap = traps.find(
                    (t) => t.value === selectedTrapId,
                  );
                  if (selectedTrap) {
                    const newTrap: TrapWithQuantity = {
                      id: selectedTrapId,
                      name: selectedTrap.label,
                      effect: "",
                      quantity: quantity,
                    };

                    const updatedTraps = [...state.traps];
                    const existingIndex = updatedTraps.findIndex(
                      (t) => t.id === selectedTrapId,
                    );

                    if (existingIndex >= 0) {
                      updatedTraps[existingIndex].quantity = quantity;
                    } else {
                      updatedTraps.push(newTrap);
                    }

                    dispatch({
                      type: RoomFormActionTypes.UPDATE_TRAPS,
                      payload: updatedTraps,
                    });
                  }
                }
              }}
            />
            {state.trapIdError && (
              <p className="text-red-500 text-sm mt-1">{state.trapIdError}</p>
            )}
            {state.trapQuantityError && (
              <p className="text-red-500 text-sm mt-1">
                {state.trapQuantityError}
              </p>
            )}
          </div>
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
