import { vi, describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { composeStory } from "@storybook/react";

import Meta, { Default } from "./NavDrawer.stories";
import userEvent from "@testing-library/user-event";
import { DrawerItem } from "./NavDrawer";

const onSelectSpy = vi.fn();

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
    {
      label: "Item Three",
      id: "3",
    },
  ];
  return render(<NavDrawer items={items} onSelect={(id) => onSelectSpy(id)} />);
};

describe("ButtonRow", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all buttons passed", () => {
    renderButtonRow();
    expect(screen.getByRole("button", { name: "Item One" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Item Two" })).toBeVisible();
  });

  it("calls respective onClick functions when each button is pressed", async () => {
    renderButtonRow();
    expect(onSelectSpy).toBeCalledTimes(0);
    await userEvent.click(screen.getByRole("button", { name: "Item One" }));
    expect(onSelectSpy).toHaveBeenCalledWith("1");
    await userEvent.click(screen.getByRole("button", { name: "Item Two" }));
    expect(onSelectSpy).toHaveBeenCalledWith("2");
    await userEvent.click(screen.getByRole("button", { name: "Item Three" }));
    expect(onSelectSpy).toHaveBeenCalledWith("3");
    expect(onSelectSpy).toHaveBeenCalledTimes(3);
  });
});
