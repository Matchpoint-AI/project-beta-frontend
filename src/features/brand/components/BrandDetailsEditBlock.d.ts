import { Chip } from '../../../shared/utils/convertToChips';
interface BrandDetailsEditBlockProps {
    category: 'mission' | 'persona' | 'values' | 'toneAndVoice';
    initValues: Chip[];
    closeEdit: () => void;
}
export default function BrandDetailsEditBlock({ initValues, category, closeEdit, }: BrandDetailsEditBlockProps): import("react/jsx-runtime").JSX.Element;
export {};
