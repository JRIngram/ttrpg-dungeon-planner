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
import Meta, { Default, ExistingTrap } from "./TrapForm.stories";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach } from "node:test";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const handlers = [
  http.post("http://127.0.0.1:8000/dungeonPlanner/trap", () => {
    return HttpResponse.json({
      httpCode: 200,
      entity: {
        id: 1,
        name: "Hidden Pit",
        effect: "1d6 falling damage",
      },
    });
  }),
  http.put("http://127.0.0.1:8000/dungeonPlanner/trap/1", () => {
    return HttpResponse.json({
      httpCode: 200,
      entity: {
        id: 1,
        name: "Hidden Pit",
        effect: "1d6 falling damage",
      },
    });
  }),
];

const server = setupServer(...handlers);

describe("Trap Form", () => {
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
    it("renders empty form if no existing trap is passed", () => {
      const TrapForm = composeStory(Default, Meta);

      render(<TrapForm />);

      const nameInput = screen.getByRole("textbox", { name: "Trap name" });
      const effectInput = screen.getByRole("textbox", { name: "Trap effect" });
      const saveButton = screen.getByRole("button", { name: "Save" });
      const cancelButton = screen.getByRole("button", { name: "Cancel" });

      expect(nameInput).toBeVisible();
      expect(effectInput).toBeVisible();
      expect(saveButton).toBeVisible();
      expect(cancelButton).toBeVisible();
    });

    it("renders form if an existing trap is passed", () => {
      const TrapForm = composeStory(ExistingTrap, Meta);

      render(<TrapForm />);

      const populatedNameInput = screen.getByDisplayValue("Test Trap");
      const populatedEffectInput = screen.getByDisplayValue("1d6 damage");
      const saveButton = screen.getByRole("button", { name: "Save" });
      const cancelButton = screen.getByRole("button", { name: "Cancel" });

      expect(populatedNameInput).toBeVisible();
      expect(populatedEffectInput).toBeVisible();
      expect(saveButton).toBeVisible();
      expect(cancelButton).toBeVisible();
    });
  });

  it("calls onCancelCallback when cancel button is clicked", async () => {
    const TrapForm = composeStory(Default, Meta);
    const cancelSpy = vi.fn();

    render(<TrapForm onCancelCallback={() => cancelSpy()} />);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });

    await userEvent.click(cancelButton);

    expect(cancelSpy).toHaveBeenCalledOnce();
  });

  it("calls onSubmitCallback when the form is filled out in New mode and the form is submitted", async () => {
    const TrapForm = composeStory(Default, Meta);
    const submitSpy = vi.fn();

    render(<TrapForm onSubmitCallback={submitSpy} />);

    const nameInput = screen.getByRole("textbox", { name: "Trap name" });
    const effectInput = screen.getByRole("textbox", { name: "Trap effect" });

    await userEvent.type(nameInput, "Hidden Pit");
    await userEvent.type(effectInput, "1d6 falling damage");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(submitSpy).toHaveBeenCalled();
  });
});
