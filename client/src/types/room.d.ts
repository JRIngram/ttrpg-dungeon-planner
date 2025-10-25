import { DungeonId } from "./dungeon";
import { MonsterId } from "./monster";
import { TrapId } from "./trap";

export type RoomId = string;

export type Room = {
  id: RoomId;
  name: string;
  description: string;
  dungeonId: DungeonId;
  monsters: MonsterId[];
  traps: TrapId[];
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
