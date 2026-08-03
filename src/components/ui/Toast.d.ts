import { type Toast } from '../../types';
interface ToastProps {
    toast: Toast;
    onDismiss: () => void;
}
export declare function Toast({ toast, onDismiss }: ToastProps): import("react").JSX.Element;
export {};
