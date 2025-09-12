import React from 'react';
import { BusinessInfo } from '../../../features/brand/context/BrandContext';
interface ColorPickerProps {
    selectedColors: string[];
    selectColor: React.Dispatch<React.SetStateAction<string[]>>;
    saveColor: React.Dispatch<React.SetStateAction<BusinessInfo>>;
    className?: string;
    conseilPicker: (visible: boolean) => void;
}
export default function ColorPicker({ selectedColors, selectColor, saveColor, className, conseilPicker, }: ColorPickerProps): any;
export {};
