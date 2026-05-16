import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RoomDisplay } from "./RoomDisplay";
import { RoomWithStringifiedFields } from "@/types/room";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockDungeon = {
  id: "1",
  name: "The Temple of Davey",
  summary:
    "Explore the hidden ruins of the Temple of Dave, and find the hidden crystal of Daveth",
  levelMin: 1,
  levelMax: 5,
  playerCount: 4,
};

const mockRoom: RoomWithStringifiedFields = {
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

// Total Room XP: 500xp

// Min Level Rating: Extreme

// Average Level Rating: Easy

// Max Level Rating: Trivial
const renderRoomDisplay = () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      {<RoomDisplay dungeon={mockDungeon} room={mockRoom} />}
    </QueryClientProvider>,
  );
};

describe("RoomDisplay", () => {
  it("Renders summary information", () => {
    renderRoomDisplay();

    expect(screen.getByText(mockRoom.name)).toBeVisible();
    expect(screen.getByText(mockRoom.description)).toBeVisible();
  });

  it("Renders Monster information", () => {
    renderRoomDisplay();

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
    renderRoomDisplay();

    expect(screen.getByText("Contains the following traps:")).toBeVisible();

    mockRoom.traps.forEach((trap) =>
      expect(screen.getByText(`${trap.quantity} ${trap.name}`)),
    );
  });

  it("XpInformation", async () => {
    renderRoomDisplay();

    expect(screen.getByText("XP Information:")).toBeVisible();
    expect(screen.getByText("Pre multiplier adjustment: 250xp")).toBeVisible();
    expect(
      screen.getByText("Loading post multiplier adjustment XP..."),
    ).toBeVisible();

    expect(
      await screen.findByText("Post multiplier adjustment: 500xp"),
    ).toBeVisible();
  });
});
