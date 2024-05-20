import { TextInput } from "@/components/atoms/TextInput/TextInput";

type Props = {
  id: string;
  ariaLabel: string;
  formLabelText: string;
  placeholder: string;
};

export const FormTextInput = ({
  id,
  ariaLabel,
  formLabelText,
  placeholder,
}: Props) => {
  return (
    <>
      <label className="text-typograph-500 font-semibold" htmlFor={id}>
        {formLabelText}
      </label>
      <TextInput id={id} ariaLabel={ariaLabel} placeholder={placeholder} />
    </>
  );
};
