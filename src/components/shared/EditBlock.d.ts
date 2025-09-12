import React from 'react';
interface EditBlockProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    disabled: boolean;
    className?: string;
}
export default function EditBlock({ onClick, disabled, className }: EditBlockProps): import("react/jsx-runtime").JSX.Element;
export {};
