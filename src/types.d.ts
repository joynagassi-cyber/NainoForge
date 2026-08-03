export type ToastVariant = 'success' | 'error' | 'info' | 'warning';
export interface Toast {
    id: string;
    variant: ToastVariant;
    title: string;
    description?: string;
}
