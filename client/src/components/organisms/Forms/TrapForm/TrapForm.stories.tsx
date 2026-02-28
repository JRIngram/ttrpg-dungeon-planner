import type { Meta, StoryObj } from "@storybook/react";
import { TrapForm } from "./TrapForm";

const meta: Meta<typeof TrapForm> = {
  title: "Components/Organisms/Forms/TrapForm",
  component: TrapForm,
  tags: ["autodocs"],
  argTypes: {
    onSubmitCallback: { action: "submitted" },
    onCancelCallback: { action: "cancelled" },
  },
};

export default meta;
type Story = StoryObj<typeof TrapForm>;

export const Default: Story = {
  args: {
    onSubmitCallback: (trap) => console.log("Submitted:", trap),
    onCancelCallback: () => console.log("Cancelled"),
  },
};

export const ExistingTrap: Story = {
  args: {
    existingTrap: {
      id: "1",
      name: "Test Trap",
      effect: "1d6 damage",
      isDeletable: true,
    },
    onSubmitCallback: (trap) => console.log("Submitted:", trap),
    onCancelCallback: () => console.log("Cancelled"),
  },
};
