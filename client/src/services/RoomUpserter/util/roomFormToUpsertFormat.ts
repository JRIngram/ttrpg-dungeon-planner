import { RoomForm } from "@/components/organisms/Forms/RoomForm/reducer";

export const roomFormToUpsertFormat = (roomForm: RoomForm) => {
  const { id, name, description, dungeon, monsters, traps } = roomForm;

  const filteredTraps = traps.filter((t) => {
    const trapHasId = hasId(t.trap);
    const trapHasQuantity = hasValidQuantity(t.quantity);
    return trapHasId && trapHasQuantity;
  });

  const filteredMonsters = monsters.filter((m) => {
    const monsterHasId = hasId(m.monster);
    const monsterHasQuantity = hasValidQuantity(m.quantity);
    return monsterHasId && monsterHasQuantity;
  });

  return {
    id,
    name,
    description,
    dungeon,
    monsters: filteredMonsters,
    traps: filteredTraps,
  };
};

const hasId = (id: string | number | undefined) =>
  id !== "" && id !== undefined;

const hasValidQuantity = (quantity: number) => quantity > 0;
