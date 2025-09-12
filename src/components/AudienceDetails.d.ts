import React from 'react';
interface AudienceEmotionsProps {
    values: string[];
    setValues: React.Dispatch<React.SetStateAction<string[]>>;
    title: string;
    description?: string;
    genre: 'emotion' | 'interests';
}
export default function AudienceDetails(props: AudienceEmotionsProps): import("react/jsx-runtime").JSX.Element;
export {};
