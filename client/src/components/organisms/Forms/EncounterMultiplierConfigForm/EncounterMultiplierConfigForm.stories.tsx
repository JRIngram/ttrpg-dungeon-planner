import type { Meta, StoryObj } from "@storybook/react";
import { EncounterMultiplierConfigForm } from "./EncounterMultiplierConfigForm";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher/MonsterDataFetcher";
import type { Monster } from "@/types/monster";

const meta = {
  title: "Components/Organisms/Forms/EncounterMultiplierConfigForm",
  component: EncounterMultiplierConfigForm,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof EncounterMultiplierConfigForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmitCallback: (entity: Monster) => console.log("Submitted:", entity),
    onCancelCallback: () => console.log("Cancelled"),
  },
};
