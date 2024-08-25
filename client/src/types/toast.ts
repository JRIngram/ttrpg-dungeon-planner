export enum ToastType {
  SUCCESS,
  WARNING,
  ERROR,
}

export interface ToastConfig {
  message: string;
  type: ToastType;
}
