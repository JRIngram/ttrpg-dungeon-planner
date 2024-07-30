import { vi, describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { DrawerItem, NavDrawer } from "./NavDrawer";

const onSelectSpy = vi.fn();
const onDefaultSelectedSpy = vi.fn();

const renderButtonRow = (withDefault = false) => {
  const defaultItem = {
    label: "Default Item",
    onDefaultSelected: onDefaultSelectedSpy,
  };

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

  if (withDefault) {
    return render(
      <NavDrawer
        items={items}
        onSelect={(id) => onSelectSpy(id)}
        defaultItem={defaultItem}
      />
    );
  }

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
    expect(screen.getByRole("button", { name: "Item Three" })).toBeVisible();
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

  describe("Default option", () => {
    it("renders all buttons passed and default option", () => {
      renderButtonRow(true);
      expect(
        screen.getByRole("button", { name: "Default Item" })
      ).toBeVisible();
      expect(screen.getByRole("button", { name: "Item One" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Item Two" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Item Three" })).toBeVisible();
    });

    it("calls respective onClick functions when each button is pressed", async () => {
      renderButtonRow(true);
      expect(onDefaultSelectedSpy).toBeCalledTimes(0);
      await userEvent.click(screen.getByRole("button", { name: "Item One" }));
      expect(onSelectSpy).toHaveBeenCalledWith("1");
      await userEvent.click(screen.getByRole("button", { name: "Item Two" }));
      expect(onSelectSpy).toHaveBeenCalledWith("2");
      await userEvent.click(screen.getByRole("button", { name: "Item Three" }));
      expect(onSelectSpy).toHaveBeenCalledWith("3");
      expect(onSelectSpy).toHaveBeenCalledTimes(3);

      expect(onDefaultSelectedSpy).toBeCalledTimes(0);
      await userEvent.click(
        screen.getByRole("button", { name: "Default Item" })
      );
      expect(onDefaultSelectedSpy).toHaveBeenCalledOnce();
    });
  });
});
