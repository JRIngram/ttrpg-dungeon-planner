"use client";
import { useState } from "react";
import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";
import {
  FormInputField,
  InputMode,
  InputType,
} from "@/components/organisms/FormBuilder/FormBuilder";
import { TrapDataFetcher } from "@/services/TrapDataFetcher/TrapDataFetcher";
import { useQuery } from "@tanstack/react-query";
import { FieldTextDisplayGroup } from "@/components/molecules/FieldTextDisplayGroup/FieldTextDisplayGroup";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { ToastList } from "@/components/organisms/ToastList/ToastList";
import { useToasts, useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";
import { Trap as TrapType } from "@/types/trap";
import { FormBuilder } from "@/components/organisms/FormBuilder/FormBuilder";

export default function Trap() {
  const [selectedTrapId, setSelectedTrapId] = useState<string>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toasts = useToasts();
  const dispatch = useToastsDispatch();

  const trapDataFetcher = new TrapDataFetcher();

  const {
    data,
    isLoading: isLoadingTraps,
    isError: errorLoadingTraps,
    refetch,
  } = useQuery({
    queryKey: ["trap-list"],
    queryFn: () => {
      return trapDataFetcher.getList();
    },
  });

  const traps = data?.map((trap) => ({
    label: trap.name,
    id: trap.id,
  }));

  const getSelectedTrap = (trapList: TrapType[], selectedId: string) =>
    trapList?.find((trap) => trap.id === selectedId);

  const renderTrapDisplay = () => {
    const TrapForm = FormBuilder<TrapType>;
    const formFields: FormInputField[] = [
      {
        inputType: InputType.Text,
        id: "trap-name",
        formInputName: "name",
        ariaLabel: "Trap name",
        formLabelText: "Name",
        placeholder: "e.g. Hidden Pit",
        pattern: `(\\w|\\s){1,}`,
        patternMessage: "Alphanumeric characters",
        value: undefined,
        isRequired: true,
        onChangeCallback: () => {}
      },
      {
        inputType: InputType.Text,
        id: "trap-effect",
        formInputName: "effect",
        ariaLabel: "Trap effect",
        formLabelText: "Trap Effect",
        placeholder: "e.g. 1d4 falling damage",
        pattern: `(\\w|\\s){1,}`,
        patternMessage: "Alphanumeric characters",
        value: undefined,
        isRequired: true,
        onChangeCallback: () => {}
      },
    ];

    if (!selectedTrapId) {
      return (
        <>
          <p>Please select a trap or create a new one below</p>
          <TrapForm
            dataFetcher={trapDataFetcher}
            inputMode={InputMode.NEW}
            onCancelCallback={() => {
              return;
            }}
            onSubmitCallback={async (trap) => {
              await refetch();
              setSelectedTrapId(trap?.id);
            }}
            fields={formFields}
          />
        </>
      );
    } else {
      const selectedTrap = getSelectedTrap(data ?? [], selectedTrapId);
      if (selectedTrap) {
        if (isEditing) {
          return (
            <TrapForm
              dataFetcher={trapDataFetcher}
              inputMode={InputMode.EDIT}
              existingEntity={selectedTrap}
              onSubmitCallback={async (trap) => {
                await refetch();
                setIsEditing(false);
                setSelectedTrapId(trap?.id);
              }}
              onCancelCallback={() => setIsEditing(false)}
              fields={formFields}
            />
          );
        }
        const trapFields = Object.entries(selectedTrap).map((e) => {
          return {
            fieldName: e[0],
            fieldValue: `${e[1]}`,
          };
        });

        return (
          <div className="flex flex-col gap-4">
            <FieldTextDisplayGroup fields={trapFields} />
            {!selectedTrap.isDeletable && (
              <p>This trap is in use in a dungeon and so cannot be deleted.</p>
            )}
            <ButtonRow
              buttons={[
                {
                  text: "Edit",
                  onClick: () => setIsEditing(true),
                  variant: "secondaryOutline",
                },
                {
                  text: "Delete",
                  onClick: async () => {
                    const { httpCode } =
                      await trapDataFetcher.deleteSingle(selectedTrapId);
                    if (!trapDataFetcher.isSuccessfulHTTPCode(httpCode)) {
                      dispatch({
                        type: "add",
                        toast: {
                          type: ToastType.WARNING,
                          message: `Could not delete trap ${selectedTrap.name}. HTTP ${httpCode}`,
                        },
                      });
                    } else {
                      await refetch();
                      setSelectedTrapId(undefined);
                      dispatch({
                        type: "add",
                        toast: {
                          type: ToastType.SUCCESS,
                          message: "Successfully deleted trap",
                        },
                      });
                    }
                  },
                  variant: "tertiaryOutline",
                  disabled: !selectedTrap.isDeletable,
                },
              ]}
            />
          </div>
        );
      }
    }
  };

  const defaultNavDrawerLabel = isLoadingTraps
    ? "Loading"
    : errorLoadingTraps
      ? "Error"
      : "+ Create a new trap";

  const pageTitle = selectedTrapId
    ? getSelectedTrap(data ?? [], selectedTrapId)?.name
    : "Trap";

  return (
    <div className="flex">
      <NavDrawer
        items={traps ?? []}
        onSelect={(id) => {
          setSelectedTrapId(id);
        }}
        defaultItem={{
          label: defaultNavDrawerLabel,
          onDefaultSelected: () => setSelectedTrapId(""),
        }}
      />
      <main className="mx-auto w-3/6">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-lg font-semibold">{pageTitle}</p>
            {renderTrapDisplay()}
          </div>
          <ToastList toastList={toasts} />
        </div>
      </main>
    </div>
  );
}
