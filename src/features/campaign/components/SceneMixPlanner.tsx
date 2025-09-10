import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { plannerApi, policyApi } from '../../../api/contentGenerationApi';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface SceneMixPlannerProps {
  campaignId: string;
  campaignName: string;
  weeks: number;
  postsPerWeek: number;
}

interface ContentPlan {
  id: string;
  campaign_id: string;
  weeks: Array<{
    week_number: number;
    posts: Array<{
      day: number;
      scene_type: string;
      theme?: string;
      elements?: string[];
      caption_style?: string;
    }>;
  }>;
  created_at: string;
  updated_at: string;
}

interface ScenePolicy {
  id: string;
  scenes: Array<{
    type: string;
    weight: number;
    elements?: string[];
  }>;
  diversity_score: number;
  consistency_level: number;
}

const SceneMixPlanner: React.FC<SceneMixPlannerProps> = ({
  campaignId,
  campaignName,
  weeks,
  postsPerWeek,
}) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contentPlan, setContentPlan] = useState<ContentPlan | null>(null);
  const [scenePolicy, setScenePolicy] = useState<ScenePolicy | null>(null);
  const [creatingPlan, setCreatingPlan] = useState(false);

  // Scene type colors for visual distinction
  const sceneTypeColors: Record<string, string> = {
    product: '#FF6B6B',
    lifestyle: '#4ECDC4',
    human: '#45B7D1',
    text: '#96CEB4',
    infographic: '#FFEAA7',
  };

  useEffect(() => {
    loadPlanAndPolicy();
  }, [campaignId]);

  const loadPlanAndPolicy = async () => {
    if (!profile?.token) return;

    try {
      setLoading(true);
      setError(null);

      // Load existing plan and policy in parallel
      const [planData, policyData] = await Promise.all([
        plannerApi.getPlan(campaignId, profile.token).catch(() => null),
        policyApi.getPolicy(campaignId, profile.token).catch(() => null),
      ]);

      setContentPlan(planData);
      setScenePolicy(policyData);
    } catch (_err) {
      let errorMessage = 'Failed to load content plan';

      if (err instanceof Error) {
        if (err.message.includes('404')) {
          errorMessage = 'No existing content plan found for this campaign';
        } else if (err.message.includes('401')) {
          errorMessage = 'Authentication failed. Please refresh the page and try again.';
        } else {
          errorMessage = `Error loading plan: ${err.message}`;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createNewPlan = async () => {
    if (!profile?.token) return;

    try {
      setCreatingPlan(true);
      setError(null);

      // First create a policy if none exists
      if (!scenePolicy) {
        const newPolicy = await policyApi.createPolicy(
          campaignId,
          {
            campaign_id: campaignId,
            intent: 'awareness',
            industry: 'consumable',
            brand_tier: 'standard',
            target_audience: {
              age_range: '25-45',
              interests: ['lifestyle', 'quality'],
              behavior: ['social_media_active'],
            },
            brand_personality: ['authentic', 'approachable', 'quality-focused'],
            product_features: ['high-quality', 'user-friendly', 'innovative'],
            seasonal_context: 'general',
            region: 'us',
            has_ingredients: false,
            visual_restrictions: [],
            performance_history: {},
            force_regenerate: false,
          },
          profile.token
        );
        setScenePolicy(newPolicy);
      }

      // Create the content plan
      const newPlan = await plannerApi.createPlan(
        campaignId,
        {
          campaign_name: campaignName,
          campaign_type: 'brand_awareness',
          duration_weeks: weeks,
          target_audience: ['general_audience', 'brand_enthusiasts'],
          content_types: ['post', 'story', 'reel'],
          weekly_post_count: postsPerWeek,
          themes: ['brand_awareness', 'product_showcase', 'user_stories', 'educational'],
          brand_values: ['quality', 'innovation', 'authenticity'],
        },
        profile.token
      );

      setContentPlan(newPlan);
    } catch (_err) {
      let errorMessage = 'Failed to create content plan';

      if (err instanceof Error) {
        if (err.message.includes('422')) {
          errorMessage = 'Invalid request parameters. Please check your campaign settings.';
        } else if (err.message.includes('401')) {
          errorMessage = 'Authentication failed. Please refresh the page and try again.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Server error occurred. Please try again in a few moments.';
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }

      setError(errorMessage);
    } finally {
      setCreatingPlan(false);
    }
  };

  const regeneratePlan = async () => {
    await createNewPlan();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (_error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <Button onClick={loadPlanAndPolicy} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  if (!contentPlan) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <AutoAwesomeIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          No Content Plan Yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Create an AI-powered content plan using Scene Mix technology
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={createNewPlan}
          disabled={creatingPlan}
          size="large"
        >
          {creatingPlan ? 'Creating Plan...' : 'Generate Content Plan'}
        </Button>
        {creatingPlan && <LinearProgress sx={{ mt: 2 }} />}
      </Paper>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" gutterBottom>
              Scene Mix Content Plan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-optimized content distribution for {campaignName}
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Regenerate Plan">
              <IconButton onClick={regeneratePlan} disabled={creatingPlan}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Policy">
              <IconButton disabled>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Policy Summary */}
        {scenePolicy && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {scenePolicy.scenes.map((scene) => (
              <Chip
                key={scene.type}
                label={`${scene.type}: ${(scene.weight * 100).toFixed(0)}%`}
                size="small"
                sx={{
                  backgroundColor: sceneTypeColors[scene.type] + '20',
                  borderColor: sceneTypeColors[scene.type],
                  border: '1px solid',
                }}
              />
            ))}
            <Chip
              label={`Diversity: ${(scenePolicy.diversity_score * 100).toFixed(0)}%`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`Consistency: ${(scenePolicy.consistency_level * 100).toFixed(0)}%`}
              size="small"
              variant="outlined"
            />
          </Box>
        )}
      </Paper>

      {/* Content Plan Grid */}
      <Grid container spacing={3}>
        {contentPlan.weeks.map((week) => (
          <Grid item xs={12} key={week.week_number}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Week {week.week_number}
              </Typography>
              <Grid container spacing={2}>
                {week.posts.map((post, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card
                      sx={{
                        height: '100%',
                        borderLeft: `4px solid ${sceneTypeColors[post.scene_type] || '#ccc'}`,
                      }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Chip
                            label={post.scene_type}
                            size="small"
                            sx={{
                              backgroundColor: sceneTypeColors[post.scene_type] + '20',
                              fontSize: '0.75rem',
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Day {post.day}
                          </Typography>
                        </Box>

                        {post.theme && (
                          <Typography variant="body2" gutterBottom>
                            Theme: {post.theme}
                          </Typography>
                        )}

                        {post.elements && post.elements.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            {post.elements.map((element, i) => (
                              <Chip
                                key={i}
                                label={element}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                              />
                            ))}
                          </Box>
                        )}

                        {post.caption_style && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1, display: 'block' }}
                          >
                            Style: {post.caption_style}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Success Indicator */}
      {contentPlan && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
          <Typography variant="body2" color="text.secondary" component="span">
            Plan generated on {new Date(contentPlan.created_at).toLocaleDateString()}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SceneMixPlanner;
