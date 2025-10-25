import { it, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { composeStory } from "@storybook/react";
import Meta, { Default } from "./Dropdown.stories";

describe("Dropdown", () => {
  it("renders a dropdown with options with placeholder", () => {
    const DropdownComponent = composeStory(Default, Meta);
    const id = "test-id";
    const name = "test-form-name";
    const ariaLabel = "A test Dropdown";
    const placeholder = "Some placeholder text";

    render(
      <DropdownComponent
        id={id}
        formInputName={name}
        ariaLabel={ariaLabel}
        placeholder={placeholder}
      />,
    );

    const dropdown = screen.getByRole("combobox", { name: ariaLabel });

    expect(dropdown).toBeVisible();
    expect(dropdown.getAttribute("name")).toBe(name);
    expect(dropdown.getAttribute("id")).toBe(id);
    expect(
      screen.getByRole("option", { name: placeholder, selected: true }),
    ).toBeVisible();
  });

  it("renders a dropdown with options with the initial value", () => {
    const Dropdown = composeStory(Default, Meta);
    const ariaLabel = "A test Dropdown";
    const placeholder = "Some placeholder text";
    const options = [
      {
        value: "1",
        label: "option-1",
      },

      {
        value: "2",
        label: "option-2",
      },
      {
        value: "3",
        label: "option-3",
      },
    ];
    const initialValueIndex = 2;

    render(
      <Dropdown
        ariaLabel={ariaLabel}
        placeholder={placeholder}
        options={options}
        initialOption={options[initialValueIndex]}
      />,
    );

    expect(screen.getByRole("combobox", { name: ariaLabel })).toBeVisible();
    expect(screen.getByRole("option", { name: placeholder })).toBeVisible();
    expect(
      screen.getByRole("option", {
        name: options[initialValueIndex].label,
        selected: true,
      }),
    ).toBeVisible();
  });

  it.each([
    [undefined, false],
    [false, false],
    [true, true],
  ])(
    "sets required to %o when passed isRequired: %o",
    (isRequired, expected) => {
      const Dropdown = composeStory(Default, Meta);
      const ariaLabel = "A test Dropdown";

      render(<Dropdown isRequired={isRequired} ariaLabel={ariaLabel} />);

      if (isRequired) {
        expect(
          screen.getByRole("combobox", { name: ariaLabel }),
        ).toBeRequired();
      } else {
        expect(
          screen.getByRole("combobox", { name: ariaLabel }),
        ).not.toBeRequired();
      }
    },
  );
});
