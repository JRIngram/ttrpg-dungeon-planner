import { Dropdown, DropdownProps } from "@/components/atoms/Dropdown/Dropdown";
import { TextInput } from "@/components/atoms/TextInput/TextInput";

type ItemQuantityPair = {
  itemValue: string;
  quantity: string;
};

export type ItemQuantitySelectorProps = {
  id: string;
  itemName: string;
  textInputFormName: string;
  dropdownConfig: Pick<DropdownProps, "placeholder" | "options">; // just include placeholder and options
  isRequired?: boolean;
  initialValue?: ItemQuantityPair;
};

export const ItemQuantitySelector = ({
  id,
  itemName,
  textInputFormName,
  dropdownConfig,
  isRequired,
  initialValue,
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
        initialValue={
          initialValue !== undefined ? initialValue.quantity : undefined
        }
      />

      <Dropdown
        id={`${id}`}
        ariaLabel={`Select an ${itemName}`}
        formInputName={`${itemName}`}
        placeholder={dropdownConfig.placeholder}
        isRequired={isRequired}
        options={dropdownConfig.options}
        initialOption={
          initialValue !== undefined
            ? dropdownConfig.options.find(
                (o) => o.value === initialValue.itemValue
              )
            : undefined
        }
      />
    </div>
  );
};
