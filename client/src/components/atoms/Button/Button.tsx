type Variants =
  | "primaryFilled"
  | "primaryOutline"
  | "secondaryFilled"
  | "secondaryOutline"
  | "tertiaryFilled"
  | "tertiaryOutline";

type Props = {
  text: string;
  onClick: () => void;
  ariaLabel?: string;
  variant: Variants;
};

const styles = {
  base: "border-4 rounded-full p-3 font-semibold w-full",
  variants: {
    primary: {
      base: `border-primary-200 hover:bg-primary-50 hover:text-primary-200 active:bg-primary-50 active:bg-primary-50 active:border-primary-50`,
      outline: `text-primary-200`,
      filled: `text-white bg-primary-200`,
    },
    secondary: {
      base: `border-secondary-700 hover:bg-secondary-300 hover:text-typography-800 active:bg-secondary-300 active:bg-secondary-300 active:border-secondary-300`,
      outline: `text-secondary-700`,
      filled: `bg-secondary-700 text-typography-50`,
    },
    tertiary: {
      base: `border-tertiary-700 hover:bg-tertiary-300 hover:text-typography-900 active:bg-tertiary-300 active:bg-tertiary-300 active:border-tertiary-300`,
      outline: `text-tertiary-700 `,
      filled: `text-typography-50 bg-tertiary-700`,
    },
  },
};

export const Button = ({ text, ariaLabel, onClick, variant }: Props) => {
  const getVariantStyle = () => {
    const { base, variants } = styles;
    const { primary, secondary, tertiary } = variants;
    switch (variant) {
      case "primaryFilled":
        return `${base} ${primary.base} ${primary.filled}`;
      case "primaryOutline":
        return `${base} ${primary.base} ${primary.outline}`;
      case "secondaryFilled":
        return `${base} ${secondary.base} ${secondary.filled}`;
      case "secondaryOutline":
        return `${base} ${secondary.base} ${secondary.outline}`;
      case "tertiaryFilled":
        return `${base} ${tertiary.base} ${tertiary.filled}`;
      case "tertiaryOutline":
        return `${base} ${tertiary.base} ${tertiary.outline}`;
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
