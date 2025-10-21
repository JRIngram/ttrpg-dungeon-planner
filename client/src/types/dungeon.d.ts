export type DungeonId = string;

export type Dungeon = {
  id: DungeonId;
  name: string;
  summary: string;
  levelMin: number;
  levelMax: number;
  playerCount: number;
};

export type AddDungeon = Exclude<Dungeon, "id">;

export type ServerDungeon = {
  id: DungeonId;
  name: string;
  summary: string;
  level_min: number;
  level_max: number;
  player_count: number;
};
