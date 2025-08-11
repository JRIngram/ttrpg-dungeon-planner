import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";
import { useToastsDispatch } from "@/context/ToastContext";
import { DataFetcher } from "@/services/DataFetcher/DataFetcher"
import { ToastType } from "@/types/toast";

type FormInputField = {
    id: string;
    formInputName: string;
    ariaLabel: string;
    formLabelText: string;
    placeholder: string;
    pattern: string;
    patternMessage?: string;
    isRequired?: boolean;
    initialValue?: string;
}

export enum InputMode {
    "NEW",
    "EDIT",
}


type Props<T> = {
    dataFetcher: DataFetcher<T>
    onSubmitCallback: (entity: T) => void
    onCancelCallback: () => void
    fields: FormInputField[]
    inputMode: InputMode
    existingEntity?: T
}

export const FormBuilder = <T,>({
    onSubmitCallback,
    onCancelCallback,
    fields,
    inputMode,
    existingEntity,
    dataFetcher,
}: Props<T>) => {
    const dispatch = useToastsDispatch();

    const submitForm = async (formData: FormData) => {
        const fieldsToSubmit = fields.map((field) => [
            field.formInputName, formData.get(field.formInputName)
        ]);
        const newEntity = Object.fromEntries(fieldsToSubmit);
        if (inputMode === InputMode.NEW) {
            try {
                const { entity, httpCode } = await dataFetcher.addSingle(newEntity)
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
                const fieldsToSubmit = fields.map((field) => [
                    field.formInputName, formData.get(field.formInputName)
                ]);
                const updatedEntityFields = Object.fromEntries(fieldsToSubmit);
                const { entity, httpCode } = await dataFetcher.editSingle({
                    ...existingEntity,
                    ...updatedEntityFields
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
    }

    return (
        <div className="flex flex-col gap-4">
            <form action={submitForm}>
                <div className="flex flex-col gap-2">
                    {fields.map(field => {
                        const getInitialValueFromExistingEntity = (existingEntity: Record<string, any>, formInputName: string) => {
                            if (inputMode === InputMode.EDIT && existingEntity && existingEntity[formInputName]) {
                                console.log({ existingEntity })
                                return existingEntity[field.formInputName]
                            }
                            return field.initialValue
                        }
                        const initialValue = existingEntity ? getInitialValueFromExistingEntity(existingEntity, field.formInputName) : field.initialValue;

                        return <FormTextInput
                            key={field.id}
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
                    })}
                    <ButtonRow
                        buttons={[
                            {
                                text: "Save",
                                onClick: async () => { },
                                variant: "primaryFilled",
                                isSubmit: true,
                            },
                            {
                                text: "Cancel",
                                onClick: onCancelCallback,
                                variant: "tertiaryOutline",
                            },
                        ]}
                    />
                </div>
            </form>
        </div>
    );
}