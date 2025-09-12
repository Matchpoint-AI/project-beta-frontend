import React from 'react';
interface DropdownProps {
    className?: string;
    options: string[];
    currentValue?: string;
    onUpdateContext: (option: string, index: number) => void;
    dynamic?: boolean;
}
declare const Dropdown: React.FC<DropdownProps>;
export default Dropdown;
