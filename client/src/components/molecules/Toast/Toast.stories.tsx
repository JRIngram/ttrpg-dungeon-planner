import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastType } from "./Toast";

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

export const Success: Story = {
  args: {
    message: "Hello I am a successful toast",
    type: ToastType.SUCCESS,
  },
};

export const Error: Story = {
  args: {
    message: "Hello I am a erronous toast",
    type: ToastType.ERROR,
  },
};

export const Warning: Story = {
  args: {
    message: "Hello I am a warningful toast",
    type: ToastType.WARNING,
  },
};
