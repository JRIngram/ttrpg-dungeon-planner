import { Button, type ButtonProps } from "@/components/atoms/Button/Button";

type Props = {
  buttons: ButtonProps[];
};

export const ButtonRow = ({ buttons }: Props) => {
  return (
    <div className="flex flex-row gap-2">
      {buttons.map((buttonProps) => (
        <Button key={buttonProps.text} {...buttonProps} />
      ))}
    </div>
  );
};
