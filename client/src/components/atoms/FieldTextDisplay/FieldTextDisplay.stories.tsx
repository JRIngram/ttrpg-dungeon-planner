import type { Meta, StoryObj } from "@storybook/react";
import { FieldTextDisplay } from "./FieldTextDisplay";

const meta = {
  title: "Components/Atoms/FieldTextDisplay",
  component: FieldTextDisplay,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof FieldTextDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    fieldName: "Test Field",
    fieldValue: "Passed!",
  },
};
