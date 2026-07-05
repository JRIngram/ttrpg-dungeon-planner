export type ServerEncounterMultiplierConfigRow = {
  id: number;
  min: number;
  max: number | null;
  multiplier: number;
};

export type EncounterMultiplierConfigRow = {
  id: number;
  min: number;
  max: number | null;
  multiplier: number;
};

export type AddOrEditEncounterMultiplierConfigRow = {
  id?: number;
  min: number;
  max: number | null;
  multiplier: number;
};

export type ServerEncounterRatingConfigRow = {
  id: number;
  level: number;
  easy: number;
  medium: number;
  hard: number;
  extreme: number;
};

export type EncounterRatingConfigRow = {
  id: number;
  level: number;
  easy: number;
  medium: number;
  hard: number;
  extreme: number;
};

export type AddOrEditEncounterRatingConfigRow = {
  id?: number;
  level: number;
  easy: number;
  medium: number;
  hard: number;
  extreme: number;
};
