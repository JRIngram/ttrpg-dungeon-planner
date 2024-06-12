import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";
import { MonsterForm } from "@/components/organisms/MonsterForm/MonsterForm";

export default async function Monster() {
  return (
    <div className="flex">
      <NavDrawer
        items={[
          {
            label: "Item One",
            id: "1",
          },
          {
            label: "Item Two",
            id: "2",
          },
        ]}
        onSelect={() => {}}
      />
      <main className="mx-auto">
        <MonsterForm />
      </main>
    </div>
  );
}
