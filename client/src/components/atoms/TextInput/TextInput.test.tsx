import { it, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";
import { composeStory } from "@storybook/react";
import Meta, { Primary } from "./TextInput.stories";

describe("TextInput", () => {
  it("renders TextInput with correct aria-label and placeholder text", () => {
    const TextInput = composeStory(Primary, Meta);

    render(<TextInput />);

    const textInput = screen.getByRole("textbox", { name: "A Test TextInput" });

    expect(textInput).toBeVisible();
    expect(screen.getByRole("textbox")).not.toBeRequired();
  });

  it("renders TextInput with initial value with correct aria-label and placeholder text", () => {
    const TextInput = composeStory(Primary, Meta);
    render(<TextInput />);

    const textInput = screen.getByRole("textbox", { name: "A Test TextInput" });

    expect(textInput).toBeVisible();
    expect(screen.getByRole("textbox")).not.toBeRequired();
  });

  it("makes TextInput required if passed isRequired", () => {
    const TextInput = composeStory(Primary, Meta);
    render(<TextInput isRequired={true} />);

    expect(screen.getByRole("textbox")).toBeRequired();
  });

  it("calls onChangeCallback when a user changes the value", async () => {
    const onChangeCallbackSpy = vi.fn();
    const TextInput = composeStory(Primary, Meta);
    render(
      <TextInput
        onChangeCallback={(value: string) => onChangeCallbackSpy(value)}
      />,
    );

    const textBox = screen.getByRole("textbox");
    const stringToInput = "Hello world!";
    await userEvent.type(textBox, stringToInput);

    expect(onChangeCallbackSpy).toHaveBeenCalledTimes(stringToInput.length);
    expect(onChangeCallbackSpy).toHaveBeenLastCalledWith(stringToInput);
  });
});
