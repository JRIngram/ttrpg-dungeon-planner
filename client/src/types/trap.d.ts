export type TrapId = string;

export type Trap = {
  id: TrapId;
  name: string;
  effect: string;
  isDeletable?: boolean;
};

export type AddTrap = Exclude<Trap, 'id' | 'isDeletable'>

export type ServerTrap = {
  id: string;
  name: string;
  effect: string;
  is_deletable?: boolean;
};
