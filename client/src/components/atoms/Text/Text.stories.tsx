import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";

const meta = {
  title: "Components/Atoms/Text",
  component: Text,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    textType: "default",
    text: "Hello world!",
  },
};

export const Subheader: Story = {
  args: {
    textType: "subheader",
    text: "Hello world!",
  },
};

export const Heading: Story = {
  args: {
    textType: "header",
    text: "Hello world!",
  },
};
