"use client";
import { NavDrawer } from "@/components/molecules/NavDrawer/NavDrawer";

export default function Configs() {
  return (
    <div className="flex">
      <NavDrawer items={[]} onSelect={() => {}} />
      <main className="mx-auto w-3/6">
        <h1 className="text-lg font-semibold mb-4">Configs</h1>
        <p className="mb-4">
          Configs (Encounter Ratings and Encounter Multipliers) being updated
          via the UI is currently not supported.
        </p>
        <p className="mb-4">
          Instead, updating these are performed by &quot;wizards&quot;.
        </p>
        <p>
          Please see the README and utilise the wizards, located within the
          wizards directory of the codebase.
        </p>
      </main>
    </div>
  );
}
