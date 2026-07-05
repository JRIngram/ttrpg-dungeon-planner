"use client";
import { useState } from "react";
import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";
import { EncounterMultiplierService } from "@/services/EncounterMultiplierService/EncounterMultiplierService";
import { EncounterRatingService } from "@/services/EncounterRatingService/EncounterRatingService";
import { useQuery } from "@tanstack/react-query";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { type EncounterMultiplierConfigRow, type EncounterRatingConfigRow } from "@/types/configs";
import { ToastList } from "@/components/organisms/ToastList/ToastList";
import { useToasts, useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";
import { BulkEncounterMultiplierConfigForm } from "@/components/organisms/Forms/EncounterMultiplierConfigForm/BulkEncounterMultiplierConfigForm";
import { BulkEncounterRatingConfigForm } from "@/components/organisms/Forms/EncounterRatingConfigForm/BulkEncounterRatingConfigForm";
import { Text } from "@/components/atoms/Text/Text";
import { Tabs } from "@/components/molecules/Tabs/Tabs";

type TabType = "multiplier" | "rating";

export default function Configs() {
  const [isEditingMultiplier, setIsEditingMultiplier] = useState<boolean>(false);
  const [isEditingRating, setIsEditingRating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>("multiplier");
  const toasts = useToasts();
  const dispatch = useToastsDispatch();

  const multiplierService = new EncounterMultiplierService();
  const ratingService = new EncounterRatingService();

  const {
    data: multiplierConfigs,
    isLoading: isLoadingMultipliers,
    isError: errorLoadingMultipliers,
    refetch: refetchMultipliers,
  } = useQuery({
    queryKey: ["multiplier-config-list"],
    queryFn: () => {
      return multiplierService.getList();
    },
  });

  const {
    data: ratingConfigs,
    isLoading: isLoadingRatings,
    isError: errorLoadingRatings,
    refetch: refetchRatings,
  } = useQuery({
    queryKey: ["rating-config-list"],
    queryFn: () => {
      return ratingService.getList();
    },
  });

  const multiplierNavItems = multiplierConfigs?.map((config) => ({
    label: `Min: ${config.min}, Max: ${config.max || "null"}, Multiplier: ${config.multiplier}`,
    id: `${config.id}`,
  })) ?? [];

  const ratingNavItems = ratingConfigs?.map((config) => ({
    label: `Level: ${config.level}, Easy: ${config.easy}, Medium: ${config.medium}, Hard: ${config.hard}, Extreme: ${config.extreme}`,
    id: `${config.id}`,
  })) ?? [];

  const handleTabSelect = (tabIndex: number) => {
    setActiveTab(tabIndex === 0 ? "multiplier" : "rating");
  };

  const renderMultiplierTab = () => {
    if (isLoadingMultipliers) {
      return <p>Loading...</p>;
    }

    if (errorLoadingMultipliers) {
      return <p>Error loading multiplier configs</p>;
    }

    if (!multiplierConfigs || multiplierConfigs.length === 0) {
      return <p>No multiplier configs found</p>;
    }

    if (isEditingMultiplier) {
      return (
        <BulkEncounterMultiplierConfigForm
          configs={multiplierConfigs}
          onSubmitCallback={async () => {
            await refetchMultipliers();
            setIsEditingMultiplier(false);
          }}
          onCancelCallback={() => setIsEditingMultiplier(false)}
        />
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <EncounterMultiplierConfigTable configs={multiplierConfigs} />
        <ButtonRow
          buttons={[
            {
              text: "Edit All",
              onClick: () => setIsEditingMultiplier(true),
              variant: "secondaryOutline",
            },
          ]}
        />
      </div>
    );
  };

  const renderRatingTab = () => {
    if (isLoadingRatings) {
      return <p>Loading...</p>;
    }

    if (errorLoadingRatings) {
      return <p>Error loading rating configs</p>;
    }

    if (!ratingConfigs || ratingConfigs.length === 0) {
      return <p>No rating configs found</p>;
    }

    if (isEditingRating) {
      return (
        <BulkEncounterRatingConfigForm
          configs={ratingConfigs}
          onSubmitCallback={async () => {
            await refetchRatings();
            setIsEditingRating(false);
          }}
          onCancelCallback={() => setIsEditingRating(false)}
        />
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <EncounterRatingConfigTable configs={ratingConfigs} />
        <ButtonRow
          buttons={[
            {
              text: "Edit All",
              onClick: () => setIsEditingRating(true),
              variant: "secondaryOutline",
            },
          ]}
        />
      </div>
    );
  };

  return (
    <div className="flex">
      <NavDrawer
        items={activeTab === "multiplier" ? multiplierNavItems : ratingNavItems}
        onSelect={() => {}}
        defaultItem={{
          label: "View Configs",
          onDefaultSelected: () => {},
        }}
      />
      <main className="mx-auto w-3/6">
        <div className="flex flex-col gap-4">
          <Text text="Configs" textType="header" />
          <Tabs
            options={["Encounter Multiplier Configs", "Encounter Rating Configs"]}
            onSelectCallback={handleTabSelect}
          />
          <div>
            {activeTab === "multiplier" && renderMultiplierTab()}
            {activeTab === "rating" && renderRatingTab()}
          </div>
          <ToastList toastList={toasts} />
        </div>
      </main>
    </div>
  );
}

type EncounterMultiplierConfigTableProps = {
  configs: EncounterMultiplierConfigRow[];
};

const EncounterMultiplierConfigTable = ({ configs }: EncounterMultiplierConfigTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Text text="Encounter Multiplier Configurations" textType="subheader" />
      <table className="min-w-full border mt-2">
        <thead>
          <tr className="bg-primary-50">
            <th className="p-2 border-b text-left">Min Monsters</th>
            <th className="p-2 border-b text-left">Max Monsters</th>
            <th className="p-2 border-b text-left">Multiplier</th>
          </tr>
        </thead>
        <tbody>
          {configs.map((config) => (
            <tr key={config.id} className="border-b">
              <td className="p-2 border-r">{config.min}</td>
              <td className="p-2 border-r">{config.max || "null"}</td>
              <td className="p-2">{config.multiplier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

type EncounterRatingConfigTableProps = {
  configs: EncounterRatingConfigRow[];
};

const EncounterRatingConfigTable = ({ configs }: EncounterRatingConfigTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Text text="Encounter Rating Configurations" textType="subheader" />
      <table className="min-w-full border mt-2">
        <thead>
          <tr className="bg-primary-50">
            <th className="p-2 border-b text-left">Level</th>
            <th className="p-2 border-b text-left">Easy</th>
            <th className="p-2 border-b text-left">Medium</th>
            <th className="p-2 border-b text-left">Hard</th>
            <th className="p-2 border-b text-left">Extreme</th>
          </tr>
        </thead>
        <tbody>
          {configs.map((config) => (
            <tr key={config.id} className="border-b">
              <td className="p-2 border-r">{config.level}</td>
              <td className="p-2 border-r">{config.easy}</td>
              <td className="p-2 border-r">{config.medium}</td>
              <td className="p-2 border-r">{config.hard}</td>
              <td className="p-2">{config.extreme}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
