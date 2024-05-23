import { describe, it, expect } from "vitest";
import { composeStory } from "@storybook/react";
import Meta, { Default } from "./MonsterForm.stories";
import { render, screen } from "@testing-library/react";

describe("MonsterForm", () => {
  it("renders MonsterForm", () => {
    const MonsterForm = composeStory(Default, Meta);
    render(<MonsterForm />);
    expect(screen.getByRole("textbox", { name: "Monster name" })).toBeVisible();
    expect(
      screen.getByRole("textbox", { name: "Monster XP value" })
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Save" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
  });
});
