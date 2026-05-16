"use client";
import { useState } from "react";
import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";
import { TrapDataFetcher } from "@/services/TrapDataFetcher/TrapDataFetcher";
import { useQuery } from "@tanstack/react-query";
import { FieldTextDisplayGroup } from "@/components/molecules/FieldTextDisplayGroup/FieldTextDisplayGroup";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { ToastList } from "@/components/organisms/ToastList/ToastList";
import { useToasts, useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";
import { Trap as TrapType } from "@/types/trap";
import { TrapForm } from "@/components/organisms/Forms/TrapForm/TrapForm";
import { Text } from "@/components/atoms/Text/Text";

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
    if (!selectedTrapId) {
      return (
        <>
          <TrapForm
            onCancelCallback={() => {
              return;
            }}
            onSubmitCallback={async (trap) => {
              await refetch();
              setSelectedTrapId(trap?.id);
            }}
          />
        </>
      );
    } else {
      const selectedTrap = getSelectedTrap(data ?? [], selectedTrapId);
      if (selectedTrap) {
        if (isEditing) {
          return (
            <TrapForm
              existingTrap={selectedTrap}
              onSubmitCallback={async (trap) => {
                await refetch();
                setIsEditing(false);
                setSelectedTrapId(trap?.id);
              }}
              onCancelCallback={() => setIsEditing(false)}
            />
          );
        }

        return (
          <div className="flex flex-col gap-4">
            <TrapDisplay trap={selectedTrap} />
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
            {!selectedTrapId && <Text text="Trap" textType="header" />}
            {renderTrapDisplay()}
          </div>
          <ToastList toastList={toasts} />
        </div>
      </main>
    </div>
  );
}

type TrapDisplayProps = {
  trap: TrapType;
};

const TrapDisplay = ({ trap }: TrapDisplayProps) => {
  return (
    <>
      <Text text={trap.name} textType="header" />
      <Text
        text={`Each ${trap.name} has the following effect: ${trap.effect}`}
        textType="default"
      />
    </>
  );
};
