import React from 'react';
interface ChipsEditBlockProps {
    initValues: string[];
    closeEdit: () => void;
    saveValues: React.Dispatch<React.SetStateAction<string[]>>;
    className?: string;
    max: number;
    genre?: 'emotion' | 'interests';
}
export default function ChipsEditBlock({ initValues, saveValues, closeEdit, className, max, genre, }: ChipsEditBlockProps): any;
export {};
