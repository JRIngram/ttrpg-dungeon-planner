import { Room, UpsertRoom } from "@/types/room";

export class RoomUpserter {
  constructor() {}

  mapRoomToUpsertFormat(room: Room): UpsertRoom {
    return {
      id: room.id,
      name: room.name,
      description: room.description,
      dungeon: room.dungeon,
      monsters: room.monsters.map((monster) => ({
        monster: monster.id,
        quantity: monster.quantity,
      })),
      traps: room.traps.map((trap) => ({
        trap: trap.id,
        quantity: trap.quantity,
      })),
    };
  }
}
