import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";

const meta = {
  title: "Components/Atoms/Dropdown",
  component: Dropdown,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "test-id",
    formInputName: "test-dropdown",
    ariaLabel: "A Test Dropdown",
    placeholder: "Placerholder option",
    options: [
      {
        value: "1",
        label: "option-1",
      },

      {
        value: "2",
        label: "option-2",
      },
      {
        value: "3",
        label: "option-3",
      },
    ],
  },
};
