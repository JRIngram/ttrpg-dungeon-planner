"use client";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher";
import { useQuery } from "@tanstack/react-query";

export const MonsterForm = () => {
  const submitForm = async () => {
    console.log("submitted");
    const dataFetcher = new MonsterDataFetcher();
    await dataFetcher.addMonster({ name: "vvewvw", xp: 10 });
  };

  const { data, isPending } = useQuery({
    queryKey: ["monster-list"],
    queryFn: async () => {
      const dataFetcher = new MonsterDataFetcher();
      return await dataFetcher.getMonsterList();
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold">Monster</p>
      <form action={submitForm}>
        <div className="flex flex-col gap-2">
          <FormTextInput
            id="monster-name"
            ariaLabel="Monster name"
            formLabelText="Name"
            placeholder="e.g. Goblin"
            isRequired
          />
          <FormTextInput
            id="monster-xp"
            ariaLabel="Monster XP value"
            formLabelText="XP Value"
            placeholder="e.g. 50"
            isRequired
          />
          <ButtonRow
            buttons={[
              {
                text: "Save",
                onClick: async () => {
                  console.log("submit clicked");
                },
                variant: "primaryFilled",
                isSubmit: true,
              },
              {
                text: "Cancel",
                onClick: async () => {
                  console.log("cancel clicked");
                },
                variant: "tertiaryOutline",
              },
            ]}
          />
        </div>
      </form>
      {data?.map((e) => (
        <p key={e.id}>
          ({e.id}){e.name} - {e.xp}
        </p>
      ))}
    </div>
  );
};
