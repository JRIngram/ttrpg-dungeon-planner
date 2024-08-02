import { describe, it, expect } from "vitest";
import { composeStory } from "@storybook/react";
import Meta, { Default } from "./MonsterForm.stories";
import { render, screen } from "@testing-library/react";
import Providers from "@/app/providers";
import { InputMode } from "./MonsterForm";

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

  describe("Initial value", () => {
    it("displays monster values if monster passed and InputMode is EDIT", () => {
      const monsterFixture = {
        id: "1",
        name: "Test Monster",
        xp: 10,
      };

      const MonsterForm = composeStory(Default, Meta);
      render(
        <Providers>
          <MonsterForm inputMode={InputMode.EDIT} monster={monsterFixture} />
        </Providers>
      );
      const nameInput = screen.getByDisplayValue(monsterFixture.name);
      const xpInput = screen.getByDisplayValue(monsterFixture.xp);
      expect(nameInput).toBeVisible();
      expect(nameInput).toBeRequired();
      expect(xpInput).toBeVisible();
      expect(xpInput).toBeRequired();
      expect(screen.getByRole("button", { name: "Save" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
    });

    it("does not display monster values if monster passed and InputMode is NEW", () => {
      const monsterFixture = {
        id: "1",
        name: "Test Monster",
        xp: 10,
      };

      const MonsterForm = composeStory(Default, Meta);
      render(
        <Providers>
          <MonsterForm inputMode={InputMode.NEW} monster={monsterFixture} />
        </Providers>
      );
      const nameInput = screen.queryByDisplayValue(monsterFixture.name);
      const xpInput = screen.queryByDisplayValue(monsterFixture.xp);
      expect(nameInput).toBeNull();
      expect(xpInput).toBeNull();
      expect(screen.getByRole("button", { name: "Save" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
    });
  });
});
