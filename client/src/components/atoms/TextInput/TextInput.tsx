import React from "react";

type Props = {
  id: string;
  formInputName: string;
  ariaLabel: string;
  placeholder: string;
  isRequired?: boolean;
};

export const TextInput = ({
  ariaLabel,
  id,
  placeholder,
  formInputName,
  isRequired = false,
}: Props) => {
  return (
    <div>
      <input
        id={id}
        name={formInputName}
        className="w-full rounded-lg p-4 border-2 border-secondary-500"
        type="text"
        aria-label={ariaLabel}
        placeholder={placeholder}
        {...(isRequired ? { required: true } : {})}
      />
    </div>
  );
};
