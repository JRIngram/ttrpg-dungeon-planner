import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react"
import { composeStory } from "@storybook/react";
import Meta, { Primary } from "./FormTextInput.stories"

describe('FormTextInput', () => {
    it('renders form text input with a label', () => {
        const FormTextInput = composeStory(Primary, Meta);
        render(<FormTextInput />);
        const inputByLabel = screen.getByLabelText('Test input label');
        const inputByRole = screen.getByRole("textbox");
        expect(inputByLabel).toBeVisible();
        expect(inputByRole).toBeVisible()
    })
})