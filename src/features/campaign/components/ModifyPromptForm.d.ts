import React from 'react';
interface ModifyPromptFormProps {
    week: number;
    day: number;
    post: number;
    content_id: string;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ModifyPromptForm(props: ModifyPromptFormProps): import("react/jsx-runtime").JSX.Element;
export {};
