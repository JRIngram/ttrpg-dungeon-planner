import type { Meta, StoryObj } from "@storybook/react";
import { FieldTextDisplayGroup } from "./FieldTextDisplayGroup";

const meta = {
  title: "Components/Molecules/FieldTextDisplayGroup",
  component: FieldTextDisplayGroup,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof FieldTextDisplayGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    fields: [
      {
        fieldName: "Test Field One",
        fieldValue: "Passed!",
      },
      {
        fieldName: "Test Field Two",
        fieldValue: "Failed!",
      },
      {
        fieldName: "Test Field Three",
        fieldValue: "Skipped",
      },
    ],
  },
};
