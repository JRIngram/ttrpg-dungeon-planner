"use client";
import { Toast } from "@/components/molecules/Toast/Toast";
import { useState } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Hello world {isVisible}!</p>
      <p>{isVisible}</p>
      <button onClick={() => setIsVisible(!isVisible)}>Set visi</button>
      {isVisible && (
        <div className="animate-toastFadeIn w-6/12">
          <Toast message="Oi ello there" />
        </div>
      )}
    </main>
  );
}
