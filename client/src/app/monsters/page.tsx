"use client";
import { useState } from "react";
import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";
import {
  InputMode,
  MonsterForm,
} from "@/components/organisms/MonsterForm/MonsterForm";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher";
import { useQuery } from "@tanstack/react-query";
import { FieldTextDisplayGroup } from "@/components/molecules/FieldTextDisplayGroup/FieldTextDisplayGroup";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";

export default function Monster() {
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>();

  const {
    data,
    isLoading: isLoadingMonsters,
    isError: errorLoadingMonsters,
  } = useQuery({
    queryKey: ["monster-list"],
    queryFn: () => {
      const dataFetcher = new MonsterDataFetcher();
      return dataFetcher.getMonsterList();
    },
  });

  const monsters = data?.map((monster) => ({
    label: monster.name,
    id: monster.id,
  }));

  const renderMonsterDisplay = () => {
    if (!selectedMonsterId) {
      return (
        <>
          <p>Please selected a monster or create a new one below</p>
          <MonsterForm inputMode={InputMode.NEW} />
        </>
      );
    } else {
      const selectedMonster = data?.find(
        (monster) => monster.id === selectedMonsterId
      );
      if (selectedMonster) {
        const monsterFields = Object.entries(selectedMonster).map((e) => {
          return {
            fieldName: e[0],
            fieldValue: e[1],
          };
        });

        return (
          <>
            <FieldTextDisplayGroup fields={monsterFields} />
            <ButtonRow
              buttons={[
                {
                  text: "Edit",
                  onClick: () => {},
                  variant: "secondaryOutline",
                },
                {
                  // TODO only display if deltable
                  text: "Delete",
                  onClick: () => {},
                  variant: "tertiaryOutline",
                },
              ]}
            />
          </>
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
        onSelect={(id) => setSelectedMonsterId(id)}
        defaultItem={{
          label: defaultNavDrawerLabel,
          onDefaultSelected: () => setSelectedMonsterId(""),
        }}
      />
      <main className="mx-auto w-3/6">
        <p className="text-lg font-semibold">Monster</p>
        {renderMonsterDisplay()}
      </main>
    </div>
  );
}
