import React, { useState } from "react";

type Props = {
  id: string;
  formInputName: string;
  ariaLabel: string;
  placeholder: string;
  isRequired?: boolean;
  initialValue?: string;
};

export const TextInput = ({
  ariaLabel,
  id,
  placeholder,
  formInputName,
  isRequired = false,
  initialValue = "",
}: Props) => {
  const [value, setValue] = useState<string>(initialValue);

  return (
    <div>
      <input
        id={id}
        name={formInputName}
        className="w-full rounded-lg p-4 border-2 border-secondary-500"
        type="text"
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        {...(isRequired ? { required: true } : {})}
      />
    </div>
  );
};
