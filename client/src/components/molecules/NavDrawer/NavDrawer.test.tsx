import { vi, describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { composeStory } from "@storybook/react";

import Meta, { Default } from "./NavDrawer.stories";
import userEvent from "@testing-library/user-event";
import { DrawerItem } from "./NavDrawer";

const buttonOneSpy = vi.fn();
const buttonTwoSpy = vi.fn();
const buttonThreeSpy = vi.fn();

const renderButtonRow = () => {
  const NavDrawer = composeStory(Default, Meta);
  const items: DrawerItem[] = [
    {
      label: "Item One",
      id: "1",
    },
    {
      label: "Item Two",
      id: "2",
    },
  ];
  return render(<NavDrawer items={items} onSelect={() => {}}/>);
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
  });

  it("calls respective onClick functions when each button is pressed", async () => {
    renderButtonRow();
    expect(buttonOneSpy).toBeCalledTimes(0)
    expect(buttonTwoSpy).toBeCalledTimes(0)
    expect(buttonThreeSpy).toBeCalledTimes(0)
    await userEvent.click(screen.getByRole("button", { name: "Button One" }))
    expect(buttonOneSpy).toBeCalledTimes(1)
    await userEvent.click(screen.getByRole("button", { name: "Button Two" }))
    expect(buttonTwoSpy).toBeCalledTimes(1)
    await userEvent.click(screen.getByRole("button", { name: "Button Three" }))
    expect(buttonThreeSpy).toBeCalledTimes(1)
  });
});
