import { vi, describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tabs } from "./Tabs";

describe("Tabs", () => {
  const options = ["Tab 1", "Tab 2", "Tab 3"];

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders tabs with options", () => {
    render(<Tabs options={options} onSelectCallback={() => {}} />);

    options.forEach((option) =>
      expect(screen.getByRole("button", { name: option })).toBeVisible(),
    );
  });

  it("renders first tab as selected tab by default", () => {
    render(<Tabs options={options} onSelectCallback={() => {}} />);

    expect(screen.getByTestId("tab-0-selected"));
    expect(screen.getByTestId("tab-1"));
    expect(screen.getByTestId("tab-2"));
  });

  it("when user clicks a tab the selected tab changes", async () => {
    render(<Tabs options={options} onSelectCallback={() => {}} />);

    expect(screen.getByTestId("tab-0-selected"));
    expect(screen.getByTestId("tab-1"));

    await userEvent.click(screen.getByRole("button", { name: options[1] }));

    expect(screen.getByTestId("tab-0"));
    expect(screen.getByTestId("tab-1-selected"));
  });

  it("call callback when user clicks on a tab", async () => {
    const callbackSpy = vi.fn();
    render(<Tabs options={options} onSelectCallback={callbackSpy} />);

    await userEvent.click(screen.getByText(options[1]));

    expect(callbackSpy).toHaveBeenCalledOnce();
    expect(callbackSpy).toHaveBeenCalledWith(1);
  });
});
