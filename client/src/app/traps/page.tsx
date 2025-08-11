"use client";
import { useState } from "react";
import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";
import {
  InputMode,
  MonsterForm,
} from "@/components/organisms/MonsterForm/MonsterForm";
import { TrapDataFetcher } from "@/services/TrapDataFetcher/TrapDataFetcher";
import { useQuery } from "@tanstack/react-query";
import { FieldTextDisplayGroup } from "@/components/molecules/FieldTextDisplayGroup/FieldTextDisplayGroup";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { type Monster as MonsterType } from "@/types/monster";
import { ToastList } from "@/components/organisms/ToastList/ToastList";
import { useToasts, useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";
import { Trap } from "@/types/trap";

export default function Monster() {
  const [selectedTrapId, setSelectedTrapId] = useState<string>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toasts = useToasts();
  const dispatch = useToastsDispatch();

  const dataFetcher = new TrapDataFetcher();

  const {
    data,
    isLoading: isLoadingTraps,
    isError: errorLoadingTraps,
    refetch,
  } = useQuery({
    queryKey: ["trap-list"],
    queryFn: () => {
      return dataFetcher.getTrapList();
    },
  });

  const monsters = data?.map((monster) => ({
    label: monster.name,
    id: monster.id,
  }));

  const getSelectedTrap = (trapList: Trap[], selectedId: string) =>
    trapList?.find((trap) => trap.id === selectedId);

  const renderTrapDisplay = () => {
    if (!selectedTrapId) {
      return (
        <>
          <p>Please select a trap or create a new one below</p>
          {/* <MonsterForm
            inputMode={InputMode.NEW}
            onSubmit={async (monster) => {
              await refetch();
              setSelectedTrapId(monster?.id);
            }}
            onCancel={() => {}}
          /> */}
        </>
      );
    } else {
      const selectedMonster = getSelectedTrap(data ?? [], selectedTrapId);
      return <p>To implement!</p>
      // if (selectedMonster) {
      //   if (isEditing) {
      //     return (
      //       <MonsterForm
      //         inputMode={InputMode.EDIT}
      //         monster={selectedMonster}
      //         onSubmit={async (monster) => {
      //           await refetch();
      //           setIsEditing(false);
      //           setSelectedTrapId(monster?.id);
      //         }}
      //         onCancel={() => setIsEditing(false)}
      //       />
      //     );
      //   }
      //   const monsterFields = Object.entries(selectedMonster).map((e) => {
      //     return {
      //       fieldName: e[0],
      //       fieldValue: `${e[1]}`,
      //     };
      //   });

      //   return (
      //     <div className="flex flex-col gap-4">
      //       <FieldTextDisplayGroup fields={monsterFields} />
      //       {!selectedMonster.isDeletable && (
      //         <p>
      //           This monster is in use in a dungeon and so cannot be deleted.
      //         </p>
      //       )}
      //       <ButtonRow
      //         buttons={[
      //           {
      //             text: "Edit",
      //             onClick: () => setIsEditing(true),
      //             variant: "secondaryOutline",
      //           },
      //           {
      //             text: "Delete",
      //             onClick: async () => {
      //               const { message, httpCode } =
      //                 await dataFetcher.deleteMonster(selectedTrapId);
      //               const serverMessage = message;
      //               if (serverMessage !== undefined) {
      //                 dispatch({
      //                   type: "add",
      //                   toast: {
      //                     type: ToastType.ERROR,
      //                     message: `${serverMessage}; HTTP ${httpCode}`,
      //                   },
      //                 });
      //               } else {
      //                 await refetch();
      //                 setSelectedTrapId(undefined);
      //                 dispatch({
      //                   type: "add",
      //                   toast: {
      //                     type: ToastType.SUCCESS,
      //                     message: "Successfully deleted monster",
      //                   },
      //                 });
      //               }
      //             },
      //             variant: "tertiaryOutline",
      //             disabled: !selectedMonster.isDeletable,
      //           },
      //         ]}
      //       />
      //     </div>
      //   );
      // }
    }
  };

  const defaultNavDrawerLabel = isLoadingTraps
    ? "Loading"
    : errorLoadingTraps
      ? "Error"
      : "+ Create a new trap";

  return (
    <div className="flex">
      <NavDrawer
        items={monsters ?? []}
        onSelect={(id) => {
          setSelectedTrapId(id);
        }}
        defaultItem={{
          label: defaultNavDrawerLabel,
          onDefaultSelected: () => setSelectedTrapId(""),
        }}
      />
      <main className="mx-auto w-3/6">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-lg font-semibold">
              {selectedTrapId
                ? getSelectedTrap(data ?? [], selectedTrapId)?.name
                : "Monster"}
            </p>
            {renderTrapDisplay()}
          </div>
          <ToastList toastList={toasts} />
        </div>
      </main>
    </div>
  );
}
