export type ToastType = 'success' | 'fail' | 'warning' | 'info';

export interface Toast {
  type: ToastType;
  message: string;
  handleDismiss?: () => void;
}