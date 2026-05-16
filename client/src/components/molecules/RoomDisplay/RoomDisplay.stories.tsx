import type { Meta, StoryObj } from "@storybook/react";
import { RoomDisplay } from "./RoomDisplay";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockRoom = {
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

const meta = {
  title: "Components/Molecules/RoomDisplay",
  component: () => {
    const queryClient = new QueryClient();

    return (
      <QueryClientProvider client={queryClient}>
        {<RoomDisplay room={mockRoom} />}
      </QueryClientProvider>
    );
  },
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
