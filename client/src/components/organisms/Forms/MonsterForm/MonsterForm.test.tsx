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
import Meta, { Default, ExistingMonster } from "./MonsterForm.stories";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach } from "node:test";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const handlers = [
  http.post("http://127.0.0.1:8000/dungeonPlanner/monster", () => {
    return HttpResponse.json({
      httpCode: 200,
      entity: {
        id: 1,
        name: "Goblin",
        xp: 30,
      },
    });
  }),
  http.put("http://127.0.0.1:8000/dungeonPlanner/monster/1", () => {
    return HttpResponse.json({
      httpCode: 200,
      entity: {
        id: 1,
        name: "Goblin",
        xp: 30,
      },
    });
  }),
];

const server = setupServer(...handlers);

describe("Monster Form", () => {
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
    it("renders empty form if no existing monster is passed", () => {
      const MonsterForm = composeStory(Default, Meta);

      render(<MonsterForm />);

      const nameInput = screen.getByRole("textbox", { name: "Monster name" });
      const xpInput = screen.getByRole("textbox", { name: "Monster XP value" });
      const saveButton = screen.getByRole("button", { name: "Save" });
      const cancelButton = screen.getByRole("button", { name: "Cancel" });

      expect(nameInput).toBeVisible();
      expect(xpInput).toBeVisible();
      expect(saveButton).toBeVisible();
      expect(cancelButton).toBeVisible();
    });

    it("renders form if an existing monster is passed", () => {
      const MonsterForm = composeStory(ExistingMonster, Meta);

      render(<MonsterForm />);

      const populatedNameInput = screen.getByDisplayValue("Test Mob");
      const populatedXpInput = screen.getByDisplayValue("50");
      const saveButton = screen.getByRole("button", { name: "Save" });
      const cancelButton = screen.getByRole("button", { name: "Cancel" });

      expect(populatedNameInput).toBeVisible();
      expect(populatedXpInput).toBeVisible();
      expect(saveButton).toBeVisible();
      expect(cancelButton).toBeVisible();
    });
  });

  it("calls onCancelCallback when cancel button is clicked", async () => {
    const MonsterForm = composeStory(Default, Meta);
    const cancelSpy = vi.fn();

    render(<MonsterForm onCancelCallback={() => cancelSpy()} />);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });

    await userEvent.click(cancelButton);

    expect(cancelSpy).toHaveBeenCalledOnce();
  });

  it("calls onSubmitCallback when the form is filled out in New mode and the form is submitted", async () => {
    const MonsterForm = composeStory(Default, Meta);
    const submitSpy = vi.fn();

    render(<MonsterForm onSubmitCallback={submitSpy} />);

    const nameInput = screen.getByRole("textbox", { name: "Monster name" });
    const xpInput = screen.getByRole("textbox", { name: "Monster XP value" });

    await userEvent.type(nameInput, "Goblin");
    await userEvent.type(xpInput, "30");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(submitSpy).toHaveBeenCalled();
  });
});
