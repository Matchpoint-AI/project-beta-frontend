import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Tooltip,
  Collapse,
  IconButton,
  Chip,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Info,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced as T & { cancel: () => void };
}

// Styled components for visual appeal
const QualityCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: 12,
  position: 'relative',
  overflow: 'visible',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    zIndex: -1,
  },
}));

const ScoreCircle = styled(Box)<{ score: number }>(({ score }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `conic-gradient(
    ${getScoreColor(score)} ${score * 3.6}deg, 
    rgba(255, 255, 255, 0.2) ${score * 3.6}deg
  )`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
}));

const MetricBar = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 3,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 3,
  },
}));

// Helper function to get color based on score
function getScoreColor(score: number): string {
  if (score >= 80) return '#4caf50';
  if (score >= 60) return '#ff9800';
  return '#f44336';
}

function getScoreIcon(score: number) {
  if (score >= 80) return <CheckCircle sx={{ fontSize: 16 }} />;
  if (score >= 60) return <Warning sx={{ fontSize: 16 }} />;
  return <ErrorIcon sx={{ fontSize: 16 }} />;
}

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

export const QualityScoreIndicator: React.FC<QualityScoreIndicatorProps> = ({
  content,
  contentType = 'caption',
  brandContext,
  onScoreChange,
  minHeight = 120,
  showDetails = true,
  position = 'inline',
}) => {
  const [overallScore, setOverallScore] = useState<number>(0);
  const [metrics, setMetrics] = useState<QualityMetric[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [previousScore, setPreviousScore] = useState<number>(0);

  // Analyze content quality
  const analyzeQuality = useCallback(
    (text: string): QualityMetric[] => {
      const results: QualityMetric[] = [];

      // Length Check
      const lengthScore = calculateLengthScore(text, contentType);
      results.push({
        name: 'Length',
        score: lengthScore,
        weight: 0.15,
        description: 'Optimal content length for engagement',
        suggestions: getLengthSuggestions(text, contentType),
      });

      // Keyword Density
      const keywordScore = calculateKeywordScore(text, brandContext?.keywords || []);
      results.push({
        name: 'Keywords',
        score: keywordScore,
        weight: 0.2,
        description: 'Brand keyword presence',
        suggestions: getKeywordSuggestions(text, brandContext?.keywords || []),
      });

      // Readability
      const readabilityScore = calculateReadabilityScore(text);
      results.push({
        name: 'Readability',
        score: readabilityScore,
        weight: 0.25,
        description: 'Easy to read and understand',
        suggestions: getReadabilitySuggestions(text),
      });

      // Engagement Potential
      const engagementScore = calculateEngagementScore(text);
      results.push({
        name: 'Engagement',
        score: engagementScore,
        weight: 0.2,
        description: 'Likely to drive interaction',
        suggestions: getEngagementSuggestions(text),
      });

      // Tone Alignment
      const toneScore = calculateToneScore(text, brandContext?.tone || 'neutral');
      results.push({
        name: 'Tone',
        score: toneScore,
        weight: 0.2,
        description: 'Matches brand voice',
        suggestions: getToneSuggestions(text, brandContext?.tone || 'neutral'),
      });

      return results;
    },
    [contentType, brandContext]
  );

  // Debounced quality calculation
  const debouncedCalculate = useMemo(
    () =>
      debounce((text: string) => {
        setIsCalculating(true);

        // Simulate async calculation
        setTimeout(() => {
          const newMetrics = analyzeQuality(text);
          const newScore = Math.round(
            newMetrics.reduce((acc, metric) => acc + metric.score * metric.weight, 0)
          );

          setPreviousScore(overallScore);
          setOverallScore(newScore);
          setMetrics(newMetrics);
          setIsCalculating(false);

          if (onScoreChange) {
            onScoreChange(newScore, newMetrics);
          }
        }, 300);
      }, 500),
    [analyzeQuality, onScoreChange, overallScore]
  );

  // Calculate quality score when content changes
  useEffect(() => {
    if (content && content.length > 0) {
      debouncedCalculate(content);
    } else {
      setOverallScore(0);
      setMetrics([]);
    }
  }, [content, debouncedCalculate]);

  // Score trend indicator
  const scoreTrend =
    overallScore > previousScore ? 'up' : overallScore < previousScore ? 'down' : 'stable';

  if (!content || content.length === 0) {
    return null;
  }

  const FloatingWrapper = position === 'floating' ? Box : React.Fragment;
  const floatingProps =
    position === 'floating'
      ? {
          sx: {
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            maxWidth: 320,
          },
        }
      : {};

  return (
    <FloatingWrapper {...floatingProps}>
      <QualityCard sx={{ minHeight, transition: 'all 0.3s ease' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <ScoreCircle score={overallScore}>
                <Typography
                  variant="h5"
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {isCalculating ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    overallScore
                  )}
                </Typography>
              </ScoreCircle>

              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                  Quality Score
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Chip
                    size="small"
                    icon={getScoreIcon(overallScore)}
                    label={
                      overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Work'
                    }
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                  {scoreTrend !== 'stable' && (
                    <Box display="flex" alignItems="center">
                      {scoreTrend === 'up' ? (
                        <TrendingUp sx={{ fontSize: 16, color: '#4caf50' }} />
                      ) : (
                        <TrendingDown sx={{ fontSize: 16, color: '#f44336' }} />
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {showDetails && (
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{ color: 'white' }}
              >
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </Box>

          <Collapse in={expanded || !showDetails}>
            <Box sx={{ mt: 2 }}>
              {metrics.map((metric, index) => (
                <Box key={metric.name} sx={{ mb: 1.5 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {metric.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography variant="caption" fontWeight="bold">
                        {metric.score}%
                      </Typography>
                      <Tooltip
                        title={
                          <Box>
                            <Typography variant="caption">{metric.description}</Typography>
                            {metric.suggestions && metric.suggestions.length > 0 && (
                              <Box mt={1}>
                                {metric.suggestions.map((suggestion, i) => (
                                  <Typography key={i} variant="caption" display="block">
                                    • {suggestion}
                                  </Typography>
                                ))}
                              </Box>
                            )}
                          </Box>
                        }
                      >
                        <Info sx={{ fontSize: 14, opacity: 0.7 }} />
                      </Tooltip>
                    </Box>
                  </Box>
                  <MetricBar
                    variant="determinate"
                    value={metric.score}
                    sx={{
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getScoreColor(metric.score),
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Collapse>
        </CardContent>
      </QualityCard>
    </FloatingWrapper>
  );
};

// Helper functions for quality calculations
function calculateLengthScore(text: string, type: string): number {
  const length = text.length;
  const optimalRanges = {
    caption: { min: 100, max: 300 },
    prompt: { min: 50, max: 150 },
    description: { min: 150, max: 500 },
  };

  const range = optimalRanges[type] || optimalRanges.caption;

  if (length < range.min) {
    return Math.max(0, (length / range.min) * 80);
  } else if (length > range.max) {
    return Math.max(0, 100 - ((length - range.max) / range.max) * 50);
  }
  return 90 + Math.random() * 10;
}

function calculateKeywordScore(text: string, keywords: string[]): number {
  if (!keywords || keywords.length === 0) return 75;

  const lowerText = text.toLowerCase();
  const foundKeywords = keywords.filter((kw) => lowerText.includes(kw.toLowerCase()));
  const score = (foundKeywords.length / keywords.length) * 100;

  return Math.min(100, Math.max(0, score));
}

function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const avgWordsPerSentence = words.length / (sentences.length || 1);

  // Simple readability scoring
  if (avgWordsPerSentence < 10) return 95;
  if (avgWordsPerSentence < 15) return 85;
  if (avgWordsPerSentence < 20) return 70;
  if (avgWordsPerSentence < 25) return 50;
  return 30;
}

function calculateEngagementScore(text: string): number {
  let score = 70; // Base score

  // Check for engagement elements
  if (text.includes('?')) score += 10; // Questions
  if (text.match(/!+/)) score += 5; // Excitement
  if (text.match(/#\w+/)) score += 5; // Hashtags
  if (text.match(/@\w+/)) score += 5; // Mentions
  if (text.match(/https?:\/\//)) score += 5; // Links

  // Check for call-to-actions
  const ctaWords = ['click', 'visit', 'shop', 'discover', 'learn', 'join', 'get', 'try'];
  const lowerText = text.toLowerCase();
  if (ctaWords.some((word) => lowerText.includes(word))) score += 10;

  return Math.min(100, score);
}

function calculateToneScore(text: string, targetTone: string): number {
  // Simplified tone analysis
  const toneIndicators = {
    professional: ['professional', 'expertise', 'quality', 'service', 'solution'],
    casual: ['hey', 'awesome', 'cool', 'fun', 'love'],
    friendly: ['thank', 'please', 'happy', 'glad', 'welcome'],
    urgent: ['now', 'today', 'limited', 'hurry', 'fast'],
    neutral: [],
  };

  const indicators = toneIndicators[targetTone] || toneIndicators.neutral;
  if (indicators.length === 0) return 80;

  const lowerText = text.toLowerCase();
  const matches = indicators.filter((word) => lowerText.includes(word));

  return 70 + matches.length * 10;
}

// Suggestion functions
function getLengthSuggestions(text: string, type: string): string[] {
  const length = text.length;
  const suggestions: string[] = [];

  const optimalRanges = {
    caption: { min: 100, max: 300 },
    prompt: { min: 50, max: 150 },
    description: { min: 150, max: 500 },
  };

  const range = optimalRanges[type] || optimalRanges.caption;

  if (length < range.min) {
    suggestions.push(`Add ${range.min - length} more characters for optimal length`);
  } else if (length > range.max) {
    suggestions.push(`Consider reducing by ${length - range.max} characters`);
  }

  return suggestions;
}

function getKeywordSuggestions(text: string, keywords: string[]): string[] {
  if (!keywords || keywords.length === 0) return [];

  const lowerText = text.toLowerCase();
  const missingKeywords = keywords.filter((kw) => !lowerText.includes(kw.toLowerCase()));

  if (missingKeywords.length > 0) {
    return [`Consider including: ${missingKeywords.slice(0, 3).join(', ')}`];
  }
  return [];
}

function getReadabilitySuggestions(text: string): string[] {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const avgWordsPerSentence = words.length / (sentences.length || 1);

  if (avgWordsPerSentence > 20) {
    return ['Break up long sentences for better readability'];
  }
  if (avgWordsPerSentence < 8) {
    return ['Combine short sentences for better flow'];
  }
  return [];
}

function getEngagementSuggestions(text: string): string[] {
  const suggestions: string[] = [];

  if (!text.includes('?')) {
    suggestions.push('Add a question to encourage engagement');
  }
  if (!text.match(/#\w+/)) {
    suggestions.push('Include relevant hashtags');
  }

  const ctaWords = ['click', 'visit', 'shop', 'discover', 'learn', 'join'];
  const lowerText = text.toLowerCase();
  if (!ctaWords.some((word) => lowerText.includes(word))) {
    suggestions.push('Add a clear call-to-action');
  }

  return suggestions.slice(0, 2);
}

function getToneSuggestions(text: string, targetTone: string): string[] {
  const suggestions: string[] = [];

  const toneGuides = {
    professional: 'Use more formal language and industry terms',
    casual: 'Make it more conversational and relaxed',
    friendly: 'Add warmth with friendly greetings or thanks',
    urgent: 'Create urgency with time-sensitive language',
  };

  if (toneGuides[targetTone]) {
    suggestions.push(toneGuides[targetTone]);
  }

  return suggestions;
}

export default QualityScoreIndicator;
