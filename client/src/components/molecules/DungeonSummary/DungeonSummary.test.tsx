import { describe, expect, it } from "vitest";
import { DungeonSummary } from "./DungeonSummary";
import { render, screen } from "@testing-library/react";
import { Dungeon } from "@/types/dungeon";

const mockDungeon: Dungeon = {
  id: "1",
  name: "Test Dungeon",
  summary: "A great dungeon to test in!",
  levelMin: 1,
  levelMax: 3,
  playerCount: 4,
};

describe("DungeonSummary", () => {
  it("Displays the name of the dungeon", () => {
    render(<DungeonSummary dungeon={mockDungeon} />);

    expect(screen.getByText(mockDungeon.name)).toBeVisible();
  });

  it("Displays the summary description of the dungeon", () => {
    render(<DungeonSummary dungeon={mockDungeon} />);

    expect(screen.getByText(mockDungeon.summary)).toBeVisible();
  });

  describe("level and players rubric", () => {
    it("Displays generic rubric when levels are different values and there are multiple players", () => {
      render(<DungeonSummary dungeon={mockDungeon} />);

      const expected = `For ${mockDungeon.playerCount} players, at levels ${mockDungeon.levelMin} to ${mockDungeon.levelMax}.`;
      expect(screen.getByText(expected)).toBeVisible();
    });

    it("Displays singular player rubric when levels are different values and there is a single player", () => {
      render(
        <DungeonSummary
          dungeon={{
            ...mockDungeon,
            playerCount: 1,
          }}
        />,
      );

      const expected = `For 1 player, at levels ${mockDungeon.levelMin} to ${mockDungeon.levelMax}.`;
      expect(screen.getByText(expected)).toBeVisible();
    });

    it("Displays only one level if min and max levels are the same", () => {
      render(
        <DungeonSummary
          dungeon={{
            ...mockDungeon,
            levelMin: 3,
            levelMax: 3,
          }}
        />,
      );

      const expected = `For 4 players, at level 3.`;
      expect(screen.getByText(expected)).toBeVisible();
    });

    it("Displays only one level if min and max levels are the same and 'player' if there is only a single player", () => {
      render(
        <DungeonSummary
          dungeon={{
            ...mockDungeon,
            levelMin: 5,
            levelMax: 5,
            playerCount: 1,
          }}
        />,
      );

      const expected = `For 1 player, at level 5.`;
      expect(screen.getByText(expected)).toBeVisible();
    });
  });
});
