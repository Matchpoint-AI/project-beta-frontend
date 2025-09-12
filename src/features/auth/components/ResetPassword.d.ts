interface ResetPasswordProps {
    setOpen: (value: {
        open: boolean;
        error: boolean;
        message: string;
    }) => void;
}
export default function ResetPassword({ setOpen }: ResetPasswordProps): import("react/jsx-runtime").JSX.Element;
export {};
