import { it, describe, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { composeStory } from "@storybook/react";

import Meta, { Primary } from "./Button.stories";

describe("Button", () => {
  it("renders Button with correct name and type", () => {
    const Button = composeStory(Primary, Meta);
    render(
      <Button text={"Press me!"} ariaLabel={"Press me!"} onClick={() => {}} />
    );

    const button = screen.getByRole("button", { name: "Press me!" });

    expect(button).toBeVisible();
    expect(button).toHaveAttribute("type", "button");
    expect(button).not.toBeDisabled();
  });

  it("renders button as submit when isSubmit passed", () => {
    const Button = composeStory(Primary, Meta);
    render(
      <Button
        text={"Press me!"}
        ariaLabel={"Press me!"}
        onClick={() => {}}
        isSubmit={true}
      />
    );
    expect(screen.getByRole("button", { name: "Press me!" })).toHaveAttribute(
      "type",
      "submit"
    );
  });

  it("calls onClick when clicked", async () => {
    const onClickSpy = vi.fn();
    const Button = composeStory(Primary, Meta);
    render(<Button onClick={onClickSpy} />);

    const button = screen.getByRole("button", { name: "Press me!" });
    await userEvent.click(button);
    expect(onClickSpy).toBeCalledTimes(1);
  });

  it("disables button when passed disabled prop", async () => {
    const Button = composeStory(Primary, Meta);
    render(
      <Button
        text={"Press me!"}
        ariaLabel={"Press me!"}
        onClick={() => {}}
        disabled={true}
      />
    );

    const button = screen.getByRole("button", { name: "Press me!" });

    expect(button).toBeVisible();
    expect(button).toHaveAttribute("type", "button");
    expect(button).toBeDisabled();
  });
});
