"use client";
import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";
import { ToastList } from "@/components/organisms/ToastList/ToastList";
import { type Dungeon as DungeonType } from "@/types/dungeon";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useToasts, useToastsDispatch } from "@/context/ToastContext";
import { Tabs } from "@/components/molecules/Tabs/Tabs";
import { DungeonTab } from "./tabs/DungeonTab";
import { DungeonDataFetcher } from "@/services/DungeonDataFetcher/DungeonDataFetcher";
import { RoomTab } from "./tabs/RoomTab";

type PageTabs = "Dungeon" | "Rooms";

export default function Dungeon() {
  const [openPageTab, setOpenPageTab] = useState<PageTabs>("Dungeon");
  const [selectedDungeonId, setSelectedDungeonId] = useState<string>();
  const [selectedDungeon, setSelectedDungeon] = useState<
    DungeonType | undefined
  >();
  const toasts = useToasts();
  const TabOptions: PageTabs[] = ["Dungeon", "Rooms"];
  const dungeonDataFetcher = new DungeonDataFetcher();

  const {
    data: dungeons,
    isLoading: isLoadingDungeons,
    isError: errorLoadingDungeons,
    refetch,
  } = useQuery({
    queryKey: ["dungeon-list"],
    queryFn: () => {
      return dungeonDataFetcher.getList();
    },
  });

  const navBarDungeons = dungeons?.map((dungeon) => ({
    label: dungeon.name,
    id: dungeon.id,
  }));

  const defaultNavDrawerLabel = isLoadingDungeons
    ? "Loading"
    : errorLoadingDungeons
      ? "Error"
      : "+ Create a new dungeon";

  const pageTitle = selectedDungeon?.name ?? "Dungeon";

  return (
    <div className="flex">
      <NavDrawer
        items={navBarDungeons ?? []}
        onSelect={(id) => {
          const dungeon = dungeons?.find((dungeon) => dungeon.id === id);
          setSelectedDungeon(dungeon);
          setSelectedDungeonId(id);
        }}
        defaultItem={{
          label: defaultNavDrawerLabel,
          onDefaultSelected: () => setSelectedDungeonId(""),
        }}
      />
      <main className="mx-auto w-3/6">
        <div className="flex flex-col gap-4">
          <div>
            {selectedDungeonId && (
              <Tabs
                options={TabOptions}
                onSelectCallback={(tab) => {
                  setOpenPageTab(TabOptions[tab]);
                }}
              />
            )}
            {/* <p className="text-lg font-semibold">{pageTitle}</p> */}
            {openPageTab === "Dungeon" ? (
              <DungeonTab
                selectedDungeon={selectedDungeon}
                refetchDungeonCallback={() => refetch()}
                setSelectedDungeonCallback={setSelectedDungeonId}
              />
            ) : (
              <>
                <RoomTab selectedDungeon={selectedDungeon} />
              </>
            )}
          </div>
          <ToastList toastList={toasts} />
        </div>
      </main>
    </div>
  );
}
