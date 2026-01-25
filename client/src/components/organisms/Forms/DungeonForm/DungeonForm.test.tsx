import { composeStory } from "@storybook/react";
import {
  it,
  describe,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";
import Meta, { Default, ExistingDungeon } from "./DungeonForm.stories";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach } from "node:test";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const handlers = [
  http.post("http://127.0.0.1:8000/dungeonPlanner/dungeon", () => {
    return HttpResponse.json({
      httpCode: 200,
      entity: {
        id: 1,
        name: "The Lost Ruins",
        summary: "Shadowy ruins of an old Dwarvern mining outpost",
        level_min: 1,
        level_max: 3,
        player_count: 4,
      },
    });
  }),
  http.put("http://127.0.0.1:8000/dungeonPlanner/dungeon/1", () => {
    return HttpResponse.json({
      httpCode: 200,
      entity: {
        id: 1,
        name: "The Lost Ruins",
        summary: "Shadowy ruins of an old Dwarvern mining outpost",
        level_min: 1,
        level_max: 3,
        player_count: 4,
      },
    });
  }),
];

const server = setupServer(...handlers);

describe("Dungeon Form", () => {
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  describe("form render", () => {
    it("renders empty form if no existing dungeon is passed", () => {
      const DungeonForm = composeStory(Default, Meta);

      render(<DungeonForm />);

      const nameInput = screen.getByRole("textbox", { name: "Dungeon name" });
      const summaryInput = screen.getByRole("textbox", { name: "Dungeon summary" });
      const levelMinInput = screen.getByRole("textbox", { name: "Dungeon Minimum Level" });
      const levelMaxInput = screen.getByRole("textbox", { name: "Dungeon Maximum Level" });
      const playerCountInput = screen.getByRole("textbox", { name: "Dungeon Player Count" });
      const saveButton = screen.getByRole("button", { name: "Save" });
      const cancelButton = screen.getByRole("button", { name: "Cancel" });

      expect(nameInput).toBeVisible();
      expect(summaryInput).toBeVisible();
      expect(levelMinInput).toBeVisible();
      expect(levelMaxInput).toBeVisible();
      expect(playerCountInput).toBeVisible();
      expect(saveButton).toBeVisible();
      expect(cancelButton).toBeVisible();
    });

    it("renders form if an existing dungeon is passed", () => {
      const DungeonForm = composeStory(ExistingDungeon, Meta);

      render(<DungeonForm />);

      const populatedNameInput = screen.getByDisplayValue("The Lost Ruins");
      const populatedSummaryInput = screen.getByDisplayValue("Shadowy ruins of an old Dwarvern mining outpost");
      const populatedLevelMinInput = screen.getByDisplayValue("1");
      const populatedLevelMaxInput = screen.getByDisplayValue("3");
      const populatedPlayerCountInput = screen.getByDisplayValue("4");
      const saveButton = screen.getByRole("button", { name: "Save" });
      const cancelButton = screen.getByRole("button", { name: "Cancel" });

      expect(populatedNameInput).toBeVisible();
      expect(populatedSummaryInput).toBeVisible();
      expect(populatedLevelMinInput).toBeVisible();
      expect(populatedLevelMaxInput).toBeVisible();
      expect(populatedPlayerCountInput).toBeVisible();
      expect(saveButton).toBeVisible();
      expect(cancelButton).toBeVisible();
    });
  });

  it("calls onCancelCallback when cancel button is clicked", async () => {
    const DungeonForm = composeStory(Default, Meta);
    const cancelSpy = vi.fn();

    render(<DungeonForm onCancelCallback={() => cancelSpy()} />);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });

    await userEvent.click(cancelButton);

    expect(cancelSpy).toHaveBeenCalledOnce();
  });

  it("calls onSubmitCallback when the form is filled out in New mode and the form is submitted", async () => {
    const DungeonForm = composeStory(Default, Meta);
    const submitSpy = vi.fn();

    render(<DungeonForm onSubmitCallback={submitSpy} />);

    const nameInput = screen.getByRole("textbox", { name: "Dungeon name" });
    const summaryInput = screen.getByRole("textbox", { name: "Dungeon summary" });
    const levelMinInput = screen.getByRole("textbox", { name: "Dungeon Minimum Level" });
    const levelMaxInput = screen.getByRole("textbox", { name: "Dungeon Maximum Level" });
    const playerCountInput = screen.getByRole("textbox", { name: "Dungeon Player Count" });

    await userEvent.type(nameInput, "The Lost Ruins");
    await userEvent.type(summaryInput, "Shadowy ruins of an old Dwarvern mining outpost");
    await userEvent.type(levelMinInput, "1");
    await userEvent.type(levelMaxInput, "3");
    await userEvent.type(playerCountInput, "4");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(submitSpy).toHaveBeenCalled();
  });
});