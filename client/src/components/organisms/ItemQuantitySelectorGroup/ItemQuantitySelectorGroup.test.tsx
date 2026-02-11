import { describe, expect, it } from "vitest";
import meta, {
  Default,
  WithInitialValue,
} from "./ItemQuantitySelectorGroup.stories";
import { composeStory } from "@storybook/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ItemQuantitySelectorGroup", () => {
  describe("No initial value", () => {
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

    it("user cannot Remove Row - if there is only a single row", async () => {
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
