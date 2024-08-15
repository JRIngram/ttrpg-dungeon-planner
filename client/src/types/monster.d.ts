export type MonsterId = string;

export type Monster = {
  id: MonsterId;
  name: string;
  xp: number;
  isDeletable?: boolean;
};

export type ServerMonster = {
  id: string;
  name: string;
  xp: number;
  is_deletable?: boolean;
};
