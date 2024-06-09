"use client";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";
import { MonsterDataFetcher } from "@/services/MonsterDataFetcher";
import { useQuery } from "@tanstack/react-query";

export const MonsterForm = () => {
  const submitForm = async (formData: FormData) => {
    try {
      const monsterName = formData.get("monster-name")?.toString();
      const monsterXpString = formData.get("monster-xp")?.toString();
      if (monsterName && monsterXpString) {
        try {
          const dataFetcher = new MonsterDataFetcher();
          const monsterXp = parseInt(monsterXpString);
          await dataFetcher.addMonster({ name: monsterName, xp: monsterXp });
        } catch (err) {
          throw new Error("Error adding monster");
        }
      } else {
        throw new Error("Invalid form values");
      }
    } catch (err) {
      console.log("Error submitting form", err);
    }
  };

  const { data } = useQuery({
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
            formInputName="monster-name"
            ariaLabel="Monster name"
            formLabelText="Name"
            placeholder="e.g. Goblin"
            isRequired
          />
          <FormTextInput
            id="monster-xp"
            formInputName="monster-xp"
            ariaLabel="Monster XP value"
            formLabelText="XP Value"
            placeholder="e.g. 50"
            isRequired
          />
          <ButtonRow
            buttons={[
              {
                text: "Save",
                onClick: async () => {},
                variant: "primaryFilled",
                isSubmit: true,
              },
              {
                text: "Cancel",
                onClick: async () => {},
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
