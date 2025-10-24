import { useState } from "react";

type Props = {
  onSelectCallback: (tabIndex: number) => void;
  options: Option[];
};

type Option = string;

export const Tabs = ({ options, onSelectCallback }: Props) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <div className="flex flex-row">
      {options.map((option, index) => {
        const isSelectedTab = index === selectedTab;

        return (
          <Tab
            key={option}
            index={index}
            testId={`tab-${index}${isSelectedTab ? "-selected" : ""}`}
            option={option}
            onTabSelectCallback={() => {
              setSelectedTab(index);
              onSelectCallback(index);
            }}
            isSelected={isSelectedTab}
          />
        );
      })}
    </div>
  );
};

type TabProps = {
  index: number;
  option: Option;
  testId: string;
  onTabSelectCallback: (tabIndex: number) => void;
  isSelected: boolean
};

const styles = {
  base: "border-4 p-3 font-semibold w-full bg-green-600 text-black",
  selected: "bg-primary-200 text-white",
  notSelected: "bg-primary-50 text-black"
}

const Tab = ({ index, option, onTabSelectCallback, testId, isSelected }: TabProps) => {
  const style = isSelected ? `${styles.base} ${styles.selected}` : `${styles.base} ${styles.notSelected}`

  return (
    <button
      className={style}
      key={option}
      data-testId={testId}
      onClick={() => onTabSelectCallback(index)}
    >
      {option}
    </button>
  );
};
