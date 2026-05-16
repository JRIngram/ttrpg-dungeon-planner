import { render, screen } from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { RoomDisplay } from "./RoomDisplay";
import { RoomWithStringifiedFields } from "@/types/room";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

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

const handlers = [
  http.get(
    "http://127.0.0.1:8000/dungeonPlanner/encounterMultiplierConfigRow",
    () => {
      return HttpResponse.json([
        {
          id: 7,
          min: 1,
          max: 1,
          multiplier: 1,
        },
        {
          id: 8,
          min: 2,
          max: 2,
          multiplier: 2,
        },
        {
          id: 9,
          min: 3,
          max: 6,
          multiplier: 2,
        },
        {
          id: 10,
          min: 7,
          max: 10,
          multiplier: 3,
        },
        {
          id: 11,
          min: 11,
          max: 15,
          multiplier: 4,
        },
        {
          id: 12,
          min: 16,
          max: null,
          multiplier: 5,
        },
      ]);
    },
  ),
  http.get(
    "http://127.0.0.1:8000/dungeonPlanner/encounterRatingConfigRow",
    () => {
      return HttpResponse.json([
        {
          id: 8,
          level: 1,
          easy: 50,
          medium: 100,
          hard: 150,
          extreme: 200,
        },
        {
          id: 9,
          level: 2,
          easy: 100,
          medium: 200,
          hard: 300,
          extreme: 400,
        },
        {
          id: 10,
          level: 3,
          easy: 200,
          medium: 400,
          hard: 600,
          extreme: 800,
        },
        {
          id: 11,
          level: 4,
          easy: 400,
          medium: 800,
          hard: 1200,
          extreme: 1600,
        },
        {
          id: 12,
          level: 5,
          easy: 800,
          medium: 1600,
          hard: 2400,
          extreme: 3200,
        },
      ]);
    },
  ),
];

const server = setupServer(...handlers);

const renderRoomDisplay = () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      {<RoomDisplay dungeon={mockDungeon} room={mockRoom} />}
    </QueryClientProvider>,
  );
};

describe("RoomDisplay", () => {
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it("Renders summary information", () => {
    renderRoomDisplay();

    expect(screen.getByText(mockRoom.name)).toBeVisible();
    expect(screen.getByText(mockRoom.description)).toBeVisible();
  });

  it("Renders Monster information", () => {
    renderRoomDisplay();

    expect(screen.getByText("Monsters")).toBeVisible();

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

    expect(screen.getByText("Traps")).toBeVisible();

    mockRoom.traps.forEach((trap) =>
      expect(screen.getByText(`${trap.quantity} ${trap.name}`)),
    );
  });

  it("XpInformation", async () => {
    renderRoomDisplay();

    expect(screen.getByText("XP Information")).toBeVisible();
    expect(screen.getByText("Pre multiplier adjustment: 250xp")).toBeVisible();
    expect(
      screen.getByText("Loading post multiplier adjustment XP..."),
    ).toBeVisible();

    expect(
      await screen.findByText("Post multiplier adjustment: 500xp"),
    ).toBeVisible();
  });
});
