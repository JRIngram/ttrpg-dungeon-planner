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
  value: string;
  patternMessage?: string;
  errorMessage: string;
  isRequired?: boolean;
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
  value,
  errorMessage,
  isRequired = false,
}: FormTextInputProps) => {
  const [formInputValue, setformInputValue] = useState<string>(value);

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
          setformInputValue(value);
          onChangeCallback(value);
        }}
        isRequired
      />
      {errorMessage.length > 0 && <p>{errorMessage}</p>}
    </>
  );
};
