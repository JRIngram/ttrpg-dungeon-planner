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
import { EncounterMultiplierConfigForm } from "@/components/organisms/Forms/EncounterMultiplierConfigForm/EncounterMultiplierConfigForm";
import { EncounterRatingConfigForm } from "@/components/organisms/Forms/EncounterRatingConfigForm/EncounterRatingConfigForm";
import { Text } from "@/components/atoms/Text/Text";
import { Tabs } from "@/components/molecules/Tabs/Tabs";

type TabType = "multiplier" | "rating";

export default function Configs() {
  const [selectedMultiplierConfigId, setSelectedMultiplierConfigId] = useState<number>();
  const [selectedRatingConfigId, setSelectedRatingConfigId] = useState<number>();
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

  const getSelectedMultiplierConfig = (configList: EncounterMultiplierConfigRow[], selectedId: number | undefined) =>
    configList?.find((config) => config.id === selectedId);

  const getSelectedRatingConfig = (configList: EncounterRatingConfigRow[], selectedId: number | undefined) =>
    configList?.find((config) => config.id === selectedId);

  const handleTabSelect = (tabIndex: number) => {
    setActiveTab(tabIndex === 0 ? "multiplier" : "rating");
  };

  const handleDeleteMultiplier = async (id: number) => {
    const { httpCode } = await multiplierService.deleteSingle(id.toString());
    if (!multiplierService.isSuccessfulHTTPCode(httpCode)) {
      dispatch({
        type: "add",
        toast: {
          type: ToastType.WARNING,
          message: `Could not delete config. HTTP ${httpCode}`,
        },
      });
    } else {
      await refetchMultipliers();
      setSelectedMultiplierConfigId(undefined);
      dispatch({
        type: "add",
        toast: {
          type: ToastType.SUCCESS,
          message: "Successfully deleted encounter multiplier config",
        },
      });
    }
  };

  const handleDeleteRating = async (id: number) => {
    const { httpCode } = await ratingService.deleteSingle(id.toString());
    if (!ratingService.isSuccessfulHTTPCode(httpCode)) {
      dispatch({
        type: "add",
        toast: {
          type: ToastType.WARNING,
          message: `Could not delete config. HTTP ${httpCode}`,
        },
      });
    } else {
      await refetchRatings();
      setSelectedRatingConfigId(undefined);
      dispatch({
        type: "add",
        toast: {
          type: ToastType.SUCCESS,
          message: "Successfully deleted encounter rating config",
        },
      });
    }
  };

  const renderMultiplierTab = () => {
    if (!selectedMultiplierConfigId) {
      return (
        <EncounterMultiplierConfigForm
          onCancelCallback={() => {
            return;
          }}
          onSubmitCallback={async (config) => {
            await refetchMultipliers();
            setSelectedMultiplierConfigId(config.id);
          }}
        />
      );
    } else {
      const selectedConfig = getSelectedMultiplierConfig(multiplierConfigs ?? [], selectedMultiplierConfigId);

      if (selectedConfig) {
        if (isEditingMultiplier) {
          return (
            <EncounterMultiplierConfigForm
              existingConfig={selectedConfig}
              onSubmitCallback={async (config) => {
                await refetchMultipliers();
                setIsEditingMultiplier(false);
                setSelectedMultiplierConfigId(config.id);
              }}
              onCancelCallback={() => setIsEditingMultiplier(false)}
            />
          );
        }

        return (
          <div className="flex flex-col gap-4">
            <EncounterMultiplierConfigDisplay config={selectedConfig} />
            <ButtonRow
              buttons={[
                {
                  text: "Edit",
                  onClick: () => setIsEditingMultiplier(true),
                  variant: "secondaryOutline",
                },
                {
                  text: "Delete",
                  onClick: async () => {
                    handleDeleteMultiplier(selectedConfig.id);
                  },
                  variant: "tertiaryOutline",
                },
              ]}
            />
          </div>
        );
      }
    }
  };

  const renderRatingTab = () => {
    if (!selectedRatingConfigId) {
      return (
        <EncounterRatingConfigForm
          onCancelCallback={() => {
            return;
          }}
          onSubmitCallback={async (config) => {
            await refetchRatings();
            setSelectedRatingConfigId(config.id);
          }}
        />
      );
    } else {
      const selectedConfig = getSelectedRatingConfig(ratingConfigs ?? [], selectedRatingConfigId);

      if (selectedConfig) {
        if (isEditingRating) {
          return (
            <EncounterRatingConfigForm
              existingConfig={selectedConfig}
              onSubmitCallback={async (config) => {
                await refetchRatings();
                setIsEditingRating(false);
                setSelectedRatingConfigId(config.id);
              }}
              onCancelCallback={() => setIsEditingRating(false)}
            />
          );
        }

        return (
          <div className="flex flex-col gap-4">
            <EncounterRatingConfigDisplay config={selectedConfig} />
            <ButtonRow
              buttons={[
                {
                  text: "Edit",
                  onClick: () => setIsEditingRating(true),
                  variant: "secondaryOutline",
                },
                {
                  text: "Delete",
                  onClick: async () => {
                    handleDeleteRating(selectedConfig.id);
                  },
                  variant: "tertiaryOutline",
                },
              ]}
            />
          </div>
        );
      }
    }
  };

  const defaultMultiplierNavDrawerLabel = isLoadingMultipliers
    ? "Loading"
    : errorLoadingMultipliers
      ? "Error"
      : "+ Create a new multiplier config";

  const defaultRatingNavDrawerLabel = isLoadingRatings
    ? "Loading"
    : errorLoadingRatings
      ? "Error"
      : "+ Create a new rating config";

  return (
    <div className="flex">
      <NavDrawer
        items={activeTab === "multiplier" ? multiplierNavItems : ratingNavItems}
        onSelect={(id) => {
          if (activeTab === "multiplier") {
            setSelectedMultiplierConfigId(parseInt(id));
            setIsEditingMultiplier(false);
          } else {
            setSelectedRatingConfigId(parseInt(id));
            setIsEditingRating(false);
          }
        }}
        defaultItem={{
          label: activeTab === "multiplier" ? defaultMultiplierNavDrawerLabel : defaultRatingNavDrawerLabel,
          onDefaultSelected: () => {
            if (activeTab === "multiplier") {
              setSelectedMultiplierConfigId(undefined);
            } else {
              setSelectedRatingConfigId(undefined);
            }
          },
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

type EncounterMultiplierConfigDisplayProps = {
  config: EncounterMultiplierConfigRow;
};

const EncounterMultiplierConfigDisplay = ({ config }: EncounterMultiplierConfigDisplayProps) => {
  return (
    <>
      <Text text={`Multiplier Config: Min ${config.min}, Max ${config.max || "null"}`} textType="header" />
      <Text
        text={`Multiplier: ${config.multiplier}`}
        textType="default"
      />
    </>
  );
};

type EncounterRatingConfigDisplayProps = {
  config: EncounterRatingConfigRow;
};

const EncounterRatingConfigDisplay = ({ config }: EncounterRatingConfigDisplayProps) => {
  return (
    <>
      <Text text={`Rating Config: Level ${config.level}`} textType="header" />
      <Text
        text={`Easy: ${config.easy}, Medium: ${config.medium}, Hard: ${config.hard}, Extreme: ${config.extreme}`}
        textType="default"
      />
    </>
  );
};
