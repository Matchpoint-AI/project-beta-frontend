import React from 'react';
interface CampaignBriefBlockProps {
    title: string;
    description: string;
    children: React.ReactNode;
    onClick?: () => void;
    edit?: boolean;
}
export default function DetailsBlock({ title, description, children, onClick: _onClick, edit, }: CampaignBriefBlockProps): import("react/jsx-runtime").JSX.Element;
export {};
