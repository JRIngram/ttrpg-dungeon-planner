import { composeStory } from "@storybook/react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import meta, { Default } from "./ItemQuantitySelector.stories";
import userEvent from "@testing-library/user-event";

describe("ItemQuantitySelector", () => {
  it("renders ItemQuantitySelector with a dropdown and text input", () => {
    const ItemQuantitySelector = composeStory(Default, meta);
    render(<ItemQuantitySelector />);

    expect(
      screen.getByRole("textbox", { name: "Item quantity" }),
    ).toBeVisible();
    expect(
      screen.getByRole("combobox", { name: "Select an Item" }),
    ).toBeVisible();
  });

  it("allows user to enter a quantity and select an option", async () => {
    const ItemQuantitySelector = composeStory(Default, meta);
    const options = [
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
    ];
    render(
      <ItemQuantitySelector
        dropdownConfig={{
          options: options,
          placeholder: "Select an item.",
        }}
      />,
    );

    const quantitySelector = screen.getByRole("textbox", {
      name: "Item quantity",
    });
    const itemSelector = screen.getByRole("combobox", {
      name: "Select an Item",
    });

    await userEvent.type(quantitySelector, "123");
    await userEvent.selectOptions(
      itemSelector,
      screen.getByRole("option", {
        name: options[0].label,
      }),
    );

    expect(quantitySelector).toHaveValue("123");
    expect(itemSelector).toHaveValue(options[0].value);
  });

  it("displays default value", async () => {
    const ItemQuantitySelector = composeStory(Default, meta);
    const options = [
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
    ];
    const initialValue = { itemValue: "3", quantity: "4" };

    render(
      <ItemQuantitySelector
        dropdownConfig={{
          options: options,
          placeholder: "Select an item.",
        }}
        initialValue={initialValue}
      />,
    );

    const quantitySelector = screen.getByRole("textbox", {
      name: "Item quantity",
    });
    const itemSelector = screen.getByRole("combobox", {
      name: "Select an Item",
    });

    const initialItemIndex = options.findIndex(
      (o) => o.value === initialValue.itemValue,
    );
    const initialItemLabel = options[initialItemIndex].label;

    expect(quantitySelector).toHaveValue(initialValue.quantity);
    expect(itemSelector).toHaveValue(initialValue.itemValue);
    expect(screen.getByText(initialItemLabel)).toBeVisible();
  });
});
