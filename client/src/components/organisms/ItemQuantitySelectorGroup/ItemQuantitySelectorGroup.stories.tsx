import type { Meta, StoryObj } from "@storybook/react";
import { ItemQuantitySelectorGroup } from "./ItemQuantitySelectorGroup";

const meta = {
  title: "Components/Organisms/ItemQuantitySelectorGroup",
  component: ItemQuantitySelectorGroup,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof ItemQuantitySelectorGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "test",
    itemName: "Item",
    textInputFormName: "item-quantity",
    isRequired: false,
    initialValue: [],
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

export const WithInitialValue: Story = {
  args: {
    id: "test",
    itemName: "Item",
    textInputFormName: "item-quantity",
    isRequired: false,
    initialValue: [
      { itemValue: "1", quantity: "10" },
      { itemValue: "3", quantity: "5" },
    ],
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
