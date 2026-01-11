import {
  Dropdown,
  DropdownOption,
  DropdownProps,
} from "@/components/atoms/Dropdown/Dropdown";
import { TextInput } from "@/components/atoms/TextInput/TextInput";
import { useState } from "react";

type ItemQuantityPair = {
  itemValue: string;
  quantity: string;
};

export type ItemQuantitySelectorProps = {
  id: string;
  itemName: string;
  textInputFormName: string;
  dropdownConfig: Pick<DropdownProps, "placeholder" | "options">;
  isRequired?: boolean;
  initialValue?: ItemQuantityPair;
  onItemQuantityChangeCallback: (itemQuantityPair: ItemQuantityPair) => void;
};

export const ItemQuantitySelector = ({
  id,
  itemName,
  textInputFormName,
  dropdownConfig,
  isRequired,
  initialValue,
  onItemQuantityChangeCallback,
}: ItemQuantitySelectorProps) => {
  const [quantity, setQuantity] = useState("");
  const [selectedOption, setSelectedOption] = useState<
    DropdownOption | undefined
  >(undefined);

  return (
    <div className="flex gap-4 justify-between" id={id}>
      <TextInput
        id={`${itemName}-quantity`}
        ariaLabel={`${itemName} quantity`}
        formInputName={textInputFormName}
        placeholder="Enter a quantity"
        pattern="\d*"
        isRequired={isRequired}
        value={initialValue !== undefined ? initialValue.quantity : undefined}
        onChangeCallback={(value: string) => {
          setQuantity(value);
          onItemQuantityChangeCallback({
            quantity: value,
            itemValue: selectedOption?.value ?? "",
          });
        }}
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
                (o) => o.value === initialValue.itemValue,
              )
            : undefined
        }
        onChangeCallback={(selectedOption?: DropdownOption) => {
          setSelectedOption(selectedOption);
          onItemQuantityChangeCallback({
            quantity: quantity,
            itemValue: selectedOption?.value ?? "",
          });
        }}
      />
    </div>
  );
};
