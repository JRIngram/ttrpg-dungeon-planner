import { Dropdown, DropdownProps } from "@/components/atoms/Dropdown/Dropdown";
import { TextInput } from "@/components/atoms/TextInput/TextInput";

type Props = {
  itemName: string;
  textInputFormName: string;
  dropdownConfig: Pick<DropdownProps, "placeholder" | "options">; // just include placeholder and options
  isRequired?: boolean;
};

export const ItemQuantitySelector = ({
  itemName,
  textInputFormName,
  dropdownConfig,
  isRequired,
}: Props) => {
  return (
    <div className="flex gap-4">
      <TextInput
        id={`${itemName}-quantity`}
        ariaLabel={`${itemName} quantity`}
        formInputName={textInputFormName}
        placeholder="Enter a quantity"
        pattern="\d*"
        isRequired={isRequired}
      />

      <Dropdown
        id={`${itemName}`}
        ariaLabel={`Select an ${itemName}`}
        formInputName={`${itemName}`}
        placeholder={dropdownConfig.placeholder}
        isRequired={isRequired}
        options={dropdownConfig.options}
      />
    </div>
  );
};
