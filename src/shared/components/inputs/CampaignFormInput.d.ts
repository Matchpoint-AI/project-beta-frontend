import React from 'react';
interface CampaignFormInputProps {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    error: boolean | null;
    setError: React.Dispatch<React.SetStateAction<boolean | null>>;
}
export default function CampaignFormInput(props: CampaignFormInputProps): import("react/jsx-runtime").JSX.Element;
export {};
