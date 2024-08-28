import { useToastsDispatch } from "@/context/ToastContext";
import { type ToastConfig, ToastType } from "@/types/toast";
import { useContext, useEffect } from "react";

export interface ToastProps extends ToastConfig {
  onClose: () => void;
}

const TOAST_TIMEOUT = 5000;

export const Toast = ({ message, type, id, onClose }: ToastProps) => {
  const dispatch = useToastsDispatch();
  const getBackgroundColor = (type: ToastType): string => {
    switch (type) {
      case ToastType.SUCCESS:
        return "bg-success";
      case ToastType.WARNING:
        return "bg-warning";
      case ToastType.ERROR:
        return "bg-error";
      default:
        return "bg-white";
    }
  };

  useEffect(() => {
    // Remove toast from context after a period of time
    setTimeout(() => {
      dispatch({
        type: "remove",
        toast: {
          id,
        },
      });
    }, TOAST_TIMEOUT);
  }, [dispatch, id]);

  return (
    <div
      className={`animate-toastFadeIn p-4 rounded-md ${getBackgroundColor(type)} flex flex-row gap-4 justify-between shadow-2xl`}
    >
      <p className={"text-white"}>
        {ToastType[type]}: {message}
      </p>
      <button className="text-white" onClick={onClose}>
        Close
      </button>
    </div>
  );
};
