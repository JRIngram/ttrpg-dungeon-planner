import type { Meta, StoryObj } from "@storybook/react";
import { RoomForm } from "./RoomForm";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher/MonsterDataFetcher";
import type { Monster } from "@/types/monster";
import { Room } from "@/types/room";
import Providers from "@/app/providers";

const meta = {
  title: "Components/Organisms/Forms/RoomForm",
  component: RoomForm,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof RoomForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
  args: {
    dungeonId: "1",
    onSubmitCallback: (entity: Room) => console.log("Submitted:", entity),
    onCancelCallback: () => console.log("Cancelled"),
  },
};
