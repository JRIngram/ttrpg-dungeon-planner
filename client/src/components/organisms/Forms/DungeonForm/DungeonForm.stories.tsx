import type { Meta, StoryObj } from "@storybook/react";
import { DungeonForm } from "./DungeonForm";

const meta: Meta<typeof DungeonForm> = {
  title: "Organisms/Forms/DungeonForm",
  component: DungeonForm,
  tags: ["autodocs"],
  argTypes: {
    onSubmitCallback: { action: "submitted" },
    onCancelCallback: { action: "cancelled" },
  },
};

export default meta;
type Story = StoryObj<typeof DungeonForm>;

export const Default: Story = {
  args: {
    onSubmitCallback: (dungeon) => console.log("Submitted:", dungeon),
    onCancelCallback: () => console.log("Cancelled"),
  },
};

export const ExistingDungeon: Story = {
  args: {
    existingDungeon: {
      id: "1",
      name: "The Lost Ruins",
      summary: "Shadowy ruins of an old Dwarvern mining outpost",
      levelMin: 1,
      levelMax: 3,
      playerCount: 4,
    },
    onSubmitCallback: (dungeon) => console.log("Submitted:", dungeon),
    onCancelCallback: () => console.log("Cancelled"),
  },
};