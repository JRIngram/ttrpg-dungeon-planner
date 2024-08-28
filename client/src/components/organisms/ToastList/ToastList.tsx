import { Toast, ToastProps } from "@/components/molecules/Toast/Toast";
import { useToastsDispatch } from "@/context/ToastContext";

type Props = {
  toastList: Omit<ToastProps, "onClose">[];
};

export const ToastList = ({ toastList }: Props) => {
  const dispatch = useToastsDispatch();

  return (
    <>
      {toastList.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => {
            dispatch({
              type: "remove",
              toast: {
                id: toast.id,
              },
            });
          }}
        />
      ))}
    </>
  );
};
