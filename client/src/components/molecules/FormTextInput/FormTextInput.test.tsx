import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { composeStory } from "@storybook/react";
import Meta, { Primary } from "./FormTextInput.stories";

describe("FormTextInput", () => {
  it("renders form text input with a label", () => {
    const FormTextInput = composeStory(Primary, Meta);
    render(<FormTextInput />);
    const inputByLabel = screen.getByLabelText("Test input label");
    const inputByRole = screen.getByRole("textbox", { name: "Test input" });
    expect(inputByLabel).toBeVisible();
    expect(inputByRole).toBeVisible();
  });

  it("makes child TextInput required if passed isRequired", () => {
    const FormTextInput = composeStory(Primary, Meta);
    render(<FormTextInput isRequired={true} />);
    const inputByLabel = screen.getByLabelText("Test input label*");
    const inputByRole = screen.getByRole("textbox", { name: "Test input" });
    expect(inputByLabel).toBeVisible();
    expect(inputByRole).toBeVisible();
    expect(screen.getByRole("textbox")).toBeRequired();
  });
});
