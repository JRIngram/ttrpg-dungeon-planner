export type TextType = "default" | "subheader" | "header";

type Props = {
  textType: TextType;
  text: string;
};

export const Text = ({ text, textType }: Props) => {
  switch (textType) {
    case "header":
      return <p className="text-2xl bold">{text}</p>;
    case "subheader":
      return <p className="text-lg semibold">{text}</p>;
    default:
      return <p className="text-base font-normal">{text}</p>;
  }
};
