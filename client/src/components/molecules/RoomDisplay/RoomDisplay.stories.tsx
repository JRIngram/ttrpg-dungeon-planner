import type { Meta, StoryObj } from "@storybook/react";
import { RoomDisplay } from "./RoomDisplay";
import { mockRoom } from "./RoomDisplay.test";

const meta = {
  title: "Components/Molecules/RoomDisplay",
  component: RoomDisplay,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RoomDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { room: mockRoom },
};
