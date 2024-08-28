export enum ToastType {
  SUCCESS,
  WARNING,
  ERROR,
}

export interface ToastConfig {
  id: string;
  message: string;
  type: ToastType;
}
