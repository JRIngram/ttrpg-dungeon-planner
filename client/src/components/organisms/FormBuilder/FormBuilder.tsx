import { ButtonProps } from "@/components/atoms/Button/Button";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import {
  FormTextInput,
  FormTextInputProps,
} from "@/components/molecules/FormTextInput/FormTextInput";
import {
  ItemQuantitySelector,
  ItemQuantitySelectorProps,
} from "@/components/molecules/ItemQuantitySelector/ItemQuantitySelector";
import { useToastsDispatch } from "@/context/ToastContext";
import { DataFetcher } from "@/services/DataFetcher/DataFetcher";
import { ToastType } from "@/types/toast";

export enum InputType {
  "Text",
  "QuantitySelector",
}

export type FormInputField =
  | ({ inputType: InputType.Text } & FormTextInputProps)
  | ({ inputType: InputType.QuantitySelector } & ItemQuantitySelectorProps);

export enum InputMode {
  "NEW",
  "EDIT",
}

type Props<T> = {
  dataFetcher: DataFetcher<T>;
  onSubmitCallback: (entity: T) => void;
  onCancelCallback: () => void;
  fields: FormInputField[];
  inputMode: InputMode;
  existingEntity?: T;
  endOfFormButtons?: ButtonProps[];

  // For data that is required for a request, but not extracted from form
  requiredNonFormData?: {
    [key: string]: string | number | undefined | Array<string | number>;
  };
};

export const FormBuilder = <T,>({
  onSubmitCallback,
  onCancelCallback,
  fields,
  inputMode,
  existingEntity,
  dataFetcher,
  requiredNonFormData,
  endOfFormButtons = [
    {
      text: "Save",
      onClick: async () => {},
      variant: "primaryFilled",
      isSubmit: true,
    },
    {
      text: "Cancel",
      onClick: onCancelCallback,
      variant: "tertiaryOutline",
    },
  ],
}: Props<T>) => {
  const dispatch = useToastsDispatch();

  const getFieldsToSubmit = (fields: FormInputField[], formData: FormData) => {
    return fields.map((field) => {
      console.log({ field });
      switch (field.inputType) {
        case InputType.Text:
          return [field.formInputName, formData.get(field.formInputName)];
        case InputType.QuantitySelector:
          console.log("we quant", { field });
          console.log("quantSelector", {
            qs: formData.get(field.textInputFormName),
          });
          console.log("itemSelector", { is: formData.get(field.itemName) });
          return [];
        default:
          return [];
      }
    });
  };

  const submitForm = async (formData: FormData) => {
    const fieldsToSubmit = getFieldsToSubmit(fields, formData);
    const newEntity = {
      ...Object.fromEntries(fieldsToSubmit),
      ...requiredNonFormData,
    };

    if (inputMode === InputMode.NEW) {
      try {
        const { entity, httpCode } = await dataFetcher.addSingle(newEntity);
        if (entity) {
          onSubmitCallback(entity);
          dispatch({
            type: "add",
            toast: {
              message: `Added entity`,
              type: ToastType.SUCCESS,
            },
          });
        } else {
          dispatch({
            type: "add",
            toast: {
              message: `Could not add entity. HTTP ${httpCode}`,
              type: ToastType.WARNING,
            },
          });
        }
      } catch (err) {
        throw new Error("could not add entity");
      }
    } else if (inputMode === InputMode.EDIT) {
      try {
        const fieldsToSubmit = getFieldsToSubmit(fields, formData);
        const updatedEntityFields = Object.fromEntries(fieldsToSubmit);
        const { entity, httpCode } = await dataFetcher.editSingle({
          ...existingEntity,
          ...updatedEntityFields,
        });
        if (entity) {
          onSubmitCallback(entity);
          dispatch({
            type: "add",
            toast: {
              message: `Edited entity`,
              type: ToastType.SUCCESS,
            },
          });
        } else {
          dispatch({
            type: "add",
            toast: {
              message: `Could not edit monster. HTTP ${httpCode}`,
              type: ToastType.WARNING,
            },
          });
        }
      } catch (err) {
        throw new Error("failed to update entity");
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form action={submitForm}>
        <div className="flex flex-col gap-2">
          {fields.map((field) => (
            <RenderField
              key={field.id}
              inputMode={inputMode}
              existingEntity={existingEntity}
              field={field}
            />
          ))}
          <ButtonRow buttons={endOfFormButtons} />
        </div>
      </form>
    </div>
  );
};

type RenderFieldProps<T> = {
  field: FormInputField;
  inputMode: InputMode;
  existingEntity?: T;
};

const RenderField = <T,>({
  field,
  inputMode,
  existingEntity,
}: RenderFieldProps<T>) => {
  const getInitialValueFromExistingEntity = (
    existingEntity: Record<string, any>,
    fieldName: string
  ) => {
    if (
      inputMode === InputMode.EDIT &&
      existingEntity &&
      existingEntity[fieldName]
    ) {
      console.log({ e: existingEntity, f: field });

      switch (field.inputType) {
        case InputType.Text:
          return existingEntity[fieldName];
        case InputType.QuantitySelector:
          return existingEntity[fieldName];
      }
    }
  };

  const getInitialValue = (
    field: FormInputField,
    existingEntity: T | undefined
  ) => {
    switch (field.inputType) {
      case InputType.Text:
        return existingEntity
          ? getInitialValueFromExistingEntity(
              existingEntity,
              field.formInputName
            )
          : field.initialValue;
      case InputType.QuantitySelector:
        return existingEntity
          ? getInitialValueFromExistingEntity(existingEntity, field.itemName)
          : undefined;
    }
  };

  const initialValue = getInitialValue(field, existingEntity);

  switch (field.inputType) {
    case InputType.Text:
      return (
        <FormTextInput
          id={field.id}
          formInputName={field.formInputName}
          ariaLabel={field.ariaLabel}
          formLabelText={field.formLabelText}
          placeholder={field.placeholder}
          pattern={field.pattern}
          patternMessage={field.patternMessage}
          initialValue={initialValue}
          isRequired={field.isRequired}
        />
      );
    case InputType.QuantitySelector:
      return (
        <ItemQuantitySelector
          id={field.id}
          itemName={field.itemName}
          textInputFormName={field.textInputFormName}
          dropdownConfig={field.dropdownConfig}
          isRequired={field.isRequired}
        />
      );
    default:
      return;
  }
};
