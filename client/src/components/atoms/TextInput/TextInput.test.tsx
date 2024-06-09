import { it, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { composeStory } from "@storybook/react";
import Meta, { Primary } from "./TextInput.stories"

describe("TextInput", () => {
  it("renders TextInput with correct aria-label and placeholder text", () => {
    const TextInput = composeStory(Primary, Meta);
    const ariaLabel = "A Test TextInput";
    const placeholderText = "Some test placeholder text";
    render(
      <TextInput
        id="test-id"
        ariaLabel={ariaLabel}
        placeholder={placeholderText}
      />
    );

    const textInput = screen.getByRole("textbox", { name: "A Test TextInput"})

    expect(textInput).toBeVisible();
    expect(screen.getByRole("textbox")).not.toBeRequired()
  });

  it("makes TextInput required if passed isRequired", () => {
    const TextInput = composeStory(Primary, Meta);
    const ariaLabel = "A Test TextInput";
    const placeholderText = "Some test placeholder text";
    render(
      <TextInput
        id="test-id"
        ariaLabel={ariaLabel}
        placeholder={placeholderText}
        isRequired={true}
      />
    );

    expect(screen.getByRole("textbox")).toBeRequired()
  })
});
