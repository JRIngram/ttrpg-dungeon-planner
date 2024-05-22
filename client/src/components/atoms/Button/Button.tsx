type Variants = "primaryFilled" | "primaryOutline";

type Props = {
  text: string;
  onClick: () => void;
  ariaLabel?: string;
  variant: Variants;
};

const styles = {
  base: "border-4 rounded-full p-3",
  variants: {
    primary: {
      base: `border-primary-200 hover:bg-primary-50 hover:text-primary-200 active:bg-primary-50 active:bg-primary-50 active:border-primary-50`,
      outline: `text-primary-200`,
      filled: `text-white bg-primary-200`,
    },
  },
};

export const Button = ({ text, ariaLabel, onClick, variant }: Props) => {
  const getVariantStyle = () => {
    switch (variant) {
      case "primaryFilled":
        return `${styles.base} ${styles.variants.primary.base} ${styles.variants.primary.filled}`;
      case "primaryOutline":
        return `${styles.base} ${styles.variants.primary.base} ${styles.variants.primary.outline}`;
    }
  };

  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className={getVariantStyle()}
    >
      {text}
    </button>
  );
};
