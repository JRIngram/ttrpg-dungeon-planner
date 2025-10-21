"use client";
import { useState } from "react";
import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";
import { InputMode } from "@/components/organisms/FormBuilder/FormBuilder";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher/MonsterDataFetcher";
import { useQuery } from "@tanstack/react-query";
import { FieldTextDisplayGroup } from "@/components/molecules/FieldTextDisplayGroup/FieldTextDisplayGroup";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { type Dungeon as DungeonType } from "@/types/dungeon";
import { ToastList } from "@/components/organisms/ToastList/ToastList";
import { useToasts, useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";
import { FormBuilder } from "@/components/organisms/FormBuilder/FormBuilder";
import { DungeonDataFetcher } from "@/services/DungeonDataFetcher/DungeonDataFetcher";

export default function Dungeon() {
    const [selectedMonsterId, setSelectedMonsterId] = useState<string>();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const toasts = useToasts();
    const dispatch = useToastsDispatch();

    const dungeonDataFetcher = new DungeonDataFetcher();

    const {
        data,
        isLoading: isLoadingMonsters,
        isError: errorLoadingMonsters,
        refetch,
    } = useQuery({
        queryKey: ["monster-list"],
        queryFn: () => {
            return dungeonDataFetcher.getList();
        },
    });

    const monsters = data?.map((monster) => ({
        label: monster.name,
        id: monster.id,
    }));

    const getSelectedMonster = (monsterList: DungeonType[], selectedId: string) =>
        monsterList?.find((monster) => monster.id === selectedId);

    const renderMonsterDisplay = () => {
        const DungeonForm = FormBuilder<DungeonType>
        const formFields = [
            {
                id: "dungeon-name",
                formInputName: "name",
                ariaLabel: "Dungeon name",
                formLabelText: "Name",
                placeholder: "e.g. The Lost Ruins",
                pattern: `(\\w|\\s){1,}`,
                patternMessage: "Alphanumeric characters",
                initialValue: undefined,
                isRequired: true,
            },
            {
                id: "dungeon-summary",
                formInputName: "summary",
                ariaLabel: "Dungeon summary",
                formLabelText: "Summary",
                placeholder: "e.g. Shadowy ruins of an old Dwarvern mining outpost",
                pattern: `(\\w|\\s){1,}`,
                patternMessage: "Alphanumeric characters",
                initialValue: undefined,
                isRequired: true,
            },
            {
                id: "dungeon-level-min",
                formInputName: "levelMin",
                ariaLabel: "Dungeon Minimum Level",
                formLabelText: "Minimum Level",
                placeholder: "1",
                pattern: `(\\d){1,}`,
                patternMessage: "Numerical characters",
                initialValue: undefined,
                isRequired: true,
            },
            {
                id: "dungeon-level-max",
                formInputName: "levelMax",
                ariaLabel: "Dungeon Maximum Level",
                formLabelText: "Maximum Level",
                placeholder: "1",
                pattern: `(\\d){1,}`,
                patternMessage: "Numerical characters",
                initialValue: undefined,
                isRequired: true,
            },
            {
                id: "dungeon-player-count",
                formInputName: "playerCount",
                ariaLabel: "Dungeon Player Count",
                formLabelText: "Intended Player Count",
                placeholder: "1",
                pattern: `(\\d){1,}`,
                patternMessage: "Numerical characters",
                initialValue: undefined,
                isRequired: true,
            },
        ]

        if (!selectedMonsterId) {
            return (
                <>
                    <p>Please select a monster or create a new one below</p>
                    <DungeonForm
                        dataFetcher={dungeonDataFetcher}
                        inputMode={InputMode.NEW}
                        onCancelCallback={() => { return }}
                        onSubmitCallback={async (monster) => {
                            await refetch();
                            setSelectedMonsterId(monster?.id);
                        }}
                        fields={formFields}
                    />
                </>
            );
        } else {
            const selectedMonster = getSelectedMonster(data ?? [], selectedMonsterId);

            if (selectedMonster) {
                if (isEditing) {
                    return (
                        <DungeonForm
                            dataFetcher={new DungeonDataFetcher}
                            inputMode={InputMode.EDIT}
                            existingEntity={selectedMonster}
                            onSubmitCallback={async (monster) => {
                                await refetch();
                                setIsEditing(false);
                                setSelectedMonsterId(monster?.id);
                            }}
                            onCancelCallback={() => setIsEditing(false)}
                            fields={formFields}
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
                                            await dungeonDataFetcher.deleteSingle(selectedMonsterId);
                                        if (!dungeonDataFetcher.isSuccessfulHTTPCode(httpCode)) {
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
                                    // Dungeons will always be deletable as they're the root data type.
                                    disabled: false,
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

    const pageTitle = selectedMonsterId
        ? getSelectedMonster(data ?? [], selectedMonsterId)?.name
        : "Dungeon"

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
                        <p className="text-lg font-semibold">
                            {pageTitle}
                        </p>
                        {renderMonsterDisplay()}
                    </div>
                    <ToastList toastList={toasts} />
                </div>
            </main>
        </div>
    );
}
