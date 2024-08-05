import type { Meta, StoryObj } from "@storybook/react";
import { InputMode, MonsterForm } from "./MonsterForm";
import { monsterFixture } from "@/fixtures/Monster";

const meta = {
  title: "Components/Organisms/MonsterForm",
  component: MonsterForm,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof MonsterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    inputMode: InputMode.NEW,
    onSubmit: () => {},
    onCancel: () => {},
  },
};

export const WithInitialMonster: Story = {
  args: {
    inputMode: InputMode.EDIT,
    onSubmit: () => {},
    onCancel: () => {},
    monster: monsterFixture,
  },
};
