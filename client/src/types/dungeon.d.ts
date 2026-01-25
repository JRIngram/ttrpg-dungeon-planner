export type DungeonId = string;

export type Dungeon = {
  id: DungeonId;
  name: string;
  summary: string;
  levelMin: number;
  levelMax: number;
  playerCount: number;
};

export type AddOrEditDungeon = AddDungeon | EditDungeon;

export type AddDungeon = Omit<Dungeon, "id">;

/**
 * Unlike other entities, Dungeon does not have "isDeletable"
 * and so EditDungeon = Dungeon. Defined explicitly for standardisation
 * across entities.
 */
export type EditDungeon = Dungeon;

export type ServerDungeon = {
  id: DungeonId;
  name: string;
  summary: string;
  level_min: number;
  level_max: number;
  player_count: number;
};
