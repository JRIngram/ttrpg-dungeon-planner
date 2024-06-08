import { describe, it, expect } from "vitest";
import { composeStory } from "@storybook/react";
import Meta, { Default } from "./MonsterForm.stories";
import { render, screen } from "@testing-library/react";
import Providers from "@/app/providers";

describe("MonsterForm", () => {
  it("renders MonsterForm", () => {
    const MonsterForm = composeStory(Default, Meta);
    render(
      <Providers>
        <MonsterForm />
      </Providers>
    );
    const nameInput = screen.getByRole("textbox", { name: "Monster name" });
    const xpInput = screen.getByRole("textbox", { name: "Monster XP value" });
    expect(nameInput).toBeVisible();
    expect(nameInput).toBeRequired();
    expect(xpInput).toBeVisible();
    expect(xpInput).toBeRequired();
    expect(screen.getByRole("button", { name: "Save" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
  });
});
