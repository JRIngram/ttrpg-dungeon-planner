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
            url: "http://www.example.com",
        },
        {
            title: "Monsters",
            url: "http://www.example.com"
        },
        {
          title: "Traps",
          url: "http://www.example.com"
      },
    ]
  },
};
