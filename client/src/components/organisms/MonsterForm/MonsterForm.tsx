import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { FormTextInput } from "@/components/molecules/FormTextInput/FormTextInput";

export const MonsterForm = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold">Monster</p>
      <form action={() => console.log("submission!")}>
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
                onClick: () => console.log("submit clicked"),
                variant: "primaryFilled",
                isSubmit: true,
              },
              {
                text: "Cancel",
                onClick: () => console.log("cancel clicked"),
                variant: "tertiaryOutline",
              },
            ]}
          />
        </div>
      </form>
    </div>
  );
};
