/** Tests for Smart Performance Insights Panel Component. */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { SmartInsightsPanel } from './SmartInsightsPanel';

// Mock the performance API
vi.mock('../../api/performanceApi', () => ({
  performanceApi: {
    getPerformanceInsights: vi.fn(),
    recordMetric: vi.fn(),
  },
}));

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(() => 'mock_token'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('SmartInsightsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  const mockSummaryResponse = {
    timestamp: '2024-08-24T12:00:00Z',
    brand_id: null,
    insights_summary: {
      total_insights: 5,
      by_type: {
        cost_optimization: 2,
        anomaly_detection: 1,
        user_experience: 2,
      },
      by_severity: {
        critical: 1,
        high: 2,
        medium: 2,
      },
    },
    health_score: 75,
    health_status: 'good',
    top_recommendations: [
      {
        title: 'Implement Multi-Model Strategy',
        category: 'cost',
        priority_score: 85.0,
        estimated_impact: '35% cost reduction',
      },
      {
        title: 'Add Response Caching',
        category: 'performance',
        priority_score: 75.0,
        estimated_impact: '40% latency reduction',
      },
    ],
    key_metrics: {
      critical_issues: 1,
      high_priority_issues: 2,
      total_recommendations: 8,
    },
  };

  const mockInsightsResponse = [
    {
      id: 'insight_1',
      insight_type: 'cost_optimization',
      severity: 'high',
      confidence: 'high',
      title: 'High Cost Per Generation',
      description: 'Cost per generation is above optimal threshold',
      current_value: 0.65,
      predicted_value: 0.75,
      impact_score: 85.0,
      time_to_impact_minutes: 10080, // 7 days
      recommendations: ['Switch to GPT-4o-mini for routine tasks', 'Implement request batching'],
      automated_actions: ['Auto-route low-priority requests'],
      related_metrics: ['cost_efficiency'],
      metadata: {
        threshold: 0.5,
        potential_savings: '$350 per 1K generations',
      },
      created_at: '2024-08-24T12:00:00Z',
    },
    {
      id: 'insight_2',
      insight_type: 'anomaly_detection',
      severity: 'critical',
      confidence: 'very_high',
      title: 'Latency Spike Detected',
      description: 'Unusual latency increase detected in the last hour',
      current_value: 3500.0,
      predicted_value: 1200.0,
      impact_score: 95.0,
      time_to_impact_minutes: 30,
      recommendations: ['Check model provider status', 'Implement automatic failover'],
      automated_actions: ['Enable failover mechanism'],
      related_metrics: ['latency'],
      metadata: {
        z_score: 3.2,
        baseline: 1200.0,
      },
      created_at: '2024-08-24T12:00:00Z',
    },
  ];

  const mockPredictionsResponse = [
    {
      metric_type: 'latency',
      predicted_value: 1800.0,
      confidence_interval: {
        lower: 1600.0,
        upper: 2000.0,
      },
      prediction_horizon_hours: 24,
      confidence_level: 'high',
      factors: ['historical_trend', 'seasonal_pattern'],
      methodology: 'linear_regression',
    },
    {
      metric_type: 'cost',
      predicted_value: 0.42,
      confidence_interval: {
        lower: 0.38,
        upper: 0.46,
      },
      prediction_horizon_hours: 24,
      confidence_level: 'medium',
      factors: ['usage_pattern', 'model_mix'],
      methodology: 'time_series',
    },
  ];

  const mockRecommendationsResponse = [
    {
      title: 'Implement Multi-Model Cost Strategy',
      description: 'Route requests to cost-effective models based on content complexity',
      category: 'cost',
      estimated_impact: '35-50% cost reduction',
      effort_required: 'medium',
      priority_score: 85.0,
      implementation_steps: [
        'Implement content complexity scoring',
        'Create routing rules for different models',
        'Set up A/B testing framework',
      ],
      risks: ['Potential quality reduction for complex content'],
      success_metrics: ['Cost per generation < $0.25', 'Quality score maintained > 0.85'],
    },
    {
      title: 'Add Response Time Optimization',
      description: 'Reduce average response time through caching and parallel processing',
      category: 'performance',
      estimated_impact: '40% latency reduction',
      effort_required: 'high',
      priority_score: 75.0,
      implementation_steps: [
        'Implement intelligent caching layer',
        'Add parallel request processing',
      ],
      risks: ['Cache invalidation complexity'],
      success_metrics: ['Average latency < 1.5 seconds'],
    },
  ];

  it('renders the component correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSummaryResponse),
    });

    await act(async () => {
      render(<SmartInsightsPanel />);
    });

    expect(screen.getByText('Smart Performance Insights')).toBeInTheDocument();
    expect(
      screen.getByText('AI-powered insights, predictions, and optimization recommendations')
    ).toBeInTheDocument();
  });

  it('displays tab navigation', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSummaryResponse),
    });

    await act(async () => {
      render(<SmartInsightsPanel />);
    });

    const summaryTabs = screen.getAllByText('Summary');
    expect(summaryTabs.length).toBeGreaterThan(0);
    const smartInsightsTabs = screen.getAllByText('Smart Insights');
    expect(smartInsightsTabs.length).toBeGreaterThan(0);
    const predictionsTabs = screen.getAllByText('Predictions');
    expect(predictionsTabs.length).toBeGreaterThan(0);
    const recommendationsTabs = screen.getAllByText('Recommendations');
    expect(recommendationsTabs.length).toBeGreaterThan(0);
  });

  it('fetches and displays summary data on initial load', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSummaryResponse),
    });

    render(<SmartInsightsPanel />);

    await waitFor(() => {
      const overviewElements = screen.getAllByText('System Health Overview');
      expect(overviewElements.length).toBeGreaterThan(0);
      const scoreElements = screen.getAllByText('75');
      expect(scoreElements.length).toBeGreaterThan(0); // health score
      expect(screen.getByText('Good')).toBeInTheDocument(); // health status
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/v1/insights/summary', {
      headers: {
        Authorization: 'Bearer mock_token',
      },
    });
  });

  it('switches tabs and fetches appropriate data', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSummaryResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInsightsResponse),
      });

    render(<SmartInsightsPanel />);

    // Wait for initial summary load
    await waitFor(() => {
      expect(screen.getByText('System Health Overview')).toBeInTheDocument();
    });

    // Click on Smart Insights tab
    fireEvent.click(screen.getByText('Smart Insights'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/insights/smart'),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer mock_token',
          },
        })
      );
    });
  });

  it('displays insights correctly', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSummaryResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInsightsResponse),
      });

    render(<SmartInsightsPanel />);

    // Switch to insights tab
    fireEvent.click(screen.getByText('Smart Insights'));

    await waitFor(() => {
      expect(screen.getByText('High Cost Per Generation')).toBeInTheDocument();
      expect(screen.getByText('Latency Spike Detected')).toBeInTheDocument();
      expect(
        screen.getByText('Cost per generation is above optimal threshold')
      ).toBeInTheDocument();
    });

    // Check that severity badges are displayed
    const highElements = screen.getAllByText('HIGH');
    expect(highElements.length).toBeGreaterThan(0);
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
  });

  it('displays predictions correctly', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSummaryResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPredictionsResponse),
      });

    render(<SmartInsightsPanel />);

    // Switch to predictions tab
    fireEvent.click(screen.getByText('Predictions'));

    await waitFor(() => {
      expect(screen.getByText('Latency Prediction')).toBeInTheDocument();
      expect(screen.getByText('Cost Prediction')).toBeInTheDocument();
      expect(screen.getByText('1800.00')).toBeInTheDocument(); // predicted latency
      expect(screen.getByText('0.42')).toBeInTheDocument(); // predicted cost
    });
  });

  it('displays recommendations correctly', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSummaryResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecommendationsResponse),
      });

    render(<SmartInsightsPanel />);

    // Switch to recommendations tab
    fireEvent.click(screen.getByText('Recommendations'));

    await waitFor(() => {
      expect(screen.getByText('Implement Multi-Model Cost Strategy')).toBeInTheDocument();
      expect(screen.getByText('Add Response Time Optimization')).toBeInTheDocument();
      expect(screen.getByText('35-50% cost reduction')).toBeInTheDocument();
    });

    // Check implementation steps are shown
    const stepsElements = screen.getAllByText('Implementation Steps:');
    expect(stepsElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Implement content complexity scoring')).toBeInTheDocument();
  });

  it('allows filtering insights', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSummaryResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInsightsResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockInsightsResponse[0]]), // Filtered response
      });

    render(<SmartInsightsPanel />);

    // Switch to insights tab
    fireEvent.click(screen.getByText('Smart Insights'));

    await waitFor(() => {
      expect(screen.getByDisplayValue('All Types')).toBeInTheDocument();
    });

    // Change filter
    const typeSelect = screen.getByDisplayValue('All Types');
    fireEvent.change(typeSelect, { target: { value: 'cost_optimization' } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('insight_types=cost_optimization'),
        expect.any(Object)
      );
    });
  });

  it('submits feedback for insights', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSummaryResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInsightsResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success' }),
      });

    render(<SmartInsightsPanel />);

    // Switch to insights tab
    fireEvent.click(screen.getByText('Smart Insights'));

    await waitFor(() => {
      expect(screen.getByText('High Cost Per Generation')).toBeInTheDocument();
    });

    // Click helpful button
    const helpfulButton = screen.getAllByText('Helpful')[0];
    fireEvent.click(helpfulButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/insights/feedback?insight_id=insight_1&feedback_type=helpful',
        expect.objectContaining({
          method: 'POST',
          headers: {
            Authorization: 'Bearer mock_token',
          },
        })
      );
    });
  });

  it('handles loading states', () => {
    // Mock fetch to never resolve to test loading state
    mockFetch.mockImplementation(() => new Promise(() => {}));

    render(<SmartInsightsPanel />);

    expect(screen.getByText('Loading summary...')).toBeInTheDocument();
  });

  it('handles empty data states', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSummaryResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]), // Empty insights
      });

    render(<SmartInsightsPanel />);

    // Switch to insights tab
    fireEvent.click(screen.getByText('Smart Insights'));

    await waitFor(() => {
      expect(screen.getByText('No insights found for the selected criteria')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFetch.mockRejectedValueOnce(new Error('API Error')).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<SmartInsightsPanel />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch insights summary:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it('displays severity and confidence badges correctly', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSummaryResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInsightsResponse),
      });

    render(<SmartInsightsPanel />);

    // Switch to insights tab
    fireEvent.click(screen.getByText('Smart Insights'));

    await waitFor(() => {
      expect(screen.getByText('HIGH')).toBeInTheDocument();
      expect(screen.getByText('CRITICAL')).toBeInTheDocument();
      expect(screen.getByText('VERY HIGH')).toBeInTheDocument();
    });
  });

  it('shows automated actions when available', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSummaryResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInsightsResponse),
      });

    render(<SmartInsightsPanel />);

    // Switch to insights tab
    fireEvent.click(screen.getByText('Smart Insights'));

    await waitFor(() => {
      expect(screen.getByText('Automated Actions:')).toBeInTheDocument();
      expect(screen.getByText('Auto-route low-priority requests')).toBeInTheDocument();
      expect(screen.getByText('Enable failover mechanism')).toBeInTheDocument();
    });
  });

  it('shows risk information in recommendations', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSummaryResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecommendationsResponse),
      });

    render(<SmartInsightsPanel />);

    // Switch to recommendations tab
    fireEvent.click(screen.getByText('Recommendations'));

    await waitFor(() => {
      expect(screen.getByText('Risks to Consider:')).toBeInTheDocument();
      expect(
        screen.getByText('Potential quality reduction for complex content')
      ).toBeInTheDocument();
      expect(screen.getByText('Cache invalidation complexity')).toBeInTheDocument();
    });
  });
});
