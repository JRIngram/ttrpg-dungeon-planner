import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text, TextType } from "./Text";

describe("Text", () => {
  it.each([
    { textType: "default" as TextType, expected: "text-base" },
    { textType: "header" as TextType, expected: "text-xl" },
  ])(
    "renders text size as $expected if textType is $textType",
    ({ expected, textType }) => {
      render(<Text textType={textType} text="Hello world!" />);

      const textComponent = screen.getByText("Hello world!");
      expect(textComponent).toBeVisible();
      expect(textComponent.className.includes(expected)).toEqual(true);
    },
  );
});
