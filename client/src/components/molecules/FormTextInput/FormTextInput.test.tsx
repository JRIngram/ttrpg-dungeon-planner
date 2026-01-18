import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { composeStory } from "@storybook/react";
import Meta, { Primary, WithInitialValue } from "./FormTextInput.stories";
import userEvent from "@testing-library/user-event";

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

  it.each([
    { storyPrefix: "Without initial value", component: Primary, clearBeforeTyping: false},
    { storyPrefix: "With initial value", component: WithInitialValue, clearBeforeTyping: true},
  ])("$storyPrefix > calls onChangeCallback when a user changes the value", async ({ component, clearBeforeTyping }) => {
    const onChangeCallbackSpy = vi.fn();
    const TextInput = composeStory(component, Meta);
    render(
      <TextInput
        onChangeCallback={(value: string) => onChangeCallbackSpy(value)}
      />,
    );

    const textBox = screen.getByRole("textbox");
    const stringToInput = "Hello world!";
    if(clearBeforeTyping) {
      await userEvent.clear(textBox);
    }
    await userEvent.type(textBox, stringToInput);

    const changeCount = clearBeforeTyping ? stringToInput.length + 1 :  stringToInput.length;
    expect(onChangeCallbackSpy).toHaveBeenCalledTimes(changeCount);
    expect(onChangeCallbackSpy).toHaveBeenLastCalledWith(stringToInput);
    expect(textBox).toHaveValue(stringToInput);
  });
});
