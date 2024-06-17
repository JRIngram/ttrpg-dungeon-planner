"use client";
import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";
import { MonsterForm } from "@/components/organisms/MonsterForm/MonsterForm";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher";
import { useQuery } from "@tanstack/react-query";

export default function Monster() {
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

  return (
    <div className="flex">
      <NavDrawer items={monsters ?? []} onSelect={() => {}} />
      <main className="mx-auto">
        <MonsterForm />
      </main>
    </div>
  );
}
