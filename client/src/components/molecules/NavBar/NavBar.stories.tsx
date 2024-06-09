import type { Meta, StoryObj } from "@storybook/react";
import { NavBar } from "./NavBar";

const meta = {
  title: "Components/Molecules/NavBar",
  component: NavBar,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    links: [
      {
        title: "Dungeons",
        url: "/dungeons",
      },
      {
        title: "Monsters",
        url: "/monsters",
      },
      {
        title: "Traps",
        url: "/trap",
      },
    ],
  },
};
