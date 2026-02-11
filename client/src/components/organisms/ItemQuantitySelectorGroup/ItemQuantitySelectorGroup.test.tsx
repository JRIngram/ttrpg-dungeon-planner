import { describe, expect, it, vitest } from "vitest";
import meta, {
  Default,
  WithInitialValue,
} from "./ItemQuantitySelectorGroup.stories";
import { composeStory } from "@storybook/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach } from "node:test";

describe("ItemQuantitySelectorGroup", () => {
  beforeEach(() => {
    vitest.restoreAllMocks();
  });

  describe("No initial value", () => {
    afterEach(() => {
      vitest.restoreAllMocks();
    });

    it("initially renders a single ItemQuantitySelector with a dropdown and text input", () => {
      const ItemQuantitySelectorGroup = composeStory(Default, meta);
      render(<ItemQuantitySelectorGroup />);

      expect(
        screen.getByRole("textbox", { name: "Item quantity" }),
      ).toBeVisible();
      expect(
        screen.getByRole("combobox", { name: "Select an Item" }),
      ).toBeVisible();
    });

    it("renders two ItemQuantitySelectors when `Add` is clicked", async () => {
      const ItemQuantitySelectorGroup = composeStory(Default, meta);
      render(<ItemQuantitySelectorGroup />);
      await userEvent.click(screen.getByRole("button", { name: "Add Row +" }));

      expect(
        screen.getAllByRole("textbox", { name: "Item quantity" }),
      ).toHaveLength(2);
      expect(
        screen.getAllByRole("combobox", { name: "Select an Item" }),
      ).toHaveLength(2);
    });

    it("renders two ItemQuantitySelectors when `Add Row +` is clicked twice, and `Remove Row -` is clicked once.", async () => {
      const ItemQuantitySelectorGroup = composeStory(Default, meta);
      render(<ItemQuantitySelectorGroup />);
      await userEvent.click(screen.getByRole("button", { name: "Add Row +" }));

      expect(
        screen.getAllByRole("textbox", { name: "Item quantity" }),
      ).toHaveLength(2);
      expect(
        screen.getAllByRole("combobox", { name: "Select an Item" }),
      ).toHaveLength(2);

      await userEvent.click(screen.getByRole("button", { name: "Add Row +" }));
      expect(
        screen.getAllByRole("textbox", { name: "Item quantity" }),
      ).toHaveLength(3);
      expect(
        screen.getAllByRole("combobox", { name: "Select an Item" }),
      ).toHaveLength(3);

      await userEvent.click(
        screen.getByRole("button", { name: "Remove Row -" }),
      );
      expect(
        screen.getAllByRole("textbox", { name: "Item quantity" }),
      ).toHaveLength(2);
      expect(
        screen.getAllByRole("combobox", { name: "Select an Item" }),
      ).toHaveLength(2);
    });

    it("user cannot remove row if there is only a single row", async () => {
      const ItemQuantitySelectorGroup = composeStory(Default, meta);
      render(<ItemQuantitySelectorGroup />);

      expect(
        screen.getAllByRole("textbox", { name: "Item quantity" }),
      ).toHaveLength(1);
      expect(
        screen.getAllByRole("combobox", { name: "Select an Item" }),
      ).toHaveLength(1);

      await userEvent.click(
        screen.getByRole("button", { name: "Remove Row -" }),
      );

      expect(
        screen.getAllByRole("textbox", { name: "Item quantity" }),
      ).toHaveLength(1);
      expect(
        screen.getAllByRole("combobox", { name: "Select an Item" }),
      ).toHaveLength(1);
    });

    describe("onChange callback", () => {
      afterEach(() => {
        vitest.restoreAllMocks();
      });

      it("onChange callback is called when user updates item quantity", async () => {
        const ItemQuantitySelectorGroup = composeStory(Default, meta);
        const onChangeCallbackSpy = vitest.fn();
        render(
          <ItemQuantitySelectorGroup
            onItemQuantityChangeCallback={onChangeCallbackSpy}
          />,
        );

        const quantitySelector = screen.getByRole("textbox", {
          name: "Item quantity",
        });

        await userEvent.type(quantitySelector, "1");
        expect(onChangeCallbackSpy).toHaveBeenCalledOnce();
        expect(onChangeCallbackSpy).toHaveBeenCalledWith([
          {
            itemValue: "",
            quantity: "1",
          },
        ]);
      });

      it("onChange callback is called when user updates item value", async () => {
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
        const ItemQuantitySelectorGroup = composeStory(Default, meta);
        const onChangeCallbackSpy = vitest.fn();
        render(
          <ItemQuantitySelectorGroup
            dropdownConfig={{
              options: options,
              placeholder: "Select an item.",
            }}
            onItemQuantityChangeCallback={() => onChangeCallbackSpy()}
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
        expect(onChangeCallbackSpy).toHaveBeenCalledOnce();
      });

      it("onChange callback is called when user adds a row", async () => {
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
        const ItemQuantitySelectorGroup = composeStory(Default, meta);
        const onChangeCallbackSpy = vitest.fn();
        render(
          <ItemQuantitySelectorGroup
            dropdownConfig={{
              options: options,
              placeholder: "Select an item.",
            }}
            onItemQuantityChangeCallback={onChangeCallbackSpy}
          />,
        );

        const quantitySelector = screen.getByRole("textbox", {
          name: "Item quantity",
        });
        const itemSelector = screen.getByRole("combobox", {
          name: "Select an Item",
        });

        await userEvent.type(quantitySelector, "1");
        await userEvent.selectOptions(
          itemSelector,
          screen.getByRole("option", {
            name: options[2].label,
          }),
        );
        expect(onChangeCallbackSpy).toHaveBeenCalledTimes(2);

        await userEvent.click(
          screen.getByRole("button", { name: "Add Row +" }),
        );

        const secondQuantitySelector = screen.getAllByRole("textbox", {
          name: "Item quantity",
        })[1];
        const secondItemSelector = screen.getAllByRole("combobox", {
          name: "Select an Item",
        })[1];

        await userEvent.type(secondQuantitySelector, "5");
        await userEvent.selectOptions(
          secondItemSelector,
          screen.getAllByRole("option", {
            name: options[1].label,
          })[1],
        );

        expect(onChangeCallbackSpy).toHaveBeenCalledTimes(4);
        expect(onChangeCallbackSpy).toHaveBeenLastCalledWith([
          {
            itemValue: "3",
            quantity: "1",
          },
          {
            itemValue: "2",
            quantity: "5",
          },
        ]);
      });

      it("onChange callback is called when user removes a row", async () => {
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
        const ItemQuantitySelectorGroup = composeStory(Default, meta);
        const onChangeCallbackSpy = vitest.fn();
        render(
          <ItemQuantitySelectorGroup
            dropdownConfig={{
              options: options,
              placeholder: "Select an item.",
            }}
            onItemQuantityChangeCallback={onChangeCallbackSpy}
          />,
        );

        const quantitySelector = screen.getByRole("textbox", {
          name: "Item quantity",
        });
        const itemSelector = screen.getByRole("combobox", {
          name: "Select an Item",
        });

        await userEvent.type(quantitySelector, "1");
        await userEvent.selectOptions(
          itemSelector,
          screen.getByRole("option", {
            name: options[2].label,
          }),
        );
        expect(onChangeCallbackSpy).toHaveBeenCalledTimes(2);

        await userEvent.click(
          screen.getByRole("button", { name: "Add Row +" }),
        );

        const secondQuantitySelector = screen.getAllByRole("textbox", {
          name: "Item quantity",
        })[1];
        const secondItemSelector = screen.getAllByRole("combobox", {
          name: "Select an Item",
        })[1];

        await userEvent.type(secondQuantitySelector, "5");
        await userEvent.selectOptions(
          secondItemSelector,
          screen.getAllByRole("option", {
            name: options[1].label,
          })[1],
        );

        expect(onChangeCallbackSpy).toHaveBeenCalledTimes(4);
        expect(onChangeCallbackSpy).toHaveBeenLastCalledWith([
          {
            itemValue: "3",
            quantity: "1",
          },
          {
            itemValue: "2",
            quantity: "5",
          },
        ]);

        await userEvent.click(
          screen.getByRole("button", { name: "Remove Row -" }),
        );
        expect(onChangeCallbackSpy).toHaveBeenCalledTimes(5);
        expect(onChangeCallbackSpy).toHaveBeenLastCalledWith([
          {
            itemValue: "3",
            quantity: "1",
          },
        ]);
      });
    });
  });

  describe("Initial value provided", () => {
    it("initially renders ItemQuantitySelectors with populated values", () => {
      const ItemQuantitySelectorGroup = composeStory(WithInitialValue, meta);
      render(<ItemQuantitySelectorGroup />);

      expect(screen.getByDisplayValue("Item One")).toBeVisible();
      expect(screen.getByDisplayValue("10")).toBeVisible();

      expect(screen.getByDisplayValue("Item Three")).toBeVisible();
      expect(screen.getByDisplayValue("5")).toBeVisible();
    });
  });
});
