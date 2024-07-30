"use client";
import { useState } from "react";
import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";
import {
  InputMode,
  MonsterForm,
} from "@/components/organisms/MonsterForm/MonsterForm";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/atoms/Button/Button";
import { FieldTextDisplayGroup } from "@/components/molecules/FieldTextDisplayGroup/FieldTextDisplayGroup";

export default function Monster() {
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>();

  const { data } = useQuery({
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
        return <FieldTextDisplayGroup fields={monsterFields} />;
      }
    }
  };

  return (
    <div className="flex">
      <NavDrawer
        items={monsters ?? []}
        onSelect={(id) => setSelectedMonsterId(id)}
      />
      <main className="mx-auto">
        <p className="text-lg font-semibold">Monster</p>
        {renderMonsterDisplay()}
      </main>
    </div>
  );
}
