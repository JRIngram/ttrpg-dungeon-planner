import React, { useState } from "react";

type Props = {
  id: string;
  formInputName: string;
  ariaLabel: string;
  placeholder: string;
  pattern: string;
  onChangeCallback: (value: string) => void;
  patternMessage?: string;
  isRequired?: boolean;
  value?: string;
};

export const TextInput = ({
  ariaLabel,
  id,
  placeholder,
  formInputName,
  pattern,
  patternMessage,
  isRequired = false,
  value = "",
  onChangeCallback,
}: Props) => {
  const [inputValue, setInputValue] = useState<string>(value);

  return (
    <div>
      <input
        id={id}
        name={formInputName}
        className="w-full rounded-lg p-4 border-2 border-secondary-500"
        type="text"
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
          onChangeCallback(event.target.value);
        }}
        pattern={pattern}
        title={patternMessage}
        {...(isRequired ? { required: true } : {})}
      />
    </div>
  );
};
