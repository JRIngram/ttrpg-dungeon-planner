export enum ToastType {
  SUCCESS,
  WARNING,
  ERROR,
}

export type ToastConfig = {
  message: string;
  type: ToastType;
};
