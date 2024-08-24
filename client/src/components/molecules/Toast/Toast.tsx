export enum ToastType {
  SUCCESS,
  WARNING,
  ERROR,
}

type Props = {
  message: string;
  type: ToastType;
};

export const Toast = ({ message, type }: Props) => {
  const getBackgroundColor = (type: ToastType) => {
    switch (type) {
      case ToastType.SUCCESS:
        return "bg-success";
      case ToastType.WARNING:
        return "bg-warning";
      case ToastType.ERROR:
        return "bg-error";
      default:
        console.log("hit the default");
        return "bg-white";
    }
  };

  return (
    <div
      className={`animate-toastFadeIn min-h-8 w-6/12 p-4 rounded-md ${getBackgroundColor(type)} flex flex-row gap-4 justify-between shadow-2xl`}
    >
      <p className={"text-white"}>{message}</p>
      <button className="text-white">Close</button>
    </div>
  );
};
