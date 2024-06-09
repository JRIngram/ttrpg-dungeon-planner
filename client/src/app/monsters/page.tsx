import { MonsterForm } from "@/components/organisms/MonsterForm/MonsterForm";

export default async function Monster() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MonsterForm />
    </main>
  );
}
