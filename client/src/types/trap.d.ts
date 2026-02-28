export type TrapId = string;

export type Trap = {
  id: TrapId;
  name: string;
  effect: string;
  isDeletable?: boolean;
};

export type AddOrEditTrap = AddTrap | EditTrap;

export type AddTrap = Omit<Trap, "id" | "isDeletable">;

export type EditTrap = Omit<Trap, "isDeletable">;

export interface TrapWithQuantity extends Partial<Trap> {
  id: string;
  quantity: number;
}

export type ServerTrap = {
  id: string;
  name: string;
  effect: string;
  is_deletable?: boolean;
};
