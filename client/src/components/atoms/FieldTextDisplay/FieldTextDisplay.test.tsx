import { composeStory } from "@storybook/react";
import { describe, it, expect } from "vitest";
import Meta, { Primary } from "./FieldTextDisplay.stories";
import { render, screen } from "@testing-library/react";

describe("FieldTextDisplay", () => {
  it("displays field name and value", () => {
    const FieldTextDisplay = composeStory(Primary, Meta);
    render(<FieldTextDisplay />);
    expect(screen.getByText("Test Field:")).toBeVisible();
    expect(screen.getByText("Passed!")).toBeVisible();
  });
});
