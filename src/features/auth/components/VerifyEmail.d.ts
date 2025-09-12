interface VerifyEmailProps {
    setOpen: (value: {
        open: boolean;
        error: boolean;
        message: string;
    }) => void;
}
export default function VerifyEmail({ setOpen }: VerifyEmailProps): any;
export {};
