import { composeStory } from "@storybook/react";
import { describe, it, expect, vi } from "vitest";
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

  describe("onChangeCallback", () => {
    it("calls onChangeCallback when quantity is changed", async () => {
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
      const onChangeCallbackSpy = vi.fn();

      render(
        <ItemQuantitySelector
          dropdownConfig={{
            options: options,
            placeholder: "Select an item.",
          }}
          onItemQuantityChangeCallback={(itemValuePair) =>
            onChangeCallbackSpy(itemValuePair)
          }
        />,
      );

      const quantitySelector = screen.getByRole("textbox", {
        name: "Item quantity",
      });

      await userEvent.type(quantitySelector, "123");

      expect(onChangeCallbackSpy).toHaveBeenCalled();
      expect(onChangeCallbackSpy).toHaveBeenCalledWith({
        itemValue: "",
        quantity: "123",
      });
    });

    it("calls onChangeCallback when item is changed", async () => {
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
      const onChangeCallbackSpy = vi.fn();

      render(
        <ItemQuantitySelector
          dropdownConfig={{
            options: options,
            placeholder: "Select an item.",
          }}
          onItemQuantityChangeCallback={(itemValuePair) =>
            onChangeCallbackSpy(itemValuePair)
          }
        />,
      );

      const itemSelector = screen.getByRole("combobox", {
        name: "Select an Item",
      });

      await userEvent.selectOptions(
        itemSelector,
        screen.getByRole("option", {
          name: options[2].label,
        }),
      );

      expect(onChangeCallbackSpy).toHaveBeenCalled();
      expect(onChangeCallbackSpy).toHaveBeenCalledWith({
        itemValue: options[2].value,
        quantity: "",
      });
    });

    it("calls onChangeCallback when a user selects an item and enters a quantity", async () => {
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
      const onChangeCallbackSpy = vi.fn();
      render(
        <ItemQuantitySelector
          dropdownConfig={{
            options: options,
            placeholder: "Select an item.",
          }}
          onItemQuantityChangeCallback={(itemValuePair) =>
            onChangeCallbackSpy(itemValuePair)
          }
        />,
      );

      const quantitySelector = screen.getByRole("textbox", {
        name: "Item quantity",
      });
      const itemSelector = screen.getByRole("combobox", {
        name: "Select an Item",
      });
      const inputQuantity = "3";

      await userEvent.type(quantitySelector, inputQuantity);
      await userEvent.selectOptions(
        itemSelector,
        screen.getByRole("option", {
          name: options[1].label,
        }),
      );

      expect(onChangeCallbackSpy).toHaveBeenCalledTimes(2);
      expect(onChangeCallbackSpy).toHaveBeenCalledWith({
        itemValue: options[1].value,
        quantity: inputQuantity,
      });
    });
  });
});
