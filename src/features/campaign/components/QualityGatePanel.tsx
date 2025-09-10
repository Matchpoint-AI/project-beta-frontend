import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Divider,
  Button,
} from '@mui/material';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { MdExpandMore, MdRefresh } from 'react-icons/md';
import { useAuth } from '../../../features/auth/context/AuthContext';

export interface QualityCheck {
  id: string;
  name: string;
  description: string;
  score: number; // 0-1
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

const QualityGatePanel: React.FC<QualityGatePanelProps> = ({
  itemId,
  itemType,
  content,
  metadata: _metadata,
  onRecheck,
  className,
}) => {
  const [result, setResult] = useState<QualityGateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {} = useAuth();

  // Mock quality gate analysis - in production, this would call the actual quality gate service
  const performQualityCheck = useCallback(async (): Promise<QualityGateResult> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const checks: QualityCheck[] = [];

    // Brand Compliance Check
    const brandScore = Math.random() * 0.4 + 0.6; // 0.6-1.0
    checks.push({
      id: 'brand-compliance',
      name: 'Brand Compliance',
      description: 'Ensures content aligns with brand guidelines and voice',
      score: brandScore,
      status: brandScore > 0.8 ? 'pass' : brandScore > 0.6 ? 'warning' : 'fail',
      category: 'brand_compliance',
      details: [
        brandScore > 0.8 ? 'Brand voice and tone are consistent' : 'Brand voice needs adjustment',
        brandScore > 0.7
          ? 'Visual style aligns with brand guidelines'
          : 'Visual style deviates from guidelines',
        brandScore > 0.6 ? 'Approved messaging elements present' : 'Missing key brand messaging',
      ],
    });

    // Diversity Check (for image content)
    if (itemType === 'image' || itemType === 'prompt') {
      const diversityScore = Math.random() * 0.3 + 0.7; // 0.7-1.0
      checks.push({
        id: 'diversity',
        name: 'Diversity & Inclusion',
        description: 'Validates representation and inclusivity in visual content',
        score: diversityScore,
        status: diversityScore > 0.8 ? 'pass' : diversityScore > 0.6 ? 'warning' : 'fail',
        category: 'diversity',
        details: [
          diversityScore > 0.8
            ? 'Diverse representation achieved'
            : 'Limited diversity in representation',
          diversityScore > 0.7
            ? 'Inclusive messaging and imagery'
            : 'Consider more inclusive approach',
          'Accessibility considerations reviewed',
        ],
      });
    }

    // Consistency Check
    const consistencyScore = Math.random() * 0.4 + 0.6; // 0.6-1.0
    checks.push({
      id: 'consistency',
      name: 'Content Consistency',
      description: 'Ensures consistency across campaign content',
      score: consistencyScore,
      status: consistencyScore > 0.8 ? 'pass' : consistencyScore > 0.6 ? 'warning' : 'fail',
      category: 'consistency',
      details: [
        consistencyScore > 0.8
          ? 'Consistent with campaign theme'
          : 'Some inconsistency with campaign theme',
        consistencyScore > 0.7 ? 'Messaging tone is uniform' : 'Tone varies from campaign standard',
        consistencyScore > 0.6 ? 'Visual elements are cohesive' : 'Visual elements need alignment',
      ],
    });

    // Completeness Check
    const completenessScore = content.length > 50 ? 0.9 : 0.6; // Simple length check
    checks.push({
      id: 'completeness',
      name: 'Content Completeness',
      description: 'Validates that all required content elements are present',
      score: completenessScore,
      status: completenessScore > 0.8 ? 'pass' : completenessScore > 0.6 ? 'warning' : 'fail',
      category: 'completeness',
      details: [
        completenessScore > 0.8
          ? 'All required elements present'
          : 'Missing some required elements',
        itemType === 'caption' ? 'Caption length appropriate' : 'Content length adequate',
        'Call-to-action included where appropriate',
      ],
    });

    // Policy Check
    const policyScore = Math.random() * 0.2 + 0.8; // 0.8-1.0 (usually high)
    checks.push({
      id: 'policy',
      name: 'Policy & Legal Compliance',
      description: 'Ensures content meets platform policies and legal requirements',
      score: policyScore,
      status: policyScore > 0.9 ? 'pass' : policyScore > 0.7 ? 'warning' : 'fail',
      category: 'policy',
      details: [
        policyScore > 0.9 ? 'No policy violations detected' : 'Minor policy concerns',
        'Copyright and trademark compliance verified',
        'Platform-specific guidelines followed',
      ],
    });

    const overallScore = checks.reduce((sum, check) => sum + check.score, 0) / checks.length;
    const failedChecks = checks.filter((check) => check.status === 'fail');
    const warningChecks = checks.filter((check) => check.status === 'warning');

    const recommendations = [];
    const blockers = [];

    if (overallScore < 0.7) {
      recommendations.push('Consider regenerating content with more specific brand guidelines');
    }
    if (warningChecks.length > 2) {
      recommendations.push('Review and address warning items before approval');
    }
    if (itemType === 'caption' && content.length < 30) {
      recommendations.push('Consider expanding caption for better engagement');
    }

    if (failedChecks.length > 0) {
      blockers.push(`${failedChecks.length} critical check(s) failed - content cannot be approved`);
    }
    if (policyScore < 0.7) {
      blockers.push('Policy compliance issues must be resolved');
    }

    return {
      itemId,
      overallScore,
      passed: failedChecks.length === 0,
      checks,
      recommendations,
      blockers,
      timestamp: new Date().toISOString(),
    };
  }, [itemId, itemType, content]);

  const runQualityCheck = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const checkResult = onRecheck ? await onRecheck(itemId) : await performQualityCheck();

      setResult(checkResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Quality check failed');
    } finally {
      setLoading(false);
    }
  }, [itemId, onRecheck, performQualityCheck]);

  useEffect(() => {
    runQualityCheck();
  }, [runQualityCheck]);

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  const getStatusIcon = (status: QualityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <FaCheckCircle color="#4caf50" />;
      case 'warning':
        return <FaExclamationTriangle color="#ff9800" />;
      case 'fail':
        return <FaExclamationTriangle color="#f44336" />;
    }
  };

  const getCategoryColor = (category: QualityCheck['category']) => {
    switch (category) {
      case 'brand_compliance':
        return '#1976d2';
      case 'diversity':
        return '#9c27b0';
      case 'consistency':
        return '#2e7d32';
      case 'completeness':
        return '#ed6c02';
      case 'policy':
        return '#d32f2f';
      default:
        return '#757575';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FaInfoCircle />
            <Typography variant="h6" sx={{ ml: 1 }}>
              Running Quality Check...
            </Typography>
          </Box>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="outlined" startIcon={<MdRefresh />} onClick={runQualityCheck}>
            Retry Quality Check
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <Card className={className}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Quality Gate Results</Typography>
          <Button size="small" startIcon={<MdRefresh />} onClick={runQualityCheck}>
            Recheck
          </Button>
        </Box>

        {/* Overall Score */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Overall Score: {Math.round(result.overallScore * 100)}%
            </Typography>
            <Chip
              label={result.passed ? 'PASSED' : 'FAILED'}
              color={result.passed ? 'success' : 'error'}
              variant="filled"
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={result.overallScore * 100}
            color={getScoreColor(result.overallScore)}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Blockers */}
        {result.blockers.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Critical Issues:
            </Typography>
            {result.blockers.map((blocker, index) => (
              <Typography key={index} variant="body2">
                • {blocker}
              </Typography>
            ))}
          </Alert>
        )}

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Recommendations:
            </Typography>
            {result.recommendations.map((rec, index) => (
              <Typography key={index} variant="body2">
                • {rec}
              </Typography>
            ))}
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Individual Checks */}
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Detailed Checks:
        </Typography>

        {result.checks.map((check) => (
          <Accordion key={check.id} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<MdExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ mr: 2 }}>{getStatusIcon(check.status)}</Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">{check.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {Math.round(check.score * 100)}%
                  </Typography>
                  <Chip
                    label={check.category.replace('_', ' ')}
                    size="small"
                    sx={{
                      bgcolor: getCategoryColor(check.category),
                      color: 'white',
                      fontSize: '0.7rem',
                    }}
                  />
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {check.description}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={check.score * 100}
                  color={getScoreColor(check.score)}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Details:
              </Typography>
              {check.details.map((detail, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                  • {detail}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}

        {/* Timestamp */}
        <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
          Last checked: {new Date(result.timestamp).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default QualityGatePanel;
