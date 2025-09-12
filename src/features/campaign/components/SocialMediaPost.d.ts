import React from 'react';
interface Post {
    approved: boolean;
    id: string;
    image_prompt?: string;
    text: string;
    image_url: string[];
    image_index?: number;
    posted: boolean;
    [key: string]: unknown;
}
interface SocialMediaPostProps {
    day: number;
    postIndex: number;
    setOpen: React.Dispatch<React.SetStateAction<number>>;
    content: Post[] | Post;
    id: string;
    week: number;
    postingTime: string;
    brandName: string;
    onApprovalUpdate: (postIndex: number, isApproved: boolean) => void;
    updataImage: (week: number, day: number, post: number, imageIndex: number, imageUrl: string | null, newText: string) => void;
    selectedImages: number[];
    setSelectedImages: React.Dispatch<React.SetStateAction<number[]>>;
}
declare const SocialMediaPost: React.FC<SocialMediaPostProps>;
export default SocialMediaPost;
