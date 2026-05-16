import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RoomDisplay } from "./RoomDisplay";
import { RoomWithStringifiedFields } from "@/types/room";

export const mockRoom: RoomWithStringifiedFields = {
  id: "10",
  name: "Big Boi Lair",
  description: "Big room for a big boi",
  traps: [
    {
      id: "1",
      name: "Pit Trap",
      effect: "1d4 falling damage",
      quantity: "1",
    },
  ],
  monsters: [
    {
      id: "1",
      name: "Goblin Archer",
      xp: "50",
      quantity: "3",
    },
    {
      id: "2",
      name: "Fat Gobbo",
      xp: "100",
      quantity: "1",
    },
  ],
  dungeon: "1",
};

describe("RoomDisplay", () => {
  it("Renders summary information", () => {
    render(<RoomDisplay room={mockRoom} />);

    expect(screen.getByText(mockRoom.name)).toBeVisible();
    expect(screen.getByText(mockRoom.description)).toBeVisible();
  });

  it("Renders Monster information", () => {
    render(<RoomDisplay room={mockRoom} />);

    expect(screen.getByText("Contains the following monsters:")).toBeVisible();

    mockRoom.monsters.forEach((monster) =>
      expect(
        screen.getByText(
          `${monster.quantity} ${monster.name} - ${monster.xp}xp each`,
        ),
      ),
    );
  });

  it("Renders Trap information", () => {
    render(<RoomDisplay room={mockRoom} />);

    expect(screen.getByText("Contains the following traps:")).toBeVisible();

    mockRoom.traps.forEach((trap) =>
      expect(screen.getByText(`${trap.quantity} ${trap.name}`)),
    );
  });
});
