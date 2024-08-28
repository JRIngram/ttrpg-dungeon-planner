import { ToastConfig } from "@/types/toast";
import {
  createContext,
  Dispatch,
  useContext,
  useReducer,
  ReactNode,
} from "react";

export const ToastContext = createContext<ToastConfig[]>([]);

const ToastDispatchContext = createContext<Dispatch<Action>>(() => {});

type Action = AddAction | RemoveAction;

type AddAction = {
  type: "add";
  toast: Omit<ToastConfig, "id">;
};

type RemoveAction = {
  type: "remove";
  toast: Pick<ToastConfig, "id">;
};

const initialToasts: ToastConfig[] = [];

const toastReducer = (toasts: ToastConfig[], action: Action) => {
  switch (action.type) {
    case "add":
      return [
        ...toasts,
        {
          ...action.toast,
          id: `${action.toast.message.replaceAll(" ", "-")}-${new Date().getTime()} }`,
        },
      ];
    case "remove":
      return toasts.filter((toast) => toast.id !== action.toast.id);
    default:
      return toasts;
  }
};

export const ToastProvider = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const [toasts, dispatch] = useReducer(toastReducer, initialToasts);

  return (
    <ToastContext.Provider value={toasts}>
      <ToastDispatchContext.Provider value={dispatch}>
        {children}
      </ToastDispatchContext.Provider>
    </ToastContext.Provider>
  );
};

export const useToasts = () => useContext(ToastContext);

export const useToastsDispatch = () => useContext(ToastDispatchContext);
