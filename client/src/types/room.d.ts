import type { DungeonId } from "./dungeon";
import type { Monster, MonsterId, MonsterWithQuantity } from "./monster";
import type { Trap, TrapId, TrapWithQuantity } from "./trap";

export type RoomId = number;

export type Room = {
  id: RoomId;
  name: string;
  description: string;
  dungeon: DungeonId;
  monsters: MonsterWithQuantity[];
  traps: TrapWithQuantity[];
};

export type RoomWithStringifiedFields = {
  id?: string;
  name: string;
  description: string;
  dungeon: string;
  monsters: {
    id: string;
    name: string;
    xp: string;
    quantity: string;
  }[];
  traps: {
    id: string;
    name: string;
    effect: string;
    quantity: string;
  }[];
};

export type UpsertRoom = {
  id?: string;
  name: string;
  description: string;
  dungeon: string;
  monsters: UpsertRoomMonster[];
  traps: UpsertRoomTrap[];
};

export type UpsertRoomMonster = {
  quantity: number;
  monster: MonsterId;
};

export type UpsertRoomTrap = {
  quantity: number;
  trap: TrapId;
};
