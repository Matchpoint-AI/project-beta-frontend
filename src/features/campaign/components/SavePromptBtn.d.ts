import React from 'react';
interface SavePromptBtnProps {
    prompt: string;
    setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
    target: 'content_generation' | 'scrape_website';
    addPrompts: (prompt: string, target: 'content_generation' | 'scrape_website') => void;
}
export default function SavePromptBtn({ prompt, setErrorMsg, target, addPrompts, }: SavePromptBtnProps): import("react/jsx-runtime").JSX.Element;
export {};
