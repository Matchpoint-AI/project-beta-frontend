import React from 'react';
export interface ContentItem {
    id: string;
    type: 'image' | 'caption' | 'prompt';
    content: string;
    originalContent?: string;
    status: 'pending' | 'approved' | 'rejected' | 'edited';
    qualityScore?: number;
    feedback?: string;
    metadata?: {
        sceneType?: string;
        sceneSubtype?: string;
        brandCompliance?: number;
        diversityScore?: number;
    };
}
export interface HITLReviewPanelProps {
    items: ContentItem[];
    onApprove: (itemId: string) => Promise<void>;
    onReject: (itemId: string, feedback?: string) => Promise<void>;
    onEdit: (itemId: string, newContent: string) => Promise<void>;
    onRegenerate: (itemId: string, targetedChanges?: string[]) => Promise<void>;
    onClose: () => void;
    isOpen: boolean;
    campaignId?: string;
}
declare const HITLReviewPanel: React.FC<HITLReviewPanelProps>;
export default HITLReviewPanel;
