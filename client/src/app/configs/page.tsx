"use client";
import { useState } from "react";
import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";
import { Tabs } from "@/components/molecules/Tabs/Tabs";
import { Table } from "@/components/molecules/Table/Table";
import { EncounterMultiplierService } from "@/services/EncounterMultiplierService/EncounterMultiplierService";
import { EncounterRatingService } from "@/services/EncounterRatingService/EncounterRatingService";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/atoms/Text/Text";

type ConfigTabs = "Encounter Multipliers" | "Encounter Ratings";

export default function Configs() {
  const [selectedTab, setSelectedTab] = useState<ConfigTabs>(
    "Encounter Multipliers",
  );
  const tabOptions: ConfigTabs[] = [
    "Encounter Multipliers",
    "Encounter Ratings",
  ];

  const encounterMultiplierService = new EncounterMultiplierService();
  const encounterRatingService = new EncounterRatingService();

  const {
    data: encounterMultipliers,
    isLoading: isLoadingMultipliers,
    isError: errorLoadingMultipliers,
  } = useQuery({
    queryKey: ["encounter-multiplier-configs"],
    queryFn: () => encounterMultiplierService.getList(),
  });

  const {
    data: encounterRatings,
    isLoading: isLoadingRatings,
    isError: errorLoadingRatings,
  } = useQuery({
    queryKey: ["encounter-rating-configs"],
    queryFn: () => encounterRatingService.getList(),
  });

  const multiplierHeaders = [
    { key: "min", label: "Min" } as const,
    { key: "max", label: "Max" } as const,
    { key: "multiplier", label: "Multiplier" } as const,
  ];

  const ratingHeaders = [
    { key: "level", label: "Level" } as const,
    { key: "easy", label: "Easy" } as const,
    { key: "medium", label: "Medium" } as const,
    { key: "hard", label: "Hard" } as const,
    { key: "extreme", label: "Extreme" } as const,
  ];

  return (
    <div className="flex">
      <NavDrawer items={[]} onSelect={() => {}} />
      <main className="mx-auto w-3/6">
        <div className="flex flex-col gap-4">
          <Text text="Configs" textType="header" />
          <Tabs
            options={tabOptions}
            onSelectCallback={(tabIndex) => {
              setSelectedTab(tabOptions[tabIndex]);
            }}
          />
          {selectedTab === "Encounter Multipliers" && (
            <Table
              configs={encounterMultipliers ?? []}
              headers={multiplierHeaders}
              keyField="id"
            />
          )}
          {selectedTab === "Encounter Ratings" && (
            <Table
              configs={encounterRatings ?? []}
              headers={ratingHeaders}
              keyField="level"
            />
          )}
          {isLoadingMultipliers && selectedTab === "Encounter Multipliers" && (
            <p>Loading encounter multipliers...</p>
          )}
          {errorLoadingMultipliers &&
            selectedTab === "Encounter Multipliers" && (
              <p className="text-red-500">
                Error loading encounter multipliers
              </p>
            )}
          {isLoadingRatings && selectedTab === "Encounter Ratings" && (
            <p>Loading encounter ratings...</p>
          )}
          {errorLoadingRatings && selectedTab === "Encounter Ratings" && (
            <p className="text-red-500">Error loading encounter ratings</p>
          )}
        </div>
      </main>
    </div>
  );
}
