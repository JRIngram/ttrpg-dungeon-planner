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
import { type Monster as MonsterType } from "@/types/monster";
import { type ServerError } from "@/types/ServerError";

export default function Monster() {
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputFeedbackMessage, setInputFeedbackMessage] = useState<string>("");

  const dataFetcher = new MonsterDataFetcher();

  const {
    data,
    isLoading: isLoadingMonsters,
    isError: errorLoadingMonsters,
    refetch,
  } = useQuery({
    queryKey: ["monster-list"],
    queryFn: () => {
      return dataFetcher.getMonsterList();
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
          <p>Please select a monster or create a new one below</p>
          <MonsterForm
            inputMode={InputMode.NEW}
            onSubmit={async (message, monster) => {
              await refetch();
              setInputFeedbackMessage(message);
              setSelectedMonsterId(monster?.id);
            }}
            onCancel={() => {}}
          />
        </>
      );
    } else {
      const selectedMonster = getSelectedMonster(data ?? [], selectedMonsterId);

      if (selectedMonster) {
        if (isEditing) {
          return (
            <MonsterForm
              inputMode={InputMode.EDIT}
              monster={selectedMonster}
              onSubmit={async (message, monster) => {
                await refetch();
                setIsEditing(false);
                setInputFeedbackMessage(message);
                setSelectedMonsterId(monster?.id);
              }}
              onCancel={() => setIsEditing(false)}
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
                    const response =
                      await dataFetcher.deleteMonster(selectedMonsterId);
                    const serverMessage = (response as ServerError).message;
                    console.log(serverMessage);
                    if (serverMessage !== undefined) {
                      console.log("in error state");
                      setInputFeedbackMessage(serverMessage);
                    } else {
                      await refetch();
                      setSelectedMonsterId(undefined);
                      setInputFeedbackMessage("Successfully deleted monster");
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
          setInputFeedbackMessage("");
        }}
        defaultItem={{
          label: defaultNavDrawerLabel,
          onDefaultSelected: () => setSelectedMonsterId(""),
        }}
      />
      <main className="mx-auto w-3/6">
        <p className="text-lg font-semibold">
          {selectedMonsterId
            ? getSelectedMonster(data ?? [], selectedMonsterId)?.name
            : "Monster"}
        </p>
        {renderMonsterDisplay()}
        {inputFeedbackMessage ?? <p>{inputFeedbackMessage}</p>}
      </main>
    </div>
  );
}
