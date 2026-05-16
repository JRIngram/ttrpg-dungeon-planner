"use client";
import { useState } from "react";
import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher/MonsterDataFetcher";
import { useQuery } from "@tanstack/react-query";
import { FieldTextDisplayGroup } from "@/components/molecules/FieldTextDisplayGroup/FieldTextDisplayGroup";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { type Monster as MonsterType } from "@/types/monster";
import { ToastList } from "@/components/organisms/ToastList/ToastList";
import { useToasts, useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";
import { MonsterForm } from "@/components/organisms/Forms/MonsterForm/MonsterForm";
import { Text } from "@/components/atoms/Text/Text";

export default function Monster() {
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toasts = useToasts();
  const dispatch = useToastsDispatch();

  const monsterDataFetcher = new MonsterDataFetcher();

  const {
    data,
    isLoading: isLoadingMonsters,
    isError: errorLoadingMonsters,
    refetch,
  } = useQuery({
    queryKey: ["monster-list"],
    queryFn: () => {
      return monsterDataFetcher.getList();
    },
  });

  const monsters = data?.map((monster) => ({
    label: monster.name,
    id: monster.id,
  }));

  const getSelectedMonster = (monsterList: MonsterType[], selectedId: string) =>
    monsterList?.find((monster) => monster.id === selectedId);

  const renderMonsterDisplay = () => {
    if (!selectedMonsterId) {
      return (
        <>
          <MonsterForm
            onCancelCallback={() => {
              return;
            }}
            onSubmitCallback={async (monster) => {
              await refetch();
              setSelectedMonsterId(monster?.id);
            }}
          />
        </>
      );
    } else {
      const selectedMonster = getSelectedMonster(data ?? [], selectedMonsterId);

      if (selectedMonster) {
        if (isEditing) {
          return (
            <MonsterForm
              existingMonster={selectedMonster}
              onSubmitCallback={async (monster) => {
                await refetch();
                setIsEditing(false);
                setSelectedMonsterId(monster?.id);
              }}
              onCancelCallback={() => setIsEditing(false)}
            />
          );
        }

        return (
          <div className="flex flex-col gap-4">
            <MonsterDisplay monster={selectedMonster} />
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
                      await monsterDataFetcher.deleteSingle(selectedMonsterId);
                    if (!monsterDataFetcher.isSuccessfulHTTPCode(httpCode)) {
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
            {!selectedMonsterId && <Text text="Monster" textType="header" />}
            {renderMonsterDisplay()}
          </div>
          <ToastList toastList={toasts} />
        </div>
      </main>
    </div>
  );
}

type MonsterDisplayProps = {
  monster: MonsterType;
};

const MonsterDisplay = ({ monster }: MonsterDisplayProps) => {
  return (
    <>
      <Text text={monster.name} textType="header" />
      <Text
        text={`Each ${monster.name} is worth ${monster.xp}xp.`}
        textType="default"
      />
    </>
  );
};
