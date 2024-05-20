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

    expect(screen.getByRole("textbox")).toBeVisible()
  });
});
