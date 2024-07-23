type Props = {
  fieldName: string;
  fieldValue: string | number | boolean;
};

export const FieldTextDisplay = ({ fieldName, fieldValue }: Props) => (
  <div className="flex gap-x-2">
    <p className="font-semibold">{fieldName}:</p>
    <p>{fieldValue}</p>
  </div>
);
