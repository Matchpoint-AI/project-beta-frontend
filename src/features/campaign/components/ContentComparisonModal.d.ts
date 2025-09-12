import React from 'react';
interface ContentVersion {
    id: string;
    content: string;
    timestamp: string;
    author: string;
    type: 'original' | 'ai_generated' | 'human_edited' | 'ai_revised';
    metadata?: {
        prompt?: string;
        model?: string;
        feedback?: string;
        qualityScore?: number;
    };
}
interface ContentComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemId: string;
    itemType: 'image' | 'caption' | 'prompt';
    versions: ContentVersion[];
    onSave: (itemId: string, content: string, notes?: string) => Promise<void>;
    onRevert: (itemId: string, versionId: string) => Promise<void>;
    title?: string;
}
declare const ContentComparisonModal: React.FC<ContentComparisonModalProps>;
export default ContentComparisonModal;
