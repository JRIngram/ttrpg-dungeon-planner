import type { Meta, StoryObj } from "@storybook/react";
import { MonsterForm } from "./MonsterForm";

const meta = {
  title: "Components/Organisms/MonsterForm",
  component: MonsterForm,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof MonsterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
