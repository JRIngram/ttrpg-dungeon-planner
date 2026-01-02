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
import { useState } from "react";

export enum InputType {
  "Text",
  "QuantitySelector",
}

type FormInputGenericProps = {
  allowMultipleOfSame?: boolean;
};

export type FormInputField =
  | (FormInputGenericProps & { inputType: InputType.Text } & FormTextInputProps)
  | (FormInputGenericProps & {
      inputType: InputType.QuantitySelector;
    } & ItemQuantitySelectorProps);

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

    /**
     * Groups fields together if they have same fieldName.
     * Assumes they are the same due to being a pair in quantity fields.
     */
    const groupMultiFields = (fieldName: string, formData: FormData) => {
      // This is hacky, but I've accepted I'm refactoring the forms
      const depluralisedKey = fieldName.substring(0, fieldName.length - 1);

      const keys = Array.from(formData.keys());
      const fieldNameRegex = RegExp(`^${fieldName}-[0-9]+$`); // fieldName-AnyDigit, e.g. monster-1
      const filteredKeys = Array.from(new Set(keys.filter((k) => k.match(fieldNameRegex))))
      const fieldValues = filteredKeys.map((fk) => {
        const matchingValues = formData.getAll(fk);
        const quantityObject: {[key:string]: any} = {}
        quantityObject.quantity = matchingValues[0];
        quantityObject[depluralisedKey] = matchingValues[1];
        return quantityObject;
      });

      return fieldValues;
    };

    return fields.map((field) => {
      switch (field.inputType) {
        case InputType.Text:
          return [
            field.formInputName,
            field.allowMultipleOfSame
              ? groupMultiFields(field.formInputName, formData)
              : formData.get(`${field.formInputName}-0`),
          ];
        case InputType.QuantitySelector:
          return [
            field.itemName,
            field.allowMultipleOfSame
              ? groupMultiFields(field.itemName, formData)
              : formData.get(`${field.itemName}-0`),
          ];
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
  const [fieldCount, setFieldCount] = useState<number>(1);

  const getInitialValueFromExistingEntity = (
    existingEntity: Record<string, any>,
    fieldName: string,
  ) => {
    if (
      inputMode === InputMode.EDIT &&
      existingEntity &&
      existingEntity[fieldName]
    ) {
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
    existingEntity: T | undefined,
  ) => {
    switch (field.inputType) {
      case InputType.Text:
        return existingEntity
          ? getInitialValueFromExistingEntity(
              existingEntity,
              field.formInputName,
            )
          : field.initialValue;
      case InputType.QuantitySelector:
        return existingEntity
          ? getInitialValueFromExistingEntity(existingEntity, field.itemName)
          : undefined;
    }
  };

  const initialValue = getInitialValue(field, existingEntity);

  const renderField = (index: number) => {
    switch (field.inputType) {
      case InputType.Text:
        return (
          <FormTextInput
            id={`${field.id}-${index}`}
            formInputName={`${field.formInputName}-${index}`}
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
            id={`${field.id}-${index}`}
            itemName={`${field.itemName}-${index}`}
            textInputFormName={`${field.textInputFormName}-${index}`}
            dropdownConfig={field.dropdownConfig}
            isRequired={field.isRequired}
            initialValue={initialValue ? {
              itemValue: initialValue[index].id,
              quantity: initialValue[index].quantity
            } : undefined}
          />
        );
      default:
        return;
    }
  };

  if (!field.allowMultipleOfSame) {
    return renderField(0);
  }

  return (
    <>
      {/* Fills an array with 0..N, where N is the fieldCount */}
      {Array.from({ length: fieldCount }, (_, i) => i).map((c) =>
        renderField(c),
      )}
      <div className="flex gap-4">
        <button onClick={() => setFieldCount(fieldCount + 1)}>Add</button>
        <button
          onClick={() => setFieldCount(fieldCount > 1 ? fieldCount - 1 : 1)}
        >
          Remove
        </button>
      </div>
    </>
  );
};
