import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import {
  type EncounterRating,
  EncounterRatingPill,
} from "./EncounterRatingPill";

describe("EncounterRatingPill", () => {
  it.each([
    "trivial",
    "easy",
    "medium",
    "hard",
    "extreme",
    "unavailable",
  ] as EncounterRating[])(
    "Renders EncounterRatingPill when rating is %s",
    (rating) => {
      render(<EncounterRatingPill rating={rating} />);
    },
  );
});
