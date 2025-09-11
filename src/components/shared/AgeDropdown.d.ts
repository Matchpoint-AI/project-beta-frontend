import React from 'react';
interface AgeDropdownProps {
    options: string[];
    currentValues?: string[];
    onUpdateContext: (option: string[]) => void;
}
declare const AgeDropdown: React.FC<AgeDropdownProps>;
export default AgeDropdown;
