import React from 'react';
interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}
export declare const Card: React.FC<CardProps>;
export {};
