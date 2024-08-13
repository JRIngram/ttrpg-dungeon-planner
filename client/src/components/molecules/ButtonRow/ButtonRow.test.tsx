import { vi, describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { composeStory } from "@storybook/react";

import Meta, { Default } from "./ButtonRow.stories";
import { ButtonProps } from "@/components/atoms/Button/Button";
import userEvent from "@testing-library/user-event";

const buttonOneSpy = vi.fn();
const buttonTwoSpy = vi.fn();
const buttonThreeSpy = vi.fn();

const renderButtonRow = () => {
  const ButtonRow = composeStory(Default, Meta);
  const buttons: ButtonProps[] = [
    {
      text: "Button One",
      onClick: () => {
        buttonOneSpy();
      },
      variant: "primaryFilled",
    },
    {
      text: "Button Two",
      onClick: () => {
        buttonTwoSpy();
      },
      variant: "secondaryOutline",
    },
    {
      text: "Button Three",
      onClick: () => {
        buttonThreeSpy();
      },
      variant: "tertiaryOutline",
      disabled: true,
    },
  ];
  return render(<ButtonRow buttons={buttons} />);
};

describe("ButtonRow", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all buttons passed", () => {
    renderButtonRow();
    expect(screen.getByRole("button", { name: "Button One" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Button Two" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Button Three" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Button One" })
    ).not.toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Button Two" })
    ).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Button Three" })).toBeDisabled();
  });

  it("calls respective onClick functions when each button is pressed", async () => {
    renderButtonRow();
    expect(buttonOneSpy).toBeCalledTimes(0);
    expect(buttonTwoSpy).toBeCalledTimes(0);
    await userEvent.click(screen.getByRole("button", { name: "Button One" }));
    expect(buttonOneSpy).toBeCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: "Button Two" }));
    expect(buttonTwoSpy).toBeCalledTimes(1);
  });

  it("does not call onClick functions on disabled buttons", async () => {
    renderButtonRow();
    expect(buttonThreeSpy).toBeCalledTimes(0);
    await userEvent.click(screen.getByRole("button", { name: "Button Three" }));
    expect(buttonThreeSpy).toBeCalledTimes(0);
  });
});
