interface ToastState {
    open: boolean;
    error: boolean;
    message: string;
}
interface PasswordResetFormProps {
    setOpenToast: (toast: ToastState) => void;
}
export default function PasswordResetForm({ setOpenToast }: PasswordResetFormProps): import("react/jsx-runtime").JSX.Element;
export {};
