import React from 'react';
interface BrandPersonality {
    traits: string[];
    tone: Record<string, string>;
    voice_attributes: string[];
}
interface VisualStyle {
    color_palette: string[];
    style_tags: string[];
    photography_style: string;
    composition_preferences: string[];
}
interface ProductDetails {
    name: string;
    generic_term: string;
    category: string;
    differentiators: string[];
    usage_context: string;
    ingredients: Array<{
        name: string;
        purpose: string;
    }>;
}
interface BrandKnowledge {
    brand_id: string;
    brand_name: string;
    personality: BrandPersonality;
    visual_style: VisualStyle;
    products: ProductDetails[];
    approved_scenes: string[];
    avoid_list: string[];
    guardrails: Record<string, unknown>;
}
interface BrandKnowledgeFormProps {
    handleNext?: () => void;
    handleBack?: () => void;
    onSave?: (data: BrandKnowledge) => void;
    existingData?: BrandKnowledge | null;
}
declare const BrandKnowledgeForm: React.FC<BrandKnowledgeFormProps>;
export default BrandKnowledgeForm;
