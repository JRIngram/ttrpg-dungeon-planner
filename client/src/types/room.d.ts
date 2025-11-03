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

export type AddRoom = Exclude<Room, "id">;

export type ServerRoom = {
  id: RoomId;
  name: string;
  description: string;
  dungeon: DungeonId;
  monsters: MonsterId[];
  traps: TrapId[];
};
