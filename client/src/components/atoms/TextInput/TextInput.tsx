import React from "react";

type Props = {
  id: string;
  ariaLabel: string;
  placeholder: string;
};

export const TextInput = ({ ariaLabel, id, placeholder }: Props) => {
  return (
    <div>
      <input
        id={id}
        className="w-full rounded-lg p-4"
        type="text"
        aria-label={ariaLabel}
        placeholder={placeholder}
      />
    </div>
  );
};
