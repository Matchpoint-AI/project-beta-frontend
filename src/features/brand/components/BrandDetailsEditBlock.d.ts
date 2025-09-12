import { Chip } from '../../../helpers/convertToChips';
interface BrandDetailsEditBlockProps {
    category: 'mission' | 'persona' | 'values' | 'toneAndVoice';
    initValues: Chip[];
    closeEdit: () => void;
}
export default function BrandDetailsEditBlock({ initValues, category, closeEdit, }: BrandDetailsEditBlockProps): any;
export {};
