import type { Meta, StoryObj } from "@storybook/react";
import { ButtonRow } from "./ButtonRow";

const meta = {
  title: "Components/Molecules/ButtonRow",
  component: ButtonRow,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof ButtonRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    buttons: [
      {
        text: "Button One",
        onClick: () => console.log("clicked"),
        variant: "primaryFilled",
      },
      {
        text: "Button Two",
        onClick: () => console.log("clicked"),
        variant: "secondaryOutline",
      },
      {
        text: "Button Three",
        onClick: () => console.log("clicked"),
        variant: "tertiaryOutline",
      },
    ],
  },
};
