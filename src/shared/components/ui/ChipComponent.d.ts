import React from 'react';
interface ChipComponentProps {
    label: string;
    selected: boolean;
    onClose: (index: number) => void;
    onSelect: (index: number) => void;
    index: number;
    className?: string;
}
declare const ChipComponent: React.FC<ChipComponentProps>;
export default ChipComponent;
