import { RoomForm } from "@/components/organisms/Forms/RoomForm/reducer";

export const roomFormToUpsertFormat = (roomForm: RoomForm) => {
  const { id, name, description, dungeon, monsters, traps } = roomForm;
  return {
    id,
    name,
    description,
    dungeon,
    monsters,
    traps,
  };
};
