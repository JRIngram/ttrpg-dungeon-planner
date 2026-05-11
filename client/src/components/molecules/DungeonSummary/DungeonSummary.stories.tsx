import type { Meta, StoryObj } from "@storybook/react";
import { DungeonSummary } from "./DungeonSummary";
import { Dungeon } from "@/types/dungeon";

const meta = {
  title: "Components/Molecules/DungeonSummary",
  component: DungeonSummary,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof DungeonSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockDungeon: Dungeon = {
  id: "1",
  name: "Test Dungeon",
  summary: "A great dungeon to test in!",
  levelMin: 1,
  levelMax: 3,
  playerCount: 4,
};

export const Default: Story = {
  args: {
    dungeon: mockDungeon,
  },
};
