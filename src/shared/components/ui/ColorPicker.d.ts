import { BusinessInfo } from '../../context/BrandContext';
interface ColorPickerProps {
  selectedColors: string[];
  selectColor: (updater: (colors: string[]) => string[]) => void;
  saveColor: (updater: (businessInfo: BusinessInfo) => BusinessInfo) => void;
  className?: string;
  conseilPicker: (visible: boolean) => void;
}
export default function ColorPicker({
  selectedColors,
  selectColor,
  saveColor,
  className,
  conseilPicker,
}: ColorPickerProps): import('react/jsx-runtime').JSX.Element;
export {};
