import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Atoms/Button",
  component: Button,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    text: "Press me!",
    ariaLabel: "Press me!",
    onClick: () => console.log("clicked"),
    variant: "primaryFilled",
  },
};
