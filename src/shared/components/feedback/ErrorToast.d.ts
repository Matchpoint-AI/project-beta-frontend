import React from 'react';
interface ErrorToastProps {
    open: boolean;
    onClose: () => void;
    message: string | React.JSX.Element;
    success?: boolean;
    title?: string;
    buttonText?: string | null;
    onButtonClick?: () => void;
}
export default function ErrorToast({ open, onClose, message, success, title, buttonText, onButtonClick, }: ErrorToastProps): any;
export {};
