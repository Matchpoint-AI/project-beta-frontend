import React from 'react';
interface ContentPreviewPanelProps {
  content: {
    text: string;
    imageUrl?: string | string[];
    hashtags?: string[];
    mentions?: string[];
    emojis?: string[];
  };
  platform?: 'instagram' | 'facebook' | 'twitter' | 'tiktok' | 'linkedin' | 'pinterest';
  brandName?: string;
  profileImage?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  onEdit?: () => void;
  qualityScore?: number;
  engagementPrediction?: {
    likes: number;
    shares: number;
    comments: number;
  };
}
declare const ContentPreviewPanel: React.FC<ContentPreviewPanelProps>;
export default ContentPreviewPanel;
