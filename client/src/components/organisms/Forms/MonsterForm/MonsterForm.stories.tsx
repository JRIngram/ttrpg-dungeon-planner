import type { Meta, StoryObj } from "@storybook/react";
import { MonsterForm } from "./MonsterForm";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher/MonsterDataFetcher";
import type { Monster } from "@/types/monster";

const meta = {
  title: "Components/Organisms/Forms/MonsterForm",
  component: MonsterForm,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof MonsterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmitCallback: (entity: Monster) => console.log("Submitted:", entity),
    onCancelCallback: () => console.log("Cancelled"),
  },
};

export const ExistingMonster: Story = {
  args: {
    ...Default.args,
    existingMonster: {
      id: "1",
      name: "Test Mob",
      xp: "50",
    },
  },
};
