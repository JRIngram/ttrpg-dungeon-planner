import { useState } from "react";

type Props = {
  id: string;
  formInputName: string;
  ariaLabel: string;
  options: DropdownOption[];
  placeholder: string;
  isRequired?: boolean;
  initialOption?: DropdownOption;
};

type DropdownOption = {
  value: string;
  label: string;
};

export const Dropdown = ({
  id,
  formInputName,
  ariaLabel,
  placeholder,
  isRequired,
  initialOption,
  options,
}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(
    initialOption ? options.findIndex((o) => o === initialOption) : -1,
  );

  return (
    <select
      id={id}
      name={formInputName}
      aria-label={ariaLabel}
      required={!!isRequired}
    >
      <option
        key={"placeholder"}
        value={""}
        onClick={() => setSelectedIndex(-1)}
        selected={selectedIndex === -1}
      >
        {placeholder}
      </option>
      {options.map((option, index) => {
        return (
          <option
            key={option.value}
            value={option.value}
            selected={index === selectedIndex}
            onClick={() => setSelectedIndex(index)}
          >
            {option.label}
          </option>
        );
      })}
    </select>
  );
};
