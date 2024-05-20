import { it, describe, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { composeStory } from "@storybook/react";

import Meta, { Primary } from "./Button.stories";

describe("Button", () => {
  it("renders Button with correct name", () => {
    const Button = composeStory(Primary, Meta);
    render(
      <Button text={"Press me!"} ariaLabel={"Press me!"} onClick={() => {}} />
    );

    expect(screen.getByRole("button", { name: "Press me!" })).toBeVisible();
  });

  it("calls onClick when clicked", async () => {
    const onClickSpy = vi.fn();
    const Button = composeStory(Primary, Meta);
    render(
      <Button onClick={onClickSpy} />
    );

    const button = screen.getByRole("button", { name: "Press me!" });
    await userEvent.click(button);
    expect(onClickSpy).toBeCalledTimes(1);
  });
});
