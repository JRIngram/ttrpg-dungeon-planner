import { Dropdown, DropdownProps } from "@/components/atoms/Dropdown/Dropdown";
import { TextInput } from "@/components/atoms/TextInput/TextInput";

export type ItemQuantitySelectorProps = {
  id: string;
  itemName: string;
  textInputFormName: string;
  dropdownConfig: Pick<
    DropdownProps,
    "placeholder" | "options" | "initialOption"
  >; // just include placeholder and options
  isRequired?: boolean;
};

export const ItemQuantitySelector = ({
  id,
  itemName,
  textInputFormName,
  dropdownConfig,
  isRequired,
}: ItemQuantitySelectorProps) => {
  return (
    <div className="flex gap-4 justify-between" id={id}>
      <TextInput
        id={`${itemName}-quantity`}
        ariaLabel={`${itemName} quantity`}
        formInputName={textInputFormName}
        placeholder="Enter a quantity"
        pattern="\d*"
        isRequired={isRequired}
      />

      <Dropdown
        id={`${id}`}
        ariaLabel={`Select an ${itemName}`}
        formInputName={`${itemName}`}
        placeholder={dropdownConfig.placeholder}
        isRequired={isRequired}
        options={dropdownConfig.options}
        initialOption={dropdownConfig.initialOption}
      />
    </div>
  );
};
