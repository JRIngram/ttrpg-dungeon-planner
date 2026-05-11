export type TextType = "default" | "header";

type Props = {
  textType: TextType;
  text: string;
};

export const Text = ({ text, textType }: Props) => {
  const fontSize = textType === "default" ? "text-base" : "text-xl";

  return <p className={`${fontSize}`}>{text}</p>;
};
