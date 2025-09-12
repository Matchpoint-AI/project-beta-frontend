import React from 'react';
interface DropdownProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
    options: string[];
    currentValue?: string;
    onUpdateContext: (option: string, index: number) => void;
}
declare const Dropdown: React.FC<DropdownProps>;
export default Dropdown;
