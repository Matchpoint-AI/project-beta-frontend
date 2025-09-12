interface BrandReviewProps {
    toggleEdit: () => void;
    hasBrand: boolean;
    stepHandler?: (step: number) => void;
}
export default function BrandReview({ toggleEdit, hasBrand, stepHandler }: BrandReviewProps): any;
export {};
