"use client";
import { useToasts, useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";
// import { ToastConfig, ToastType } from "@/components/molecules/Toast/Toast";
import { useState } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const dispatch = useToastsDispatch();
  const toasts = useToasts();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Hello world {isVisible}!</p>
      <p>{isVisible}</p>
      <button
        onClick={() => {
          dispatch({
            type: "add",
            toast: {
              type: ToastType.SUCCESS,
              message: "Hi there",
            },
          });
        }}
      >
        Make some toast!
      </button>
      {toasts.map((t) => {
        return (
          <p key={t.message}>
            Yummy toast {t.type} {t.message}
          </p>
        );
      })}
    </main>
  );
}
