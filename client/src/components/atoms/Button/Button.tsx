type Props = {
  text: string;
  ariaLabel: string;
  onClick: () => void;
};

export const Button = ({ text, ariaLabel, onClick }: Props) => {
  return (
    <button aria-label={ariaLabel} onClick={onClick}>
      {text}
    </button>
  );
};
