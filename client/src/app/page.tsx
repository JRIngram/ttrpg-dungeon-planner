"use client";
import { Toast } from "@/components/molecules/Toast/Toast";
import { useToasts, useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";

export default function Home() {
  const dispatch = useToastsDispatch();
  const toasts = useToasts();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Hello world!</p>
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
      {toasts.map(({ message, type }) => {
        return (
          <>
            <Toast message={message} type={type} />
          </>
        );
      })}
    </main>
  );
}
