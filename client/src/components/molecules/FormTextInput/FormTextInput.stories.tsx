import type { Meta, StoryObj } from "@storybook/react";
import { FormTextInput } from "./FormTextInput";

const meta = {
  title: "Components/Molecules/FormTextInput",
  component: FormTextInput,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof FormTextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    id: "test",
    formInputName: "test-form-input",
    formLabelText: "Test input label",
    ariaLabel: "Test input",
    placeholder: "Some placeholder text",
    pattern: "[a-zA-Z]{1,}",
    patternMessage: "Alphabetical characters only",
    value: "",
    onChangeCallback: () => {},
    errorMessage: "",
  },
};

export const WithInitialValue: Story = {
  args: {
    ...Primary.args,
    value: "I am a set value",
  },
};

export const WithError: Story = {
  args: {
    ...Primary.args,
    errorMessage: "I am an error",
  },
};
