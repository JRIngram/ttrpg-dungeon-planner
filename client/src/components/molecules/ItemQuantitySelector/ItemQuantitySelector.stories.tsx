import type { Meta, StoryObj } from "@storybook/react";
import { ItemQuantitySelector } from "./ItemQuantitySelector";

const meta = {
  title: "Components/Molecules/ItemQuantitySelector",
  component: ItemQuantitySelector,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof ItemQuantitySelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "test",
    itemName: "Item",
    textInputFormName: "item-quantity",
    dropdownConfig: {
      placeholder: "Select an item.",
      options: [
        {
          label: "Item One",
          value: "1",
        },
        {
          label: "Item Two",
          value: "2",
        },
        {
          label: "Item Three",
          value: "3",
        },
      ],
    },
    onItemQuantityChangeCallback: () => {},
  },
};
