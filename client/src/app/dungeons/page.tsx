"use client";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { DungeonDataFetcher } from "@/services/DungeonDataFetcher/DungeonDataFetcher";
import { FieldTextDisplayGroup } from "@/components/molecules/FieldTextDisplayGroup/FieldTextDisplayGroup";
import { FormBuilder } from "@/components/organisms/FormBuilder/FormBuilder";
import { InputMode } from "@/components/organisms/FormBuilder/FormBuilder";
import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";
import { ToastList } from "@/components/organisms/ToastList/ToastList";
import { ToastType } from "@/types/toast";
import type { Dungeon as DungeonType } from "@/types/dungeon";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useToasts, useToastsDispatch } from "@/context/ToastContext";

export default function Dungeon() {
    const [selectedDungeonId, setSelectedDungeonId] = useState<string>();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const toasts = useToasts();
    const dispatch = useToastsDispatch();

    const dungeonDataFetcher = new DungeonDataFetcher();

    const {
        data,
        isLoading: isLoadingDungeons,
        isError: errorLoadingDungeons,
        refetch,
    } = useQuery({
        queryKey: ["dungeon-list"],
        queryFn: () => {
            return dungeonDataFetcher.getList();
        },
    });

    const dungeons = data?.map((dungeon) => ({
        label: dungeon.name,
        id: dungeon.id,
    }));

    const getSelectedDungeon = (dungeonList: DungeonType[], selectedId: string) =>
        dungeonList?.find((dungeon) => dungeon.id === selectedId);

    const renderDungeonDisplay = () => {
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
                placeholder: "3",
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
                placeholder: "4",
                pattern: `(\\d){1,}`,
                patternMessage: "Numerical characters",
                initialValue: undefined,
                isRequired: true,
            },
        ]

        if (!selectedDungeonId) {
            return (
                <>
                    <p>Please select a dungeon or create a new one below</p>
                    <DungeonForm
                        dataFetcher={dungeonDataFetcher}
                        inputMode={InputMode.NEW}
                        onCancelCallback={() => { return }}
                        onSubmitCallback={async (dungeon) => {
                            await refetch();
                            setSelectedDungeonId(dungeon?.id);
                        }}
                        fields={formFields}
                    />
                </>
            );
        } else {
            const selectedDungeon = getSelectedDungeon(data ?? [], selectedDungeonId);

            if (selectedDungeon) {
                if (isEditing) {
                    return (
                        <DungeonForm
                            dataFetcher={new DungeonDataFetcher}
                            inputMode={InputMode.EDIT}
                            existingEntity={selectedDungeon}
                            onSubmitCallback={async (dungeon) => {
                                await refetch();
                                setIsEditing(false);
                                setSelectedDungeonId(dungeon?.id);
                            }}
                            onCancelCallback={() => setIsEditing(false)}
                            fields={formFields}
                        />
                    );
                }

                const dungeonFields = Object.entries(selectedDungeon).map((e) => {
                    return {
                        fieldName: e[0],
                        fieldValue: `${e[1]}`,
                    };
                });
                return (
                    <div className="flex flex-col gap-4">
                        <FieldTextDisplayGroup fields={dungeonFields} />
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
                                            await dungeonDataFetcher.deleteSingle(selectedDungeonId);
                                        if (!dungeonDataFetcher.isSuccessfulHTTPCode(httpCode)) {
                                            dispatch({
                                                type: "add",
                                                toast: {
                                                    type: ToastType.WARNING,
                                                    message: `Could not delete dungeon ${selectedDungeon.name}. HTTP ${httpCode}`,
                                                },
                                            });
                                        } else {
                                            await refetch();
                                            setSelectedDungeonId(undefined);
                                            dispatch({
                                                type: "add",
                                                toast: {
                                                    type: ToastType.SUCCESS,
                                                    message: "Successfully deleted dungeon",
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

    const defaultNavDrawerLabel = isLoadingDungeons
        ? "Loading"
        : errorLoadingDungeons
            ? "Error"
            : "+ Create a new dungeon";

    const pageTitle = selectedDungeonId
        ? getSelectedDungeon(data ?? [], selectedDungeonId)?.name
        : "Dungeon"

    return (
        <div className="flex">
            <NavDrawer
                items={dungeons ?? []}
                onSelect={(id) => {
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
                        <p className="text-lg font-semibold">
                            {pageTitle}
                        </p>
                        {renderDungeonDisplay()}
                    </div>
                    <ToastList toastList={toasts} />
                </div>
            </main>
        </div>
    );
}
