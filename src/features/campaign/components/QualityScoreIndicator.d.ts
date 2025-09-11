import React from 'react';
interface QualityMetric {
    name: string;
    score: number;
    weight: number;
    description: string;
    suggestions?: string[];
}
interface QualityScoreIndicatorProps {
    content: string;
    contentType?: 'caption' | 'prompt' | 'description';
    brandContext?: {
        brandId?: string;
        campaignId?: string;
        tone?: string;
        keywords?: string[];
    };
    onScoreChange?: (score: number, metrics: QualityMetric[]) => void;
    minHeight?: number;
    showDetails?: boolean;
    position?: 'inline' | 'floating';
}
export declare const QualityScoreIndicator: React.FC<QualityScoreIndicatorProps>;
export default QualityScoreIndicator;
