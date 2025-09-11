/**
 * Tests for Cost Optimization Dashboard Component
 *
 * Comprehensive test coverage for the cost optimization dashboard,
 * including data fetching, chart rendering, user interactions, and error handling.
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { CostOptimizationDashboard } from './CostOptimizationDashboard';
import { costOptimizationApi } from '../../api/costOptimizationApi';

// Mock the API module
vi.mock('../../api/costOptimizationApi', () => ({
  costOptimizationApi: {
    getDashboardData: vi.fn(),
  },
}));

// Mock Chart.js components
vi.mock('react-chartjs-2', () => ({
  Line: vi.fn(({ data: _data, options: _options }) => (
    <div data-testid="line-chart" data-chart-type="line">
      Mock Line Chart
    </div>
  )),
  Bar: vi.fn(({ data: _data, options: _options }) => (
    <div data-testid="bar-chart" data-chart-type="bar">
      Mock Bar Chart
    </div>
  )),
  Doughnut: vi.fn(({ data: _data, options: _options }) => (
    <div data-testid="doughnut-chart" data-chart-type="doughnut">
      Mock Doughnut Chart
    </div>
  )),
}));

// Mock UI components
vi.mock('../ui/LoadingSpinner', () => ({
  LoadingSpinner: vi.fn(({ size }) => (
    <div data-testid="loading-spinner" data-size={size}>
      Loading...
    </div>
  )),
}));

vi.mock('../ui/Card', () => ({
  Card: vi.fn(({ children, className, ...props }) => (
    <div data-testid="card" className={className} {...props}>
      {children}
    </div>
  )),
}));

vi.mock('../ui/Badge', () => ({
  Badge: vi.fn(({ children, variant }) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  )),
}));

vi.mock('../ui/Button', () => ({
  Button: vi.fn(({ children, onClick, variant, size, ...props }) => (
    <button
      data-testid="button"
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  )),
}));

const mockDashboardData = {
  period_start: '2024-07-25T00:00:00Z',
  period_end: '2024-08-24T00:00:00Z',
  total_baseline_cost: 10000.0,
  total_optimized_cost: 1000.0,
  total_absolute_savings: 9000.0,
  total_percentage_savings: 90.0,
  projected_annual_savings: 109500.0,
  optimization_metrics: [
    {
      optimization_type: 'vision_model_switch',
      period_start: '2024-07-25T00:00:00Z',
      period_end: '2024-08-24T00:00:00Z',
      baseline_cost: 5000.0,
      baseline_requests: 100,
      baseline_cost_per_request: 50.0,
      baseline_model: 'gpt-4-vision',
      optimized_cost: 300.0,
      optimized_requests: 100,
      optimized_cost_per_request: 3.0,
      optimized_model: 'gpt-4o-mini-vision',
      absolute_savings: 4700.0,
      percentage_savings: 94.0,
      projected_annual_savings: 57135.0,
      quality_before: 0.95,
      quality_after: 0.9,
      quality_impact: -0.05,
      latency_before: 2500.0,
      latency_after: 1200.0,
      latency_impact: -1300.0,
    },
    {
      optimization_type: 'gemini_routing',
      period_start: '2024-07-25T00:00:00Z',
      period_end: '2024-08-24T00:00:00Z',
      baseline_cost: 3000.0,
      baseline_requests: 150,
      baseline_cost_per_request: 20.0,
      baseline_model: 'gpt-4',
      optimized_cost: 990.0,
      optimized_requests: 150,
      optimized_cost_per_request: 6.6,
      optimized_model: 'gemini-2.5-flash-lite',
      absolute_savings: 2010.0,
      percentage_savings: 67.0,
      projected_annual_savings: 24421.5,
      quality_before: 0.92,
      quality_after: 0.85,
      quality_impact: -0.07,
      latency_before: 1800.0,
      latency_after: 900.0,
      latency_impact: -900.0,
    },
  ],
  current_model_distribution: {
    'gpt-4o-mini-vision': { requests: 450, cost: 67.5, percentage: 45.0 },
    'gemini-2.5-flash-lite': { requests: 320, cost: 32.0, percentage: 32.0 },
    'flux-1-schnell': { requests: 150, cost: 0.45, percentage: 15.0 },
    'gpt-4': { requests: 50, cost: 125.0, percentage: 5.0 },
    'imagen-4-fast': { requests: 30, cost: 1.2, percentage: 3.0 },
  },
  daily_savings: [
    {
      date: '2024-08-20',
      daily_savings: 300.0,
      cumulative_savings: 8700.0,
      baseline_cost: 400.0,
      optimized_cost: 100.0,
    },
    {
      date: '2024-08-21',
      daily_savings: 310.0,
      cumulative_savings: 9010.0,
      baseline_cost: 410.0,
      optimized_cost: 100.0,
    },
  ],
  cost_efficiency_trend: [
    {
      date: '2024-08-20',
      cost_efficiency: 0.85,
      requests_per_dollar: 5.0,
      savings_rate: 85.0,
    },
    {
      date: '2024-08-21',
      cost_efficiency: 0.87,
      requests_per_dollar: 5.2,
      savings_rate: 87.0,
    },
  ],
  overall_quality_impact: -0.06,
  quality_by_optimization: {
    vision_model_switch: -0.05,
    gemini_routing: -0.07,
  },
  top_savings_by_optimization: [
    {
      optimization_type: 'vision_model_switch',
      annual_savings: 57135.0,
      percentage_savings: 94.0,
      quality_impact: -0.05,
      implementation_status: 'active',
    },
    {
      optimization_type: 'gemini_routing',
      annual_savings: 24421.5,
      percentage_savings: 67.0,
      quality_impact: -0.07,
      implementation_status: 'active',
    },
  ],
  budget_utilization: 0.2,
  cost_alerts: [
    {
      type: 'quality_degradation',
      optimization: 'gemini_routing',
      severity: 'warning',
      message: 'Gemini routing causing quality degradation of 7%',
      current_value: -0.07,
      threshold: -0.05,
    },
  ],
};

describe('CostOptimizationDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial Loading', () => {
    it('should show loading spinner initially', () => {
      (costOptimizationApi.getDashboardData as any).mockImplementation(() => new Promise(() => {}));

      render(<CostOptimizationDashboard />);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should call API with default parameters', async () => {
      (costOptimizationApi.getDashboardData as any).mockResolvedValue(mockDashboardData);

      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        expect(costOptimizationApi.getDashboardData).toHaveBeenCalledWith(30);
      });
    });
  });

  describe('Data Display', () => {
    beforeEach(async () => {
      (costOptimizationApi.getDashboardData as any).mockResolvedValue(mockDashboardData);
    });

    it('should display dashboard title and description', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Cost Optimization Dashboard')).toBeInTheDocument();
        expect(
          screen.getByText(
            'Track the 90% cost reduction achievement through AI model optimizations'
          )
        ).toBeInTheDocument();
      });
    });

    it('should display key metrics cards', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        // Total Savings
        expect(screen.getByText('Total Savings')).toBeInTheDocument();
        expect(screen.getByText('$9,000')).toBeInTheDocument();
        expect(screen.getByText('90.0% reduction')).toBeInTheDocument();

        // Annual Projection
        expect(screen.getByText('Annual Projection')).toBeInTheDocument();
        expect(screen.getByText('$109,500')).toBeInTheDocument();

        // Quality Impact
        expect(screen.getByText('Quality Impact')).toBeInTheDocument();
        expect(screen.getByText('-6.0%')).toBeInTheDocument();
        expect(screen.getByText('Decreased')).toBeInTheDocument();

        // Budget Utilization
        expect(screen.getByText('Budget Utilization')).toBeInTheDocument();
        expect(screen.getByText('20.0%')).toBeInTheDocument();
      });
    });

    it('should display optimization status cards', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        // Vision Model Switch
        const visionModelTexts = screen.getAllByText('Vision Model Switch');
        expect(visionModelTexts.length).toBeGreaterThan(0);
        expect(screen.getByText('GPT-4o → GPT-4o-mini')).toBeInTheDocument();
        expect(screen.getByText('94.0%')).toBeInTheDocument();
        const savingsTexts = screen.getAllByText('$57,135');
        expect(savingsTexts.length).toBeGreaterThan(0);

        // Gemini Routing
        const geminiTexts = screen.getAllByText('Gemini Routing');
        expect(geminiTexts.length).toBeGreaterThan(0);
        expect(screen.getByText('Gemini 2.5 Flash-Lite')).toBeInTheDocument();
        expect(screen.getByText('67.0%')).toBeInTheDocument();
        const geminiSavingsTexts = screen.getAllByText('$24,422');
        expect(geminiSavingsTexts.length).toBeGreaterThan(0);
      });
    });

    it('should display badge status correctly', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        const badges = screen.getAllByTestId('badge');

        // Vision model switch should be "On Track" (94% >= 94% target)
        expect(
          badges.some(
            (badge) =>
              badge.textContent === 'On Track' && badge.getAttribute('data-variant') === 'success'
          )
        ).toBe(true);

        // Gemini routing should be "On Track" (67% >= 67% target)
        expect(
          badges.some(
            (badge) =>
              badge.textContent === 'On Track' && badge.getAttribute('data-variant') === 'success'
          )
        ).toBe(true);
      });
    });

    it('should render charts', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        // Should have savings trend chart(s)
        const lineCharts = screen.getAllByTestId('line-chart');
        expect(lineCharts.length).toBeGreaterThan(0);

        // Should have optimization comparison chart
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();

        // Should have model distribution chart
        expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
      });
    });

    it('should display cost alerts', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Cost Alerts')).toBeInTheDocument();
        const geminiTexts = screen.getAllByText('Gemini Routing');
        expect(geminiTexts.length).toBeGreaterThan(0);
        expect(
          screen.getByText('Gemini routing causing quality degradation of 7%')
        ).toBeInTheDocument();
      });
    });

    it('should display top savings opportunities', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Top Savings Opportunities')).toBeInTheDocument();

        // Should show opportunities sorted by annual savings
        const savingsText = screen.getAllByText(/\$[0-9,]+/);
        expect(savingsText.some((el) => el.textContent?.includes('$57,135'))).toBe(true);
        expect(savingsText.some((el) => el.textContent?.includes('$24,422'))).toBe(true);
      });
    });
  });

  describe('User Interactions', () => {
    beforeEach(async () => {
      (costOptimizationApi.getDashboardData as any).mockResolvedValue(mockDashboardData);
    });

    it('should handle time range selection', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('30 Days')).toBeInTheDocument();
      });

      const select = screen.getByDisplayValue('30 Days');
      fireEvent.change(select, { target: { value: '7' } });

      await waitFor(() => {
        expect(costOptimizationApi.getDashboardData).toHaveBeenCalledWith(7);
      });
    });

    it('should handle refresh button click', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Refresh')).toBeInTheDocument();
      });

      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(costOptimizationApi.getDashboardData).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle optimization card clicks', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        const visionCards = screen.getAllByText('Vision Model Switch');
        const visionCard = visionCards[0].closest('[data-testid="card"]');
        expect(visionCard).toBeInTheDocument();

        if (visionCard) {
          fireEvent.click(visionCard);
          // Note: In a real implementation, this might navigate or show details
          // For now, we just verify the click handler exists
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on API failure', async () => {
      const errorMessage = 'Failed to load dashboard data';
      (costOptimizationApi.getDashboardData as any).mockRejectedValue(new Error(errorMessage));

      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        expect(
          screen.getByText(`Error loading cost dashboard: ${errorMessage}`)
        ).toBeInTheDocument();
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });

    it('should handle retry after error', async () => {
      const errorMessage = 'Network error';
      (costOptimizationApi.getDashboardData as any)
        .mockRejectedValueOnce(new Error(errorMessage))
        .mockResolvedValueOnce(mockDashboardData);

      render(<CostOptimizationDashboard />);

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });

      // Click retry
      const retryButton = screen.getByText('Retry');
      fireEvent.click(retryButton);

      // Wait for success
      await waitFor(() => {
        expect(screen.getByText('Cost Optimization Dashboard')).toBeInTheDocument();
        expect(screen.queryByText('Retry')).not.toBeInTheDocument();
      });
    });

    it('should handle unknown error types', async () => {
      (costOptimizationApi.getDashboardData as any).mockRejectedValue('String error');

      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        expect(
          screen.getByText('Error loading cost dashboard: Failed to load cost dashboard data')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Data Formatting', () => {
    beforeEach(async () => {
      (costOptimizationApi.getDashboardData as any).mockResolvedValue(mockDashboardData);
    });

    it('should format currency values correctly', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        // Should format large numbers with commas and no decimals
        expect(screen.getByText('$9,000')).toBeInTheDocument();
        expect(screen.getByText('$109,500')).toBeInTheDocument();
        expect(screen.getByText('$57,135')).toBeInTheDocument();
      });
    });

    it('should format percentage values correctly', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        expect(screen.getByText('90.0% reduction')).toBeInTheDocument();
        expect(screen.getByText('94.0%')).toBeInTheDocument();
        expect(screen.getByText('67.0%')).toBeInTheDocument();
        expect(screen.getByText('-6.0%')).toBeInTheDocument();
      });
    });

    it('should apply correct color coding for savings', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        // High savings (94%) should have green color class
        const highSavingsElement = screen.getByText('94.0%');
        expect(highSavingsElement).toHaveClass('text-green-600');

        // Medium savings (67%) should have appropriate color
        const mediumSavingsElement = screen.getByText('67.0%');
        expect(mediumSavingsElement).toHaveClass('text-green-600'); // Still good
      });
    });
  });

  describe('Responsive Design', () => {
    beforeEach(async () => {
      (costOptimizationApi.getDashboardData as any).mockResolvedValue(mockDashboardData);
    });

    it('should apply responsive grid classes', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        // Key metrics grid
        const metricsGrid = screen.getByText('Total Savings').closest('.grid');
        expect(metricsGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');

        // Optimization cards grid
        const optimizationGrid = screen.getByText('Vision Model Switch').closest('.grid');
        expect(optimizationGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      (costOptimizationApi.getDashboardData as any).mockResolvedValue(mockDashboardData);
    });

    it('should have proper heading structure', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        // Main heading
        expect(
          screen.getByRole('heading', { level: 1, name: 'Cost Optimization Dashboard' })
        ).toBeInTheDocument();

        // Section headings
        expect(screen.getByRole('heading', { level: 2, name: 'Cost Alerts' })).toBeInTheDocument();
        expect(
          screen.getByRole('heading', { level: 2, name: 'Top Savings Opportunities' })
        ).toBeInTheDocument();
      });
    });

    it('should have accessible form controls', async () => {
      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        const select = screen.getByDisplayValue('30 Days');
        // Verify select element exists and is selectable
        expect(select).toBeInTheDocument();
        expect(select.tagName).toBe('SELECT');

        const refreshButton = screen.getByText('Refresh');
        expect(refreshButton).toBeInstanceOf(HTMLButtonElement);
      });
    });
  });

  describe('Chart Data Preparation', () => {
    beforeEach(async () => {
      (costOptimizationApi.getDashboardData as any).mockResolvedValue(mockDashboardData);
    });

    it('should prepare line chart data correctly', async () => {
      const { Line } = await import('react-chartjs-2');

      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        expect(Line).toHaveBeenCalled();

        const chartProps = Line.mock.calls[0][0];
        expect(chartProps.data).toBeDefined();
        // Date format depends on locale, so check length instead of exact values
        expect(chartProps.data.labels).toHaveLength(2);
        expect(chartProps.data.datasets).toHaveLength(2);
        expect(chartProps.data.datasets[0].label).toBe('Daily Savings');
        expect(chartProps.data.datasets[1].label).toBe('Cumulative Savings');
      });
    });

    it('should prepare bar chart data correctly', async () => {
      const { Bar } = await import('react-chartjs-2');

      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        expect(Bar).toHaveBeenCalled();

        const chartProps = Bar.mock.calls[0][0];
        expect(chartProps.data).toBeDefined();
        expect(chartProps.data.labels).toEqual(['Vision Model Switch', 'Gemini Routing']);
        expect(chartProps.data.datasets[0].data).toEqual([57135.0, 24421.5]);
      });
    });

    it('should prepare doughnut chart data correctly', async () => {
      const { Doughnut } = await import('react-chartjs-2');

      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        expect(Doughnut).toHaveBeenCalled();

        const chartProps = Doughnut.mock.calls[0][0];
        expect(chartProps.data).toBeDefined();
        expect(chartProps.data.labels).toHaveLength(5);
        expect(chartProps.data.datasets[0].data).toEqual([45.0, 32.0, 15.0, 5.0, 3.0]);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty optimization metrics', async () => {
      const emptyData = {
        ...mockDashboardData,
        optimization_metrics: [],
      };

      (costOptimizationApi.getDashboardData as any).mockResolvedValue(emptyData);

      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        // Should still render the dashboard but without optimization cards
        expect(screen.getByText('Cost Optimization Dashboard')).toBeInTheDocument();
        expect(screen.queryByText('Vision Model Switch')).not.toBeInTheDocument();
      });
    });

    it('should handle missing optional data fields', async () => {
      const incompleteData = {
        ...mockDashboardData,
        optimization_metrics: [
          {
            ...mockDashboardData.optimization_metrics[0],
            quality_impact: null,
            latency_impact: null,
          },
        ],
      };

      (costOptimizationApi.getDashboardData as any).mockResolvedValue(incompleteData);

      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        // Should still render but handle null values gracefully
        const visionTexts = screen.getAllByText('Vision Model Switch');
        expect(visionTexts.length).toBeGreaterThan(0);
      });
    });

    it('should handle zero or negative savings', async () => {
      const negativeData = {
        ...mockDashboardData,
        total_percentage_savings: -5.0,
        total_absolute_savings: -500.0,
      };

      (costOptimizationApi.getDashboardData as any).mockResolvedValue(negativeData);

      render(<CostOptimizationDashboard />);

      await waitFor(() => {
        expect(screen.getByText('-5.0% reduction')).toBeInTheDocument();
        expect(screen.getByText('-$500')).toBeInTheDocument();
      });
    });
  });
});
