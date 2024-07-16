"use client";
import { useState } from "react";
import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";
import {
  InputMode,
  MonsterForm,
} from "@/components/organisms/MonsterForm/MonsterForm";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher";
import { useQuery } from "@tanstack/react-query";

export default function Monster() {
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>("");

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

  console.log(monsters);

  return (
    <div className="flex">
      <NavDrawer
        items={monsters ?? []}
        onSelect={(id) => setSelectedMonsterId(id)}
      />
      <main className="mx-auto">
        <MonsterForm inputMode={InputMode.NEW} />
        <p>{selectedMonsterId}</p>
      </main>
    </div>
  );
}
