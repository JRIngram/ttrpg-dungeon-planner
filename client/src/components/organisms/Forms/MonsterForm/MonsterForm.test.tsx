import { composeStory } from "@storybook/react";
import { it, describe, expect, vi, beforeEach, beforeAll } from "vitest";
import Meta, { Default } from "./MonsterForm.stories";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher/MonsterDataFetcher";
import { afterEach } from "node:test";

describe("Monster Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("end of form buttons", () => {
    it("renders end of form buttons", () => {
      const MonsterForm = composeStory(Default, Meta);

      render(<MonsterForm />);

      const saveButton = screen.getByRole("button", { name: "Save" });
      const cancelButton = screen.getByRole("button", { name: "Cancel" });

      expect(saveButton).toBeVisible();
      expect(cancelButton).toBeVisible();
    });

    it("calls onCancelCallback when cancel button is clicked", async () => {
      const MonsterForm = composeStory(Default, Meta);
      const cancelSpy = vi.fn();

      render(<MonsterForm onCancelCallback={() => cancelSpy()} />);

      const cancelButton = screen.getByRole("button", { name: "Cancel" });

      await userEvent.click(cancelButton);

      expect(cancelSpy).toHaveBeenCalledOnce();
    });
  });

  it("calls onSubmitCallback when the form is filled out in New mode and the form is submitted", async () => {
    const MonsterForm = composeStory(Default, Meta);
    const submitSpy = vi.fn();

    render(<MonsterForm onSubmitCallback={submitSpy} />);

    const nameInput = screen.getByRole("textbox", { name: "Monster name" });
    const xpInput = screen.getByRole("textbox", { name: "Monster XP value" });
    const form = screen.getByTestId("monster-form");

    await userEvent.type(nameInput, "Goblin");
    await userEvent.type(xpInput, "30");
    fireEvent.submit(form);

    expect(submitSpy).toHaveBeenCalled();
  });
});
