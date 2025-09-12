/**
 * Test suite for Performance Prediction Dashboard component.
 */

import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import PerformancePredictionDashboard from './PerformancePredictionDashboard';
import { useAuth } from '../../features/auth/context/AuthContext';

// Mock the dependencies
vi.mock('../../api/performanceApi', () => ({
  performanceApi: {
    recordMetric: vi.fn().mockResolvedValue({ success: true }),
    getMetricsSummary: vi.fn().mockResolvedValue({}),
    getCostAnalysis: vi.fn().mockResolvedValue({}),
    getActiveAlerts: vi.fn().mockResolvedValue([]),
    getHealthCheck: vi.fn().mockResolvedValue({ status: 'healthy' }),
  },
}));

vi.mock('../../features/auth/context/AuthContext');
// No chart mocking needed - using CSS-based visualizations

describe('PerformancePredictionDashboard', () => {
  const mockProfile = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
    token: 'test-token',
    plan: 'pro',
    is_admin: false,
    hasBrand: true,
  };

  const createMockAuthValue = (overrides = {}) => ({
    profile: mockProfile,
    setProfile: vi.fn(),
    isAuthenticated: true,
    isLoading: false,
    logout: vi.fn(),
    login: vi.fn(),
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue(createMockAuthValue());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Arrange
    (useAuth as any).mockReturnValue(createMockAuthValue({ isLoading: true }));

    // Act
    render(<PerformancePredictionDashboard />);

    // Assert
    expect(screen.getByText('Analyzing performance patterns...')).toBeInTheDocument();
    expect(screen.getByText('AI is predicting future metrics')).toBeInTheDocument();
  });

  it('renders dashboard header with title and time range buttons', async () => {
    // Arrange
    (useAuth as any).mockReturnValue(createMockAuthValue());

    // Act
    render(<PerformancePredictionDashboard />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Performance Predictions')).toBeInTheDocument();
      expect(
        screen.getByText('AI-powered insights for future campaign performance')
      ).toBeInTheDocument();
    }, { timeout: 3000 });

    // Check time range buttons
    ['24h', '7d', '30d', '90d'].forEach((range) => {
      expect(screen.getByRole('button', { name: range })).toBeInTheDocument();
    });
  });

  it('renders all prediction metric cards', async () => {
    // Arrange
    (useAuth as any).mockReturnValue(createMockAuthValue());

    // Act
    render(<PerformancePredictionDashboard />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Engagement Rate')).toBeInTheDocument();
      expect(screen.getByText('Reach')).toBeInTheDocument();
      // Use getAllByText for duplicated text since these appear in both metric cards and engagement distribution
      expect(screen.getAllByText('Comments')).toHaveLength(2);
      expect(screen.getAllByText('Shares')).toHaveLength(2);
      expect(screen.getByText('Impressions')).toBeInTheDocument();
      expect(screen.getByText('Click Rate')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays confidence scores for predictions', async () => {
    // Arrange
    const mockAuthValue = {
      profile: mockProfile,
      setProfile: vi.fn(),
      isAuthenticated: true,
      isLoading: false,
      logout: vi.fn(),
      login: vi.fn(),
    };
    (useAuth as any).mockReturnValue(mockAuthValue);

    // Act
    render(<PerformancePredictionDashboard />);

    // Assert
    await waitFor(() => {
      const confidenceChips = screen.getAllByText(/\d+% sure/);
      expect(confidenceChips.length).toBeGreaterThan(0);

      // Check that confidence scores are within valid range
      confidenceChips.forEach((chip) => {
        const confidence = parseInt(chip.textContent?.match(/\d+/)?.[0] || '0');
        expect(confidence).toBeGreaterThanOrEqual(0);
        expect(confidence).toBeLessThanOrEqual(100);
      });
    }, { timeout: 3000 });
  });

  it('renders performance trajectory chart', async () => {
    // Arrange
    (useAuth as any).mockReturnValue(createMockAuthValue());

    // Act
    render(<PerformancePredictionDashboard />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Performance Trajectory')).toBeInTheDocument();
      expect(screen.getByText('Actual')).toBeInTheDocument();
      // "Predicted" appears multiple times - in chart legend and in metric cards
      expect(screen.getAllByText('Predicted').length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  it('renders engagement distribution chart', async () => {
    // Arrange
    (useAuth as any).mockReturnValue(createMockAuthValue());

    // Act
    render(<PerformancePredictionDashboard />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Engagement Mix')).toBeInTheDocument();
      expect(screen.getByText('Optimize for:')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renders campaign predictions with recommendations', async () => {
    // Arrange
    (useAuth as any).mockReturnValue(createMockAuthValue());

    // Act
    render(<PerformancePredictionDashboard />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Summer Collection Launch')).toBeInTheDocument();
      expect(screen.getByText('Product Tutorial Series')).toBeInTheDocument();

      // Check for AI recommendations
      const recommendations = screen.getAllByText(/AI Recommendations/);
      expect(recommendations.length).toBeGreaterThan(0);

      // Check for specific recommendation content
      expect(screen.getByText(/Post at 2 PM on weekdays/)).toBeInTheDocument();
      expect(screen.getByText(/Create 60-second video tutorials/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays campaign metrics correctly', async () => {
    // Arrange
    (useAuth as any).mockReturnValue(createMockAuthValue());

    // Act
    render(<PerformancePredictionDashboard />);

    // Assert
    await waitFor(() => {
      // Check for metric labels
      expect(screen.getAllByText('Predicted Reach').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Engagement').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Conversions').length).toBeGreaterThan(0);

      // Check for metric values
      expect(screen.getByText('45.0K')).toBeInTheDocument(); // Predicted reach
      expect(screen.getByText('8.5%')).toBeInTheDocument(); // Engagement rate
      expect(screen.getByText('320')).toBeInTheDocument(); // Conversions
    }, { timeout: 3000 });
  });

  it('renders content performance forecast section', async () => {
    // Arrange
    (useAuth as any).mockReturnValue(createMockAuthValue());

    // Act
    render(<PerformancePredictionDashboard />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Content Type Performance Forecast')).toBeInTheDocument();
      expect(screen.getByText('Video Reels')).toBeInTheDocument();
      expect(screen.getByText('Product Photos')).toBeInTheDocument();
      expect(screen.getByText('User Stories')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays optimal posting times', async () => {
    // Arrange
    (useAuth as any).mockReturnValue(createMockAuthValue());

    // Act
    render(<PerformancePredictionDashboard />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Best time: 7:00 PM - 9:00 PM')).toBeInTheDocument();
      expect(screen.getByText('Best time: 12:00 PM - 2:00 PM')).toBeInTheDocument();
      expect(screen.getByText('Best time: 8:00 AM - 10:00 AM')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows suggested hashtags for content types', async () => {
    // Arrange
    (useAuth as any).mockReturnValue(createMockAuthValue());

    // Act
    render(<PerformancePredictionDashboard />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('#Trending')).toBeInTheDocument();
      expect(screen.getByText('#ProductLaunch')).toBeInTheDocument();
      expect(screen.getByText('#CustomerLove')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays performance optimization alert', async () => {
    // Arrange
    (useAuth as any).mockReturnValue(createMockAuthValue());

    // Act
    render(<PerformancePredictionDashboard />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Performance Optimization Opportunity')).toBeInTheDocument();
      expect(screen.getByText(/posting video content on Thursday evenings/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles time range selection', async () => {
    // Arrange
    const mockAuthValue = {
      profile: mockProfile,
      setProfile: vi.fn(),
      isAuthenticated: true,
      isLoading: false,
      logout: vi.fn(),
      login: vi.fn(),
    };
    (useAuth as any).mockReturnValue(mockAuthValue);

    // Act
    render(<PerformancePredictionDashboard />);

    // Assert
    await waitFor(() => {
      const sevenDayButton = screen.getByRole('button', { name: '7d' });
      const thirtyDayButton = screen.getByRole('button', { name: '30d' });

      // Initially 7d should be selected
      expect(sevenDayButton).toHaveClass('bg-purple-600');
      expect(thirtyDayButton).toHaveClass('bg-gray-100');

      // Click 30d button
      fireEvent.click(thirtyDayButton);

      // Check classes are updated
      expect(thirtyDayButton).toHaveClass('bg-purple-600');
      expect(sevenDayButton).toHaveClass('bg-gray-100');
    }, { timeout: 3000 });
  });

  it('displays trend indicators correctly', async () => {
    render(<PerformancePredictionDashboard />);

    await waitFor(() => {
      // Check for trend percentages
      const trendElements = screen.getAllByText(/\d+\.\d+%/);
      expect(trendElements.length).toBeGreaterThan(0);

      // Verify trend indicators are present
      trendElements.forEach((element) => {
        const percentage = parseFloat(element.textContent?.match(/\d+\.\d+/)?.[0] || '0');
        expect(percentage).toBeGreaterThan(0);
      });
    });
  });

  it('shows performance scores for campaigns', async () => {
    render(<PerformancePredictionDashboard />);

    await waitFor(() => {
      expect(screen.getByText('92')).toBeInTheDocument(); // Performance score
      expect(screen.getByText('78')).toBeInTheDocument(); // Performance score

      const performanceLabels = screen.getAllByText('Performance Score');
      expect(performanceLabels.length).toBeGreaterThan(0);
    });
  });

  it('displays AI insight in performance chart section', async () => {
    render(<PerformancePredictionDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/AI Insight:/)).toBeInTheDocument();
      expect(screen.getByText(/expected to increase by 32%/)).toBeInTheDocument();
    });
  });

  it('renders metric icons correctly', async () => {
    render(<PerformancePredictionDashboard />);

    await waitFor(() => {
      // Check that metric cards are rendered with proper structure
      const metricCards = document.querySelectorAll('.bg-white.rounded-xl');
      expect(metricCards.length).toBeGreaterThan(0);
    });
  });

  it('handles missing authentication gracefully', async () => {
    // Arrange
    (useAuth as any).mockReturnValue(createMockAuthValue({ 
      profile: null, 
      isAuthenticated: false 
    }));

    // Act
    render(<PerformancePredictionDashboard />);

    // Assert
    // Should still render the dashboard and complete loading
    await waitFor(() => {
      expect(screen.getByText('Performance Predictions')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays correct confidence score styling', async () => {
    // Arrange
    (useAuth as any).mockReturnValue(createMockAuthValue());

    // Act
    render(<PerformancePredictionDashboard />);

    // Assert
    await waitFor(() => {
      const highConfidenceChips = screen.getAllByText(/8[5-9]% confidence|9\d% confidence/);
      
      // At least some high confidence predictions should exist
      expect(highConfidenceChips.length).toBeGreaterThan(0);
      
      // Verify that confidence chips are displayed (including the "sure" format in metrics)
      const confidenceElements = screen.getAllByText(/\d+% sure|\d+% confidence/);
      expect(confidenceElements.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  it('shows performance improvement percentages', async () => {
    render(<PerformancePredictionDashboard />);

    await waitFor(() => {
      // Check for improvement indicators
      const improvements = screen.getAllByText(/\+\d+%/);
      expect(improvements.length).toBeGreaterThan(0);
    });
  });

  it('renders all three content performance cards', async () => {
    render(<PerformancePredictionDashboard />);

    await waitFor(() => {
      const contentSection = screen.getByText('Content Type Performance Forecast').parentElement;
      expect(contentSection).toBeInTheDocument();

      // Check that all three content types are present
      const contentTypes = ['Video Reels', 'Product Photos', 'User Stories'];
      contentTypes.forEach((type) => {
        expect(within(contentSection as HTMLElement).getByText(type)).toBeInTheDocument();
      });
    });
  });
});
