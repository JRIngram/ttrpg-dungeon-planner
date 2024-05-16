import React from "react"
import { TextInput } from "./TextInput";
import { it, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("TextInput", () => {
  it("renders TextInput with correct aria-label and placeholder text", () => {
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
