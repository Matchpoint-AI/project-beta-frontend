import React, { useState } from 'react';
import { Button, Box, Card, CardContent, Typography, Grid, Chip } from '@mui/material';
import { FaFlask, FaPlay, FaChartBar } from 'react-icons/fa';
import ABTestVariantComparison from './ABTestVariantComparison';

// Type definitions for A/B test
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
  performance?: {
    clicks: number;
    impressions: number;
    ctr: number;
    engagement: number;
    conversions: number;
    cost: number;
    confidenceLevel: number;
  };
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

// Demo data for the A/B test
const demoTestConfig: ABTestConfig = {
  id: 'demo-test-123',
  name: 'Caption Engagement Test',
  description: 'Testing emoji vs. text-only captions for engagement',
  status: 'running',
  startDate: '2024-01-20T00:00:00Z',
  endDate: '2024-02-03T23:59:59Z',
  minSampleSize: 2000,
  significanceThreshold: 0.95,
  primaryMetric: 'ctr',
  variants: [
    {
      id: 'demo-variant-1',
      name: 'Text-Only Control',
      type: 'caption',
      content: {
        text: 'Discover our premium skincare line. Transform your daily routine with science-backed formulas. #skincare #premium #beauty',
      },
      status: 'running',
      trafficAllocation: 40,
      performance: {
        clicks: 320,
        impressions: 5200,
        ctr: 0.0615,
        engagement: 890,
        conversions: 47,
        cost: 124.8,
        confidenceLevel: 0.92,
      },
      created_at: '2024-01-20T09:00:00Z',
      updated_at: '2024-01-20T09:00:00Z',
      author: 'Marketing Team',
      notes: 'Clean, professional tone without emojis',
    },
    {
      id: 'demo-variant-2',
      name: 'Emoji-Rich Test',
      type: 'caption',
      content: {
        text: 'Discover our premium skincare line ✨ Transform your daily routine with science-backed formulas 🧴💫 #skincare #premium #beauty',
      },
      status: 'running',
      trafficAllocation: 40,
      performance: {
        clicks: 425,
        impressions: 5200,
        ctr: 0.0817,
        engagement: 1240,
        conversions: 63,
        cost: 118.4,
        confidenceLevel: 0.97,
      },
      created_at: '2024-01-20T09:15:00Z',
      updated_at: '2024-01-20T09:15:00Z',
      author: 'Marketing Team',
      notes: 'Engaging emojis to increase visual appeal',
    },
    {
      id: 'demo-variant-3',
      name: 'Question Format',
      type: 'caption',
      content: {
        text: 'Ready to transform your skin? 🤔 Our premium skincare line combines science with luxury. What are you waiting for? ✨ #skincare #transformation',
      },
      status: 'running',
      trafficAllocation: 20,
      performance: {
        clicks: 298,
        impressions: 2600,
        ctr: 0.1146,
        engagement: 780,
        conversions: 41,
        cost: 89.4,
        confidenceLevel: 0.89,
      },
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      author: 'Creative Team',
      notes: 'Conversational tone with direct questions',
    },
  ],
};

const ABTestDemo: React.FC = () => {
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [demoData, setDemoData] = useState<ABTestConfig>(demoTestConfig);

  const handleOpenComparison = () => {
    setIsComparisonOpen(true);
  };

  const handleCloseComparison = () => {
    setIsComparisonOpen(false);
  };

  const handleSaveVariant = async (variantId: string, content: ABTestVariant['content'], notes?: string) => {
    // Simulate API call

    // Update demo data
    setDemoData((prev) => ({
      ...prev,
      variants: prev.variants.map((v) =>
        v.id === variantId
          ? { ...v, content, notes: notes || v.notes, updated_at: new Date().toISOString() }
          : v
      ),
    }));
  };

  const handleUpdateTrafficAllocation = async (allocations: { [variantId: string]: number }) => {
    setDemoData((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => ({
        ...v,
        trafficAllocation: allocations[v.id] || v.trafficAllocation,
      })),
    }));
  };

  const handleStartTest = async () => {
    setDemoData((prev) => ({ ...prev, status: 'running' }));
  };

  const handlePauseTest = async () => {
    setDemoData((prev) => ({ ...prev, status: 'paused' }));
  };

  const handleDeclareWinner = async (variantId: string) => {
    setDemoData((prev) => ({
      ...prev,
      status: 'completed',
      variants: prev.variants.map((v) => ({
        ...v,
        status: v.id === variantId ? 'winner' : 'completed',
      })),
    }));
  };

  const handleCreateVariant = async (variant: Partial<ABTestVariant>) => {
    const newVariant: ABTestVariant = {
      id: `demo-variant-${Date.now()}`,
      name: `Variant ${demoData.variants.length + 1}`,
      type: 'caption' as const,
      content: { text: 'New variant content...' },
      status: 'draft' as const,
      trafficAllocation: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: 'Demo User',
      ...variant,
    };

    setDemoData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));
  };

  const getWinningVariant = () => {
    return (
      demoData.variants.find((v) => v.status === 'winner') ||
      demoData.variants.reduce((best, current) =>
        (current.performance?.ctr || 0) > (best.performance?.ctr || 0) ? current : best
      )
    );
  };

  const winningVariant = getWinningVariant();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <FaFlask color="#2196f3" />
        A/B Test Demo - Caption Variants
      </Typography>

      <Grid container spacing={3}>
        {/* Test Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">{demoData.name}</Typography>
                <Chip
                  label={demoData.status.toUpperCase()}
                  color={demoData.status === 'running' ? 'success' : 'primary'}
                  icon={<FaPlay />}
                />
              </Box>

              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {demoData.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Typography variant="caption">
                  <strong>Variants:</strong> {demoData.variants.length}
                </Typography>
                <Typography variant="caption">
                  <strong>Primary Metric:</strong> {demoData.primaryMetric.toUpperCase()}
                </Typography>
                <Typography variant="caption">
                  <strong>Min Sample:</strong> {demoData.minSampleSize.toLocaleString()}
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={handleOpenComparison}
                startIcon={<FaChartBar />}
                size="large"
              >
                View A/B Test Comparison
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Current Leader
              </Typography>

              {winningVariant && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h5" color="success.main">
                      {winningVariant.name}
                    </Typography>
                    {winningVariant.status === 'winner' && (
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        👑
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {winningVariant.content.text?.substring(0, 80)}...
                  </Typography>

                  {winningVariant.performance && (
                    <Box>
                      <Typography variant="h4" color="primary">
                        {(winningVariant.performance.ctr * 100).toFixed(2)}%
                      </Typography>
                      <Typography variant="caption">Click-through rate</Typography>

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          <strong>Confidence:</strong>{' '}
                          {(winningVariant.performance.confidenceLevel * 100).toFixed(1)}%
                        </Typography>
                        <Typography variant="body2">
                          <strong>Conversions:</strong> {winningVariant.performance.conversions}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Variant Preview Cards */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Variant Previews
          </Typography>
          <Grid container spacing={2}>
            {demoData.variants.map((variant, _index) => (
              <Grid item xs={12} md={4} key={variant.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {variant.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={`${variant.trafficAllocation}%`}
                          size="small"
                          color="primary"
                        />
                        {variant.status === 'winner' && <Typography variant="body2">👑</Typography>}
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2, minHeight: 60 }}>
                      {variant.content.text}
                    </Typography>

                    {variant.performance && (
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          CTR: {(variant.performance.ctr * 100).toFixed(2)}% | Engagement:{' '}
                          {variant.performance.engagement.toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* A/B Test Comparison Modal */}
      <ABTestVariantComparison
        isOpen={isComparisonOpen}
        onClose={handleCloseComparison}
        testConfig={demoData}
        onSaveVariant={handleSaveVariant}
        onUpdateTrafficAllocation={handleUpdateTrafficAllocation}
        onStartTest={handleStartTest}
        onPauseTest={handlePauseTest}
        onDeclareWinner={handleDeclareWinner}
        onCreateVariant={handleCreateVariant}
        title="A/B Test Variant Comparison - Demo"
      />
    </Box>
  );
};

export default ABTestDemo;
