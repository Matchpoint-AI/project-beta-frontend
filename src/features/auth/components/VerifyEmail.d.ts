interface VerifyEmailProps {
    setOpen: (value: {
        open: boolean;
        error: boolean;
        message: string;
    }) => void;
}
export default function VerifyEmail({ setOpen }: VerifyEmailProps): import("react/jsx-runtime").JSX.Element;
export {};
