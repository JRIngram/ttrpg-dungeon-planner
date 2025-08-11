"use client";
import { useState } from "react";
import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";
import { InputMode } from "@/components/organisms/FormBuilder/FormBuilder";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher/MonsterDataFetcher";
import { useQuery } from "@tanstack/react-query";
import { FieldTextDisplayGroup } from "@/components/molecules/FieldTextDisplayGroup/FieldTextDisplayGroup";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { type Monster as MonsterType } from "@/types/monster";
import { ToastList } from "@/components/organisms/ToastList/ToastList";
import { useToasts, useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";
import { FormBuilder } from "@/components/organisms/FormBuilder/FormBuilder";

export default function Monster() {
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toasts = useToasts();
  const dispatch = useToastsDispatch();

  const dataFetcher = new MonsterDataFetcher();

  const {
    data,
    isLoading: isLoadingMonsters,
    isError: errorLoadingMonsters,
    refetch,
  } = useQuery({
    queryKey: ["monster-list"],
    queryFn: () => {
      return dataFetcher.getList();
    },
  });

  const monsters = data?.map((monster) => ({
    label: monster.name,
    id: monster.id,
  }));

  const getSelectedMonster = (monsterList: MonsterType[], selectedId: string) =>
    monsterList?.find((monster) => monster.id === selectedId);

  const renderMonsterDisplay = () => {
    const MonsterForm = FormBuilder<MonsterType>
    const formFields = [
      {
        id: "monster-name",
        formInputName: "name",
        ariaLabel: "Monster name",
        formLabelText: "Name",
        placeholder: "e.g. Goblin",
        pattern: `(\\w|\\s){1,}`,
        patternMessage: "Alphanumeric characters",
        initialValue: undefined,
        isRequired: true,
      },
      {
        id: "monster-xp",
        formInputName: "xp",
        ariaLabel: "Monster XP value",
        formLabelText: "XP Value",
        placeholder: "e.g. 50",
        pattern: "[0-9]{1,}",
        patternMessage: "Numeric values",
        initialValue: undefined,
        isRequired: true,
      }
    ]

    if (!selectedMonsterId) {
      return (
        <>
          <p>Please select a monster or create a new one below</p>
          <MonsterForm
            dataFetcher={new MonsterDataFetcher()}
            inputMode={InputMode.NEW}
            onCancelCallback={() => { return }}
            onSubmitCallback={async (monster) => {
              await refetch();
              setSelectedMonsterId(monster?.id);
            }}
            fields={formFields}
          />
        </>
      );
    } else {
      const selectedMonster = getSelectedMonster(data ?? [], selectedMonsterId);

      if (selectedMonster) {
        if (isEditing) {
          return (
            <MonsterForm
              dataFetcher={new MonsterDataFetcher()}
              inputMode={InputMode.EDIT}
              existingEntity={selectedMonster}
              onSubmitCallback={async (monster) => {
                await refetch();
                setIsEditing(false);
                setSelectedMonsterId(monster?.id);
              }}
              onCancelCallback={() => setIsEditing(false)}
              fields={formFields}
            />
          );
        }

        const monsterFields = Object.entries(selectedMonster).map((e) => {
          return {
            fieldName: e[0],
            fieldValue: `${e[1]}`,
          };
        });
        return (
          <div className="flex flex-col gap-4">
            <FieldTextDisplayGroup fields={monsterFields} />
            {!selectedMonster.isDeletable && (
              <p>
                This monster is in use in a dungeon and so cannot be deleted.
              </p>
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
                      await dataFetcher.deleteSingle(selectedMonsterId);
                    if (!dataFetcher.isSuccessfulHTTPCode(httpCode)) {
                      dispatch({
                        type: "add",
                        toast: {
                          type: ToastType.WARNING,
                          message: `Could not delete monster ${selectedMonster.name}. HTTP ${httpCode}`,
                        },
                      });
                    } else {
                      await refetch();
                      setSelectedMonsterId(undefined);
                      dispatch({
                        type: "add",
                        toast: {
                          type: ToastType.SUCCESS,
                          message: "Successfully deleted monster",
                        },
                      });
                    }
                  },
                  variant: "tertiaryOutline",
                  disabled: !selectedMonster.isDeletable,
                },
              ]}
            />
          </div>
        );
      }
    }
  };

  const defaultNavDrawerLabel = isLoadingMonsters
    ? "Loading"
    : errorLoadingMonsters
      ? "Error"
      : "+ Create a new monster";

  return (
    <div className="flex">
      <NavDrawer
        items={monsters ?? []}
        onSelect={(id) => {
          setSelectedMonsterId(id);
        }}
        defaultItem={{
          label: defaultNavDrawerLabel,
          onDefaultSelected: () => setSelectedMonsterId(""),
        }}
      />
      <main className="mx-auto w-3/6">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-lg font-semibold">
              {selectedMonsterId
                ? getSelectedMonster(data ?? [], selectedMonsterId)?.name
                : "Monster"}
            </p>
            {renderMonsterDisplay()}
          </div>
          <ToastList toastList={toasts} />
        </div>
      </main>
    </div>
  );
}
