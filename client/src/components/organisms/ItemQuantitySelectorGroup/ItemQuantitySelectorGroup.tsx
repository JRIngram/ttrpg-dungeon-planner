import { Button } from "@/components/atoms/Button/Button";
import { DropdownProps } from "@/components/atoms/Dropdown/Dropdown";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import {
  ItemQuantityPair,
  ItemQuantitySelector,
} from "@/components/molecules/ItemQuantitySelector/ItemQuantitySelector";
import { useEffect, useState } from "react";

export type ItemQuantitySelectorGroupProps = {
  id: string;
  itemName: string;
  textInputFormName: string;
  dropdownConfig: Pick<DropdownProps, "placeholder" | "options">;
  isRequired: boolean;
  initialValue: ItemQuantityPair[];
  onItemQuantityChangeCallback: (itemQuantityPairs: ItemQuantityPair[]) => void;
};

export const ItemQuantitySelectorGroup = ({
  id,
  itemName,
  textInputFormName,
  dropdownConfig,
  isRequired,
  initialValue,
  onItemQuantityChangeCallback,
}: ItemQuantitySelectorGroupProps) => {
  const [inputRowCount, setInputRowCount] = useState<number>(
    initialValue.length > 1 ? initialValue.length : 1,
  );

  const [itemQuantityPairs, setItemQuantityPairs] =
    useState<ItemQuantityPair[]>(initialValue);

  return (
    <>
      {new Array(inputRowCount).fill(inputRowCount).map((_, rowIndex) => (
        <ItemQuantitySelector
          key={rowIndex}
          id={id}
          itemName={itemName}
          textInputFormName={textInputFormName}
          dropdownConfig={dropdownConfig}
          onItemQuantityChangeCallback={(itemQuantityPair) => {
            let updatedItemQuantityPairs;
            if (rowIndex === itemQuantityPairs.length) {
              updatedItemQuantityPairs = [
                ...itemQuantityPairs,
                itemQuantityPair,
              ];
            } else {
              updatedItemQuantityPairs = itemQuantityPairs.map(
                (previousIQPair, idx) =>
                  idx === rowIndex ? itemQuantityPair : previousIQPair,
              );
            }
            setItemQuantityPairs(updatedItemQuantityPairs);
            onItemQuantityChangeCallback(updatedItemQuantityPairs);
          }}
          initialValue={initialValue[rowIndex]}
          isRequired={isRequired}
        />
      ))}
      <ButtonRow
        buttons={[
          {
            variant: "tertiaryOutline",
            text: "Add Row +",
            onClick: () => setInputRowCount(inputRowCount + 1),
          },
          {
            variant: "tertiaryOutline",
            text: "Remove Row -",
            onClick: () => {
              if (inputRowCount !== 1) {
                setInputRowCount(inputRowCount - 1);
                console.log({
                  itemQuantityPairs,
                  u: itemQuantityPairs.slice(0, itemQuantityPairs.length - 1),
                });

                const updatedItemQuantityPairs = itemQuantityPairs.slice(
                  0,
                  itemQuantityPairs.length - 1,
                );
                setItemQuantityPairs(updatedItemQuantityPairs);
                onItemQuantityChangeCallback(updatedItemQuantityPairs);
              }
            },
          },
        ]}
      />
    </>
  );
};
