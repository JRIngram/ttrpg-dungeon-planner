import type { Meta, StoryObj } from "@storybook/react";
import { NavDrawer } from "./NavDrawer";

const meta = {
  title: "Components/Molecules/NavDrawer",
  component: NavDrawer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NavDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutDefault: Story = {
  args: {
    items: [
      {
        label: "Item One",
        id: "1",
      },
      {
        label: "Item Two",
        id: "2",
      },
      {
        label: "Item Three",
        id: "3",
      },
    ],
    onSelect: () => {},
  },
};

export const WithDefault: Story = {
  args: {
    items: [
      {
        label: "Item One",
        id: "1",
      },
      {
        label: "Item Two",
        id: "2",
      },
      {
        label: "Item Three",
        id: "3",
      },
    ],
    onSelect: () => {},
    defaultItem: {
      label: "Default Item",
      onDefaultSelected: () => {},
    },
  },
};
