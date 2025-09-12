import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import EmptyDashboard from './EmptyDashboard';
import { CampaignContext } from '../../campaign/context/CampaignContext';
import { useAuth } from '../../auth/context/AuthContext';
import handleNavigate from '../../../helpers/handleNavigate';

// Mock dependencies
vi.mock('../../auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../../helpers/handleNavigate', () => ({
  default: vi.fn(),
}));

const mockNavigateFn = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigateFn,
  };
});

describe('EmptyDashboard', () => {
  const mockSetCampaignInfo = vi.fn();
  const mockSetCampaignId = vi.fn();
  const mockProfile = {
    id: 'user123',
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    // Arrange - Reset all mocks before each test
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ profile: mockProfile });
  });

  describe('Rendering', () => {
    it('should render the empty dashboard with all elements', () => {
      // Arrange
      const campaignContextValue = {
        setCampaignInfo: mockSetCampaignInfo,
        campaignInfo: {},
        campaignId: null,
        setCampaignId: mockSetCampaignId,
      };

      // Act
      render(
        <BrowserRouter>
          <CampaignContext.Provider value={campaignContextValue}>
            <EmptyDashboard />
          </CampaignContext.Provider>
        </BrowserRouter>
      );

      // Assert
      expect(screen.getByText('Ready to start your new campaign?')).toBeInTheDocument();
      expect(
        screen.getByText(/Super easy/)
      ).toBeInTheDocument();
      expect(screen.getByText(/and your content will be on/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Start my next campaign/i })).toBeInTheDocument();
    });

    it('should display the campaign creation image', () => {
      // Arrange
      const campaignContextValue = {
        setCampaignInfo: mockSetCampaignInfo,
        campaignInfo: {},
        campaignId: null,
        setCampaignId: mockSetCampaignId,
      };

      // Act
      render(
        <BrowserRouter>
          <CampaignContext.Provider value={campaignContextValue}>
            <EmptyDashboard />
          </CampaignContext.Provider>
        </BrowserRouter>
      );

      // Assert
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/src/assets/images/createCampaign.png');
    });

    it('should render the arrow icon in the button', () => {
      // Arrange
      const campaignContextValue = {
        setCampaignInfo: mockSetCampaignInfo,
        campaignInfo: {},
        campaignId: null,
        setCampaignId: mockSetCampaignId,
      };

      // Act
      render(
        <BrowserRouter>
          <CampaignContext.Provider value={campaignContextValue}>
            <EmptyDashboard />
          </CampaignContext.Provider>
        </BrowserRouter>
      );

      // Assert
      const button = screen.getByRole('button', { name: /Start my next campaign/i });
      const svgIcon = button.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
      expect(svgIcon).toHaveClass('w-6', 'h-6');
    });
  });

  describe('User Interactions', () => {
    it('should handle new campaign creation when button is clicked', () => {
      // Arrange
      const campaignContextValue = {
        setCampaignInfo: mockSetCampaignInfo,
        campaignInfo: {},
        campaignId: null,
        setCampaignId: mockSetCampaignId,
      };

      render(
        <BrowserRouter>
          <CampaignContext.Provider value={campaignContextValue}>
            <EmptyDashboard />
          </CampaignContext.Provider>
        </BrowserRouter>
      );

      // Act
      const startButton = screen.getByRole('button', { name: /Start my next campaign/i });
      fireEvent.click(startButton);

      // Assert
      expect(mockSetCampaignInfo).toHaveBeenCalledWith({});
      expect(handleNavigate).toHaveBeenCalledWith('user123', '/campaign', mockNavigateFn);
    });

    it('should reset campaign info before navigation', () => {
      // Arrange
      const existingCampaignInfo = {
        id: 'old-campaign',
        name: 'Old Campaign',
        description: 'Previous campaign data',
      };

      const campaignContextValue = {
        setCampaignInfo: mockSetCampaignInfo,
        campaignInfo: existingCampaignInfo,
        campaignId: 'old-campaign',
        setCampaignId: mockSetCampaignId,
      };

      render(
        <BrowserRouter>
          <CampaignContext.Provider value={campaignContextValue}>
            <EmptyDashboard />
          </CampaignContext.Provider>
        </BrowserRouter>
      );

      // Act
      const startButton = screen.getByRole('button', { name: /Start my next campaign/i });
      fireEvent.click(startButton);

      // Assert
      expect(mockSetCampaignInfo).toHaveBeenCalledWith({});
      expect(mockSetCampaignInfo).toHaveBeenCalledTimes(1);
    });

    it('should use empty string for user id when profile id is not available', () => {
      // Arrange
      (useAuth as any).mockReturnValue({ profile: { ...mockProfile, id: undefined } });

      const campaignContextValue = {
        setCampaignInfo: mockSetCampaignInfo,
        campaignInfo: {},
        campaignId: null,
        setCampaignId: mockSetCampaignId,
      };

      render(
        <BrowserRouter>
          <CampaignContext.Provider value={campaignContextValue}>
            <EmptyDashboard />
          </CampaignContext.Provider>
        </BrowserRouter>
      );

      // Act
      const startButton = screen.getByRole('button', { name: /Start my next campaign/i });
      fireEvent.click(startButton);

      // Assert
      expect(handleNavigate).toHaveBeenCalledWith('', '/campaign', mockNavigateFn);
    });

    it('should handle click with null profile gracefully', () => {
      // Arrange
      (useAuth as any).mockReturnValue({ profile: null });

      const campaignContextValue = {
        setCampaignInfo: mockSetCampaignInfo,
        campaignInfo: {},
        campaignId: null,
        setCampaignId: mockSetCampaignId,
      };

      render(
        <BrowserRouter>
          <CampaignContext.Provider value={campaignContextValue}>
            <EmptyDashboard />
          </CampaignContext.Provider>
        </BrowserRouter>
      );

      // Act
      const startButton = screen.getByRole('button', { name: /Start my next campaign/i });
      fireEvent.click(startButton);

      // Assert
      expect(mockSetCampaignInfo).toHaveBeenCalledWith({});
      expect(handleNavigate).toHaveBeenCalledWith('', '/campaign', mockNavigateFn);
    });
  });

  describe('Styling and Layout', () => {
    it('should have correct styling classes', () => {
      // Arrange
      const campaignContextValue = {
        setCampaignInfo: mockSetCampaignInfo,
        campaignInfo: {},
        campaignId: null,
        setCampaignId: mockSetCampaignId,
      };

      // Act
      render(
        <BrowserRouter>
          <CampaignContext.Provider value={campaignContextValue}>
            <EmptyDashboard />
          </CampaignContext.Provider>
        </BrowserRouter>
      );

      // Assert
      const container = screen.getByText('Ready to start your new campaign?').parentElement
        ?.parentElement;
      expect(container).toHaveClass(
        'w-full',
        'min-h-screen',
        'flex',
        'flex-row',
        'justify-center',
        'items-center'
      );

      const button = screen.getByRole('button', { name: /Start my next campaign/i });
      expect(button).toHaveClass('bg-[#5145CD]', 'text-white', 'py-4', 'px-2', 'rounded-lg');
    });

    it('should apply gradient styling to the heading', () => {
      // Arrange
      const campaignContextValue = {
        setCampaignInfo: mockSetCampaignInfo,
        campaignInfo: {},
        campaignId: null,
        setCampaignId: mockSetCampaignId,
      };

      // Act
      render(
        <BrowserRouter>
          <CampaignContext.Provider value={campaignContextValue}>
            <EmptyDashboard />
          </CampaignContext.Provider>
        </BrowserRouter>
      );

      // Assert
      const heading = screen.getByText('Ready to start your new campaign?');
      expect(heading).toHaveClass('text-2xl', 'font-semibold', 'leading-9', 'text-gradient');
    });

    it('should center align the description text', () => {
      // Arrange
      const campaignContextValue = {
        setCampaignInfo: mockSetCampaignInfo,
        campaignInfo: {},
        campaignId: null,
        setCampaignId: mockSetCampaignId,
      };

      // Act
      render(
        <BrowserRouter>
          <CampaignContext.Provider value={campaignContextValue}>
            <EmptyDashboard />
          </CampaignContext.Provider>
        </BrowserRouter>
      );

      // Assert
      const description = screen.getByText(/Super easy/);
      expect(description).toHaveClass(
        'text-gray-900',
        'text-xl',
        'font-normal',
        'text-center',
        'leading-8'
      );
    });
  });

  describe('Context Integration', () => {
    it('should receive setCampaignInfo from CampaignContext', () => {
      // Arrange
      const mockSetCampaignInfoSpy = vi.fn();
      const campaignContextValue = {
        setCampaignInfo: mockSetCampaignInfoSpy as any,
        campaignInfo: { id: 'test' },
        campaignId: 'test',
        setCampaignId: mockSetCampaignId as any,
      } as any;

      render(
        <BrowserRouter>
          <CampaignContext.Provider value={campaignContextValue}>
            <EmptyDashboard />
          </CampaignContext.Provider>
        </BrowserRouter>
      );

      // Act
      const startButton = screen.getByRole('button', { name: /Start my next campaign/i });
      fireEvent.click(startButton);

      // Assert
      expect(mockSetCampaignInfoSpy).toHaveBeenCalledWith({});
    });

    it('should work with different profile states', () => {
      // Arrange - Test with complete profile
      const completeProfile = {
        id: 'user456',
        name: 'Complete User',
        email: 'complete@example.com',
        plan: 'premium',
        role: 'admin',
      };

      (useAuth as any).mockReturnValue({ profile: completeProfile });

      const campaignContextValue = {
        setCampaignInfo: mockSetCampaignInfo,
        campaignInfo: {},
        campaignId: null,
        setCampaignId: mockSetCampaignId,
      };

      render(
        <BrowserRouter>
          <CampaignContext.Provider value={campaignContextValue}>
            <EmptyDashboard />
          </CampaignContext.Provider>
        </BrowserRouter>
      );

      // Act
      const startButton = screen.getByRole('button', { name: /Start my next campaign/i });
      fireEvent.click(startButton);

      // Assert
      expect(handleNavigate).toHaveBeenCalledWith('user456', '/campaign', mockNavigateFn);
    });

    it('should handle missing context gracefully', () => {
      // Arrange - Minimal context
      const minimalContext = {
        setCampaignInfo: mockSetCampaignInfo,
      };

      // Act & Assert - Should not throw
      expect(() => {
        render(
          <BrowserRouter>
            <CampaignContext.Provider value={minimalContext as any}>
              <EmptyDashboard />
            </CampaignContext.Provider>
          </BrowserRouter>
        );
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button with descriptive text', () => {
      // Arrange
      const campaignContextValue = {
        setCampaignInfo: mockSetCampaignInfo,
        campaignInfo: {},
        campaignId: null,
        setCampaignId: mockSetCampaignId,
      };

      // Act
      render(
        <BrowserRouter>
          <CampaignContext.Provider value={campaignContextValue}>
            <EmptyDashboard />
          </CampaignContext.Provider>
        </BrowserRouter>
      );

      // Assert
      const button = screen.getByRole('button', { name: /Start my next campaign/i });
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
      expect(button).toBeVisible();
    });

    it('should have proper heading hierarchy', () => {
      // Arrange
      const campaignContextValue = {
        setCampaignInfo: mockSetCampaignInfo,
        campaignInfo: {},
        campaignId: null,
        setCampaignId: mockSetCampaignId,
      };

      // Act
      render(
        <BrowserRouter>
          <CampaignContext.Provider value={campaignContextValue}>
            <EmptyDashboard />
          </CampaignContext.Provider>
        </BrowserRouter>
      );

      // Assert
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });

      expect(h1).toHaveTextContent('Ready to start your new campaign?');
      expect(h2).toHaveTextContent(/Super easy/);
    });
  });
});
