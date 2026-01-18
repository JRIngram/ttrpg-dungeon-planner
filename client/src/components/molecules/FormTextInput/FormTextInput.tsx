import { TextInput } from "@/components/atoms/TextInput/TextInput";
import { useState } from "react";

export type FormTextInputProps = {
  id: string;
  formInputName: string;
  ariaLabel: string;
  formLabelText: string;
  placeholder: string;
  pattern: string;
  onChangeCallback: (formInputValue: string) => void;
  patternMessage?: string;
  isRequired?: boolean;
  value?: string;
};

export const FormTextInput = ({
  id,
  ariaLabel,
  formLabelText,
  placeholder,
  formInputName,
  pattern,
  patternMessage,
  onChangeCallback,
  isRequired = false,
  value = "",
}: FormTextInputProps) => {
  const [formInputValue, setformInputValue] = useState<string>(value)

  return (
    <>
      <label className="text-typograph-500 font-semibold" htmlFor={id}>
        {isRequired ? `${formLabelText}*` : formLabelText}
      </label>
      <TextInput
        id={id}
        ariaLabel={ariaLabel}
        placeholder={placeholder}
        formInputName={formInputName}
        value={formInputValue}
        pattern={pattern}
        patternMessage={patternMessage}
        onChangeCallback={(value) => {
          setformInputValue(value)
          onChangeCallback(value)

        }}
        isRequired
      />
    </>
  );
};
