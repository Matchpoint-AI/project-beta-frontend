import React from 'react';
export interface QualityCheck {
  id: string;
  name: string;
  description: string;
  score: number;
  status: 'pass' | 'warning' | 'fail';
  details: string[];
  category: 'brand_compliance' | 'diversity' | 'consistency' | 'completeness' | 'policy';
}
export interface QualityGateResult {
  itemId: string;
  overallScore: number;
  passed: boolean;
  checks: QualityCheck[];
  recommendations: string[];
  blockers: string[];
  timestamp: string;
}
export interface QualityGatePanelProps {
  itemId: string;
  itemType: 'image' | 'caption' | 'prompt';
  content: string;
  metadata?: {
    sceneType?: string;
    sceneSubtype?: string;
    brandId?: string;
    campaignId?: string;
  };
  onRecheck?: (itemId: string) => Promise<QualityGateResult>;
  className?: string;
}
declare const QualityGatePanel: React.FC<QualityGatePanelProps>;
export default QualityGatePanel;
