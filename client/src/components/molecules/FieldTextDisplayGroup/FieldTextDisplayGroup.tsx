import { FieldTextDisplay } from "@/components/atoms/FieldTextDisplay/FieldTextDisplay";

type FieldKeyValuePair = {
  fieldName: string;
  fieldValue: string;
};

type Props = {
  fields: FieldKeyValuePair[];
};

export const FieldTextDisplayGroup = ({ fields }: Props) => (
  <div>
    {fields.map(({ fieldName, fieldValue }) => (
      <FieldTextDisplay
        key={fieldName.replace(" ", "-").toLowerCase()}
        fieldName={fieldName}
        fieldValue={fieldValue}
      />
    ))}
  </div>
);
