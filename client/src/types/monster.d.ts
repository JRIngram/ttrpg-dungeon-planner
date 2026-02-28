export type MonsterId = string;

export type Monster = {
  id: MonsterId;
  name: string;
  xp: string;
  isDeletable?: boolean;
};

export type AddOrEditMonster = AddMonster | EditMonster;

export type AddMonster = Omit<Monster, "id" | "isDeletable">;

export type EditMonster = Omit<Monster, "isDeletable">;

export interface MonsterWithQuantity extends Partial<Monster> {
  id: MonsterId;
  quantity: number;
}

export type ServerMonster = {
  id: string;
  name: string;
  xp: number;
  is_deletable?: boolean;
};
