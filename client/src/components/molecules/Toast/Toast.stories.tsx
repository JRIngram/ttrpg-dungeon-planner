import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast";
import { ToastType } from "@/types/toast";

const meta = {
  title: "Components/Molecules/Toast",
  component: Toast,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {
  args: {
    message: "Hello I am a erronous toast",
    type: ToastType.ERROR,
    onClose: () => {},
  },
};

export const Success: Story = {
  args: {
    message: "Hello I am a successful toast",
    type: ToastType.SUCCESS,
    onClose: () => {},
  },
};

export const Warning: Story = {
  args: {
    message: "Hello I am a warningful toast",
    type: ToastType.WARNING,
    onClose: () => {},
  },
};
