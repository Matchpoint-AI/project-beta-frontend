import React from 'react';
interface PerformanceMetrics {
    clicks: number;
    impressions: number;
    ctr: number;
    engagement: number;
    conversions: number;
    cost: number;
    confidenceLevel: number;
}
interface ABTestVariant {
    id: string;
    name: string;
    type: 'image' | 'caption' | 'complete_post';
    content: {
        text?: string;
        image_url?: string;
        image_prompt?: string;
    };
    status: 'draft' | 'running' | 'paused' | 'completed' | 'winner';
    trafficAllocation: number;
    performance?: PerformanceMetrics;
    created_at: string;
    updated_at: string;
    author: string;
    notes?: string;
}
interface ABTestConfig {
    id: string;
    name: string;
    description: string;
    status: 'draft' | 'running' | 'paused' | 'completed';
    startDate: string;
    endDate?: string;
    minSampleSize: number;
    significanceThreshold: number;
    primaryMetric: 'ctr' | 'engagement' | 'conversions';
    variants: ABTestVariant[];
}
interface ABTestVariantComparisonProps {
    isOpen: boolean;
    onClose: () => void;
    testConfig: ABTestConfig;
    onSaveVariant: (variantId: string, content: ABTestVariant['content'], notes?: string) => Promise<void>;
    onUpdateTrafficAllocation: (allocations: {
        [variantId: string]: number;
    }) => Promise<void>;
    onStartTest: () => Promise<void>;
    onPauseTest: () => Promise<void>;
    onDeclareWinner: (variantId: string) => Promise<void>;
    onCreateVariant: (variant: Partial<ABTestVariant>) => Promise<void>;
    title?: string;
}
declare const ABTestVariantComparison: React.FC<ABTestVariantComparisonProps>;
export default ABTestVariantComparison;
