import { AddRoom, Room } from "@/types/room";
import { RoomDataFetcher } from "@/services/RoomDataFetcher.ts/RoomDataFetcher";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { useReducer, useState, useEffect } from "react";
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

  // State for monsters and traps dropdown options
  const [monsters, setMonsters] = useState<DropdownOption[]>([]);
  const [traps, setTraps] = useState<DropdownOption[]>([]);
  const [isLoadingMonsters, setIsLoadingMonsters] = useState(true);
  const [isLoadingTraps, setIsLoadingTraps] = useState(true);
  const [monsterError, setMonsterError] = useState(false);
  const [trapError, setTrapError] = useState(false);

  // Load monsters and traps data
  useEffect(() => {
    const monsterDataFetcher = new MonsterDataFetcher();
    const trapDataFetcher = new TrapDataFetcher();

    const loadMonsters = async () => {
      try {
        setIsLoadingMonsters(true);
        const monsterList = await monsterDataFetcher.getList();
        setMonsters(
          monsterList.map((monster) => ({
            label: `${monster.name} - ${monster.xp}xp`,
            value: monster.id,
          })),
        );
        setMonsterError(false);
      } catch (error) {
        console.error("Error loading monsters:", error);
        setMonsterError(true);
      } finally {
        setIsLoadingMonsters(false);
      }
    };

    const loadTraps = async () => {
      try {
        setIsLoadingTraps(true);
        const trapList = await trapDataFetcher.getList();
        setTraps(
          trapList.map((trap) => ({
            label: `${trap.name}`,
            value: trap.id,
          })),
        );
        setTrapError(false);
      } catch (error) {
        console.error("Error loading traps:", error);
        setTrapError(true);
      } finally {
        setIsLoadingTraps(false);
      }
    };

    loadMonsters();
    loadTraps();
  }, []);

  const getPlaceholderMessage = (
    category: string,
    isLoading: boolean,
    isError: boolean,
  ) => {
    if (isLoading) {
      return `Loading ${category}`;
    } else if (isError) {
      return `Error loading ${category}`;
    } else {
      return `Select ${category}`;
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

    console.log({ dungeonId });

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

          {/* Monster Selector */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Monsters</h3>
            <ItemQuantitySelector
              id="room-monster-selector"
              itemName="monsters"
              textInputFormName="monster-quantity"
              dropdownConfig={{
                placeholder: getPlaceholderMessage(
                  "monsters",
                  isLoadingMonsters,
                  monsterError,
                ),
                options: monsters,
              }}
              isRequired={false}
              onItemQuantityChangeCallback={(itemQuantityPair) => {
                console.log("yo", itemQuantityPair);
                // Handle monster selection and quantity
                const selectedMonsterId = itemQuantityPair.itemValue;
                const quantity = parseInt(itemQuantityPair.quantity) || 0;

                if (selectedMonsterId && quantity > 0) {
                  const selectedMonster = monsters.find(
                    (m) => m.value === selectedMonsterId,
                  );
                  if (selectedMonster) {
                    // Find the monster details from the dropdown
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

                    // Update monsters array
                    const updatedMonsters = [...state.monsters];
                    const existingIndex = updatedMonsters.findIndex(
                      (m) => m.id === selectedMonsterId,
                    );

                    if (existingIndex >= 0) {
                      // Update existing monster quantity
                      updatedMonsters[existingIndex].quantity = quantity;
                    } else {
                      // Add new monster
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

          {/* Trap Selector */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Traps</h3>
            <ItemQuantitySelector
              id="room-trap-selector"
              itemName="traps"
              textInputFormName="trap-quantity"
              dropdownConfig={{
                placeholder: getPlaceholderMessage(
                  "traps",
                  isLoadingTraps,
                  trapError,
                ),
                options: traps,
              }}
              isRequired={false}
              onItemQuantityChangeCallback={(itemQuantityPair) => {
                // Handle trap selection and quantity
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
                      effect: "", // Effect will be fetched from API if needed
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
