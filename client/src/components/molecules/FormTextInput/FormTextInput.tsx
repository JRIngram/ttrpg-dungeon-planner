import { TextInput } from "@/components/atoms/TextInput/TextInput";

type Props = {
  id: string;
  formInputName: string;
  ariaLabel: string;
  formLabelText: string;
  placeholder: string;
  isRequired?: boolean;
  initialValue?: string;
};

export const FormTextInput = ({
  id,
  ariaLabel,
  formLabelText,
  placeholder,
  formInputName,
  isRequired = false,
  initialValue = "",
}: Props) => {
  return (
    <>
      <label className="text-typograph-500 font-semibold" htmlFor={id}>
        {isRequired ? `${formLabelText}*` : formLabelText}
      </label>
      <TextInput
        id={id}
        ariaLabel={ariaLabel}
        placeholder={placeholder}
        formInputName={formInputName}
        initialValue={initialValue}
        isRequired
      />
    </>
  );
};
