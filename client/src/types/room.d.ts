import type { DungeonId } from "./dungeon";
import type { MonsterId, MonsterWithQuantity } from "./monster";
import type { TrapId, TrapWithQuantity } from "./trap";

export type RoomId = string;

export type Room = {
  id: RoomId;
  name: string;
  description: string;
  dungeonId: DungeonId;
  monsters: MonsterWithQuantity[];
  traps: TrapWithQuantity[];
};

export type AddRoom = Omit<Room, "id">;

export type ServerRoom = {
  id: RoomId;
  name: string;
  description: string;
  dungeon: DungeonId;
  monsters: MonsterWithQuantity[];
  traps: TrapWithQuantity[];
};

// API format types for room creation/editing
export type ApiRoomMonster = {
  quantity: string;
  monster: MonsterId;
};

export type ApiRoomTrap = {
  quantity: string;
  trap: TrapId;
};

export type ApiRoomData = {
  name: string;
  description: string;
  dungeon: DungeonId;
  monsters: ApiRoomMonster[];
  traps: ApiRoomTrap[];
};
