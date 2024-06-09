import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "./TextInput";

const meta = {
  title: "Components/Atoms/TextInput",
  component: TextInput,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    id: "test-id",
    formInputName: "test-input",
    ariaLabel: "A Test TextInput",
    placeholder: "Some test placeholder text",
  },
};
