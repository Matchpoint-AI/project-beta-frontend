interface BrandReviewProps {
    toggleEdit: () => void;
    hasBrand: boolean;
    stepHandler?: (step: number) => void;
}
export default function BrandReview({ toggleEdit, hasBrand, stepHandler }: BrandReviewProps): import("react/jsx-runtime").JSX.Element;
export {};
