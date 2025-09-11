import React from 'react';
interface Post {
    id: string;
    image_prompt: string;
    text: string;
    image_url: string[];
    posted: boolean;
    approved: boolean;
}
interface ContentOverlayProps {
    day: number;
    closeOverlay: () => void;
    content: Post[];
    brandName: string;
    id: string;
    week: number;
    setOpen: React.Dispatch<React.SetStateAction<number>>;
    updataImage: (week: number, day: number, post: number, imageIndex: number, newImage: string | null, newText: string) => void;
    approved: boolean;
    onApprovalUpdate: () => void;
}
declare const ContentOverlay: ({ day, closeOverlay, content, brandName, id, week, setOpen, updataImage, approved, onApprovalUpdate, }: ContentOverlayProps) => import("react/jsx-runtime").JSX.Element;
export default ContentOverlay;
