import React, { useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  LinearProgress,
  Avatar,
  Badge,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { FaSave, FaTimes, FaCopy, FaPlay, FaPause } from 'react-icons/fa';
import { MdFullscreen, MdFullscreenExit, MdThumbUp } from 'react-icons/md';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';

interface PerformanceMetrics {
  clicks: number;
  impressions: number;
  ctr: number; // Click-through rate
  engagement: number;
  conversions: number;
  cost: number;
  confidenceLevel: number; // 0-1 for statistical confidence
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
  trafficAllocation: number; // Percentage 0-100
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
  significanceThreshold: number; // Default 0.95 for 95% confidence
  primaryMetric: 'ctr' | 'engagement' | 'conversions';
  variants: ABTestVariant[];
}

interface ABTestVariantComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  testConfig: ABTestConfig;
  onSaveVariant: (variantId: string, content: unknown, notes?: string) => Promise<void>;
  onUpdateTrafficAllocation: (allocations: { [variantId: string]: number }) => Promise<void>;
  onStartTest: () => Promise<void>;
  onPauseTest: () => Promise<void>;
  onDeclareWinner: (variantId: string) => Promise<void>;
  onCreateVariant: (variant: Partial<ABTestVariant>) => Promise<void>;
  title?: string;
}

const ABTestVariantComparison: React.FC<ABTestVariantComparisonProps> = ({
  isOpen,
  onClose,
  testConfig,
  onSaveVariant,
  onUpdateTrafficAllocation: _onUpdateTrafficAllocation,
  onStartTest,
  onPauseTest,
  onDeclareWinner,
  onCreateVariant: _onCreateVariant,
  title = 'A/B Test Variant Comparison',
}) => {
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'comparison' | 'performance' | 'traffic'>('comparison');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, unknown>>({});
  const [editNotes, setEditNotes] = useState('');
  const [_newVariantDialogOpen, _setNewVariantDialogOpen] = useState(false);

  // Auto-select first two variants for comparison
  React.useEffect(() => {
    if (testConfig.variants.length >= 2 && selectedVariants.length === 0) {
      setSelectedVariants([testConfig.variants[0].id, testConfig.variants[1].id]);
    }
  }, [testConfig.variants, selectedVariants]);

  const _selectedVariantObjects = useMemo(() => {
    return selectedVariants
      .map((id) => testConfig.variants.find((v) => v.id === id))
      .filter(Boolean) as ABTestVariant[];
  }, [selectedVariants, testConfig.variants]);

  const getPerformanceTrend = (metric: number, baseline?: number) => {
    if (!baseline) return <TrendingFlat color="disabled" />;
    const change = ((metric - baseline) / baseline) * 100;
    if (change > 5) return <TrendingUp color="success" />;
    if (change < -5) return <TrendingDown color="error" />;
    return <TrendingFlat color="primary" />;
  };

  const getStatusColor = (status: ABTestVariant['status']) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'running':
        return 'primary';
      case 'paused':
        return 'warning';
      case 'completed':
        return 'secondary';
      case 'winner':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleStartEdit = useCallback(
    (variantId: string) => {
      const variant = testConfig.variants.find((v) => v.id === variantId);
      if (variant) {
        setEditingVariant(variantId);
        setEditedContent(variant.content);
        setEditNotes('');
      }
    },
    [testConfig.variants]
  );

  const handleSaveEdit = useCallback(async () => {
    if (!editingVariant) return;

    try {
      setLoading(true);
      await onSaveVariant(editingVariant, editedContent, editNotes);
      setEditingVariant(null);
      setEditedContent({});
      setEditNotes('');
    } catch (error) {
      console.error('Failed to save variant:', error);
    } finally {
      setLoading(false);
    }
  }, [editingVariant, editedContent, editNotes, onSaveVariant]);

  const handleCancelEdit = useCallback(() => {
    setEditingVariant(null);
    setEditedContent({});
    setEditNotes('');
  }, []);

  const copyToClipboard = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  const renderPerformanceMetrics = (variant: ABTestVariant, baseline?: ABTestVariant) => {
    if (!variant.performance) {
      return (
        <Typography variant="body2" color="textSecondary">
          No performance data yet
        </Typography>
      );
    }

    const { performance } = variant;
    const baselinePerf = baseline?.performance;

    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              CTR:
            </Typography>
            <Typography variant="h6" color="primary">
              {(performance.ctr * 100).toFixed(2)}%
            </Typography>
            {getPerformanceTrend(performance.ctr, baselinePerf?.ctr)}
          </Box>
          <LinearProgress
            variant="determinate"
            value={performance.ctr * 100}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Engagement:
            </Typography>
            <Typography variant="h6" color="primary">
              {performance.engagement.toLocaleString()}
            </Typography>
            {getPerformanceTrend(performance.engagement, baselinePerf?.engagement)}
          </Box>
          <LinearProgress
            variant="determinate"
            value={
              (performance.engagement /
                Math.max(...testConfig.variants.map((v) => v.performance?.engagement || 0))) *
              100
            }
            color="secondary"
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Grid>

        <Grid item xs={6}>
          <Typography variant="caption" color="textSecondary">
            Clicks: {performance.clicks.toLocaleString()}
          </Typography>
          <br />
          <Typography variant="caption" color="textSecondary">
            Impressions: {performance.impressions.toLocaleString()}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="caption" color="textSecondary">
            Conversions: {performance.conversions.toLocaleString()}
          </Typography>
          <br />
          <Typography variant="caption" color="textSecondary">
            Cost: ${performance.cost.toFixed(2)}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption">
              Confidence: {(performance.confidenceLevel * 100).toFixed(1)}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={performance.confidenceLevel * 100}
              color={performance.confidenceLevel > 0.95 ? 'success' : 'warning'}
              sx={{ width: 100, height: 4, borderRadius: 2 }}
            />
          </Box>
        </Grid>
      </Grid>
    );
  };

  const renderVariantCard = (variant: ABTestVariant, index: number) => {
    const isEditing = editingVariant === variant.id;
    const isBaseline = index === 0;
    const baselineVariant = testConfig.variants[0];

    return (
      <Card
        key={variant.id}
        sx={{
          mb: 2,
          border: selectedVariants.includes(variant.id) ? 2 : 1,
          borderColor: selectedVariants.includes(variant.id) ? 'primary.main' : 'divider',
        }}
      >
        <CardContent>
          {/* Variant Header */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Badge badgeContent={variant.status === 'winner' ? '👑' : ''} color="primary">
                <Avatar sx={{ mr: 2, bgcolor: getStatusColor(variant.status) + '.main' }}>
                  {variant.name.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>

              <Box>
                <Typography variant="h6">{variant.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={variant.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(variant.status)}
                    size="small"
                  />
                  <Typography variant="caption" color="textSecondary">
                    {variant.trafficAllocation}% traffic
                  </Typography>
                  {isBaseline && <Chip label="Baseline" size="small" variant="outlined" />}
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Copy content">
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(JSON.stringify(variant.content, null, 2))}
                >
                  <FaCopy />
                </IconButton>
              </Tooltip>

              <Tooltip title="Edit variant">
                <IconButton
                  size="small"
                  onClick={() => handleStartEdit(variant.id)}
                  disabled={loading || variant.status === 'running'}
                >
                  <MdThumbUp />
                </IconButton>
              </Tooltip>

              {variant.status !== 'winner' &&
                variant.performance &&
                variant.performance.confidenceLevel > 0.95 && (
                  <Tooltip title="Declare winner">
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => onDeclareWinner(variant.id)}
                      disabled={loading}
                    >
                      <MdThumbUp />
                    </IconButton>
                  </Tooltip>
                )}
            </Box>
          </Box>

          {/* Content Preview */}
          <Box sx={{ mb: 2 }}>
            {variant.type === 'image' && variant.content.image_url && (
              <Box sx={{ mb: 2 }}>
                <img
                  src={variant.content.image_url}
                  alt={`Variant ${variant.name}`}
                  style={{ width: '100%', maxWidth: 300, height: 'auto', borderRadius: 8 }}
                />
                {variant.content.image_prompt && (
                  <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
                    Prompt: {variant.content.image_prompt}
                  </Typography>
                )}
              </Box>
            )}

            {(variant.type === 'caption' || variant.type === 'complete_post') &&
              variant.content.text && (
                <Box
                  sx={{
                    backgroundColor: isEditing ? 'transparent' : '#f5f5f5',
                    p: 2,
                    borderRadius: 1,
                    minHeight: '80px',
                  }}
                >
                  {isEditing ? (
                    <TextField
                      multiline
                      fullWidth
                      minRows={4}
                      value={editedContent.text || ''}
                      onChange={(e) =>
                        setEditedContent((prev) => ({ ...prev, text: e.target.value }))
                      }
                      placeholder="Edit caption text..."
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {variant.content.text}
                    </Typography>
                  )}
                </Box>
              )}
          </Box>

          {/* Performance Metrics */}
          {viewMode === 'performance' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Performance Metrics
              </Typography>
              {renderPerformanceMetrics(variant, !isBaseline ? baselineVariant : undefined)}
            </Box>
          )}

          {/* Metadata */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              pt: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="textSecondary">
              Created: {new Date(variant.created_at).toLocaleDateString()} by {variant.author}
            </Typography>
            {variant.notes && (
              <Tooltip title={variant.notes}>
                <Chip label="Has Notes" size="small" variant="outlined" />
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderTrafficAllocation = () => {
    const totalAllocation = testConfig.variants.reduce((sum, v) => sum + v.trafficAllocation, 0);

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Traffic Allocation
        </Typography>
        {testConfig.variants.map((variant) => (
          <Box key={variant.id} sx={{ mb: 2 }}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography variant="body2">{variant.name}</Typography>
              <Typography variant="body2" color="primary">
                {variant.trafficAllocation}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={variant.trafficAllocation}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        ))}
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: totalAllocation === 100 ? 'success.light' : 'warning.light',
            borderRadius: 1,
          }}
        >
          <Typography variant="caption">
            Total Allocation: {totalAllocation}% {totalAllocation !== 100 && '(Must equal 100%)'}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      fullScreen={isFullscreen}
      sx={{
        '& .MuiDialog-paper': {
          height: isFullscreen ? '100vh' : '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {testConfig.name} • {testConfig.status.toUpperCase()} • {testConfig.variants.length}{' '}
              variants
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>View Mode</InputLabel>
              <Select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'comparison' | 'performance' | 'traffic')}
                label="View Mode"
              >
                <MenuItem value="comparison">Comparison</MenuItem>
                <MenuItem value="performance">Performance</MenuItem>
                <MenuItem value="traffic">Traffic</MenuItem>
              </Select>
            </FormControl>

            <IconButton onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
            </IconButton>

            <IconButton onClick={onClose}>
              <FaTimes />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        {/* Test Controls */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'primary.light', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" color="primary.contrastText">
                Test Status: {testConfig.status.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="primary.contrastText">
                Primary Metric: {testConfig.primaryMetric.toUpperCase()} | Min Sample:{' '}
                {testConfig.minSampleSize.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {testConfig.status === 'draft' && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={onStartTest}
                  disabled={loading}
                  startIcon={<FaPlay />}
                >
                  Start Test
                </Button>
              )}

              {testConfig.status === 'running' && (
                <Button
                  variant="contained"
                  color="warning"
                  onClick={onPauseTest}
                  disabled={loading}
                  startIcon={<FaPause />}
                >
                  Pause Test
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* Content Based on View Mode */}
        {viewMode === 'traffic' ? (
          renderTrafficAllocation()
        ) : (
          <Grid container spacing={2}>
            {testConfig.variants.map((variant, index) => (
              <Grid item xs={12} md={viewMode === 'comparison' ? 6 : 12} key={variant.id}>
                {renderVariantCard(variant, index)}
              </Grid>
            ))}
          </Grid>
        )}

        {/* Edit Notes */}
        {editingVariant && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <TextField
              fullWidth
              label="Edit Notes (Optional)"
              placeholder="Describe the changes you made..."
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              size="small"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {editingVariant ? (
          <>
            <Button onClick={handleCancelEdit} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveEdit}
              disabled={loading}
              startIcon={<FaSave />}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onClose}>Close</Button>
            <Button
              variant="outlined"
              onClick={() => setNewVariantDialogOpen(true)}
              disabled={testConfig.status === 'running'}
            >
              Add Variant
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ABTestVariantComparison;
