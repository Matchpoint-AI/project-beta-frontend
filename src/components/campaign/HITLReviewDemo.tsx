import React, { useState, useCallback } from 'react';
import { Button, Box, Typography, Card, CardContent, Grid } from '@mui/material';
import HITLReviewPanel, { ContentItem } from './HITLReviewPanel';
import QualityGatePanel from './QualityGatePanel';
import ContentComparisonModal from './ContentComparisonModal';

/**
 * Demo component showcasing the HITL Review UI components
 * This demonstrates how to integrate all the review components together
 */
const HITLReviewDemo: React.FC = () => {
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  
  // Mock data for demonstration
  const mockContentItems: ContentItem[] = [
    {
      id: 'item-1',
      type: 'caption',
      content: 'Discover the perfect blend of style and comfort with our new collection. Elevate your wardrobe today! #Fashion #Style #NewCollection',
      originalContent: 'Check out our new collection of stylish and comfortable clothes.',
      status: 'pending',
      qualityScore: 0.87,
      metadata: {
        sceneType: 'product',
        sceneSubtype: 'lifestyle',
        brandCompliance: 0.92,
        diversityScore: 0.78
      }
    },
    {
      id: 'item-2',
      type: 'image',
      content: 'A modern, minimalist photo of a diverse group of people wearing our latest fashion collection, shot in natural lighting with a clean white background',
      status: 'approved',
      qualityScore: 0.94,
      metadata: {
        sceneType: 'human',
        sceneSubtype: 'group',
        brandCompliance: 0.96,
        diversityScore: 0.89
      }
    },
    {
      id: 'item-3',
      type: 'prompt',
      content: 'Create an Instagram-style image featuring our premium skincare products arranged aesthetically with natural elements like flowers and stones',
      status: 'rejected',
      qualityScore: 0.71,
      feedback: 'Needs more brand-specific elements and clearer product focus',
      metadata: {
        sceneType: 'product',
        sceneSubtype: 'flatlay',
        brandCompliance: 0.65,
        diversityScore: 0.82
      }
    }
  ];

  const mockVersions = [
    {
      id: 'v1',
      content: 'Discover the perfect blend of style and comfort with our new collection. Elevate your wardrobe today! #Fashion #Style #NewCollection',
      timestamp: new Date().toISOString(),
      author: 'AI Assistant',
      type: 'ai_generated' as const,
      metadata: {
        model: 'gpt-4',
        qualityScore: 0.87,
        prompt: 'Generate an engaging Instagram caption for a fashion collection launch'
      }
    },
    {
      id: 'v2', 
      content: 'Check out our new collection of stylish and comfortable clothes.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      author: 'Content Team',
      type: 'original' as const
    },
    {
      id: 'v3',
      content: 'Transform your style with our latest collection – where comfort meets elegance. Shop now and redefine your wardrobe! ✨ #FashionForward #Comfort #Style',
      timestamp: new Date(Date.now() + 1800000).toISOString(),
      author: 'Sarah Johnson',
      type: 'human_edited' as const,
      metadata: {
        feedback: 'Added more engaging language and relevant emojis'
      }
    }
  ];

  // Mock handlers for the HITL Review Panel
  const handleApprove = useCallback(async (itemId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, []);

  const handleReject = useCallback(async (itemId: string, feedback?: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, []);

  const handleEdit = useCallback(async (itemId: string, newContent: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, []);

  const handleRegenerate = useCallback(async (itemId: string, targetedChanges?: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }, []);

  // Mock handlers for Content Comparison Modal
  const handleSave = useCallback(async (itemId: string, content: string, notes?: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, []);

  const handleRevert = useCallback(async (itemId: string, versionId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, []);

  const handleQualityRecheck = useCallback(async (itemId: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock quality result
    return {
      itemId,
      overallScore: Math.random() * 0.3 + 0.7, // 0.7-1.0
      passed: true,
      checks: [],
      recommendations: ['Consider adding more engaging call-to-action'],
      blockers: [],
      timestamp: new Date().toISOString()
    };
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        HITL Review UI Components Demo
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        This demo showcases the Human-In-The-Loop (HITL) review UI components for 
        AI content generation systems. These components enable content reviewers to 
        assess, edit, approve, and regenerate AI-generated content with quality gates 
        and version comparison capabilities.
      </Typography>

      <Grid container spacing={3}>
        {/* Demo Controls */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Demo Controls
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => setShowReviewPanel(true)}
                  color="primary"
                >
                  Open Review Panel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setShowComparisonModal(true)}
                  color="secondary"
                >
                  Open Content Comparison
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quality Gate Panel Demo */}
        <Grid item xs={12} lg={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Quality Gate Panel
          </Typography>
          <QualityGatePanel
            itemId="demo-item-1"
            itemType="caption"
            content="Discover the perfect blend of style and comfort with our new collection. Elevate your wardrobe today! #Fashion #Style #NewCollection"
            metadata={{
              sceneType: 'product',
              sceneSubtype: 'lifestyle',
              brandId: 'fashion-brand-123',
              campaignId: 'spring-collection-2024'
            }}
            onRecheck={handleQualityRecheck}
          />
        </Grid>

        {/* Individual Quality Gate for Image Content */}
        <Grid item xs={12} lg={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Quality Gate Panel (Image Content)
          </Typography>
          <QualityGatePanel
            itemId="demo-item-2"
            itemType="image"
            content="A modern, minimalist photo of a diverse group of people wearing our latest fashion collection"
            metadata={{
              sceneType: 'human',
              sceneSubtype: 'group',
              brandId: 'fashion-brand-123',
              campaignId: 'spring-collection-2024'
            }}
            onRecheck={handleQualityRecheck}
          />
        </Grid>

        {/* Feature Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Component Features
              </Typography>
              
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                HITLReviewPanel:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                • Multi-item review interface with side-by-side layout<br/>
                • Individual item approval, rejection, editing, and regeneration<br/>
                • Quality score display and metadata visualization<br/>
                • Diff view for content changes<br/>
                • Targeted feedback and regeneration requests
              </Typography>

              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                QualityGatePanel:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                • Automated quality assessment with multiple check categories<br/>
                • Brand compliance, diversity, consistency, completeness, and policy checks<br/>
                • Expandable detailed results with explanations<br/>
                • Score visualization and pass/fail status<br/>
                • Recommendations and blocker identification
              </Typography>

              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                ContentComparisonModal:
              </Typography>
              <Typography variant="body2">
                • Multi-version content comparison and editing<br/>
                • Side-by-side diff view with syntax highlighting<br/>
                • Version history with metadata and timestamps<br/>
                • In-place editing with notes and change tracking<br/>
                • Revert capabilities and fullscreen mode
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* HITL Review Panel */}
      <HITLReviewPanel
        items={mockContentItems}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={handleEdit}
        onRegenerate={handleRegenerate}
        onClose={() => setShowReviewPanel(false)}
        isOpen={showReviewPanel}
        campaignId="demo-campaign"
      />

      {/* Content Comparison Modal */}
      <ContentComparisonModal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
        itemId="demo-item-1"
        itemType="caption"
        versions={mockVersions}
        onSave={handleSave}
        onRevert={handleRevert}
        title="Caption Content History & Editor"
      />
    </Box>
  );
};

export default HITLReviewDemo;