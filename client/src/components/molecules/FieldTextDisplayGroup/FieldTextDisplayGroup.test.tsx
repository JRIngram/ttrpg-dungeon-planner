import { composeStory } from "@storybook/react";
import { describe, it, expect } from "vitest";
import Meta, { Primary } from "./FieldTextDisplayGroup.stories";
import { render, screen } from "@testing-library/react";

describe("FieldTextDisplayGroup", () => {
  it("displays the list of field names and values passed as props", () => {
    const FieldTextDisplayGroup = composeStory(Primary, Meta);
    const fields = [
      {
        fieldName: "Fruit One",
        fieldValue: "Apple",
      },
      {
        fieldName: "Fruit Two",
        fieldValue: "Banana",
      },
      {
        fieldName: "Fruit Three",
        fieldValue: "Cantaloupe",
      },
    ];
    render(<FieldTextDisplayGroup fields={fields} />);
    fields.forEach((field) => {
      expect(screen.getByText(`${field.fieldName}:`)).toBeVisible();
      expect(screen.getByText(field.fieldValue)).toBeVisible();
    });
  });
});
