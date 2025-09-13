import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CampaignReviewButton from './CampaignReviewButton';
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

describe('CampaignReviewButton', () => {
  const mockSetCampaignInfo = vi.fn();
  const mockProfile = {
    id: 'user123',
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockCampaign = {
    campaign_id: 'campaign-123',
    thread_id: 'thread-456',
    status: 'active',
    timestamp: '2024-01-15T10:30:00Z',
    campaign_data: {
      campaign_variables: {
        name: 'Test Campaign',
        product_service: 'Test Product',
        start_date: '2024-02-01',
        duration: '30 days',
        audience_ethnicity: ['Asian', 'Hispanic'],
        emotion: ['happy', 'excited'],
        audience_interests: ['technology', 'fitness'],
        product_service_description: 'A revolutionary test product',
        purpose_topic: 'Brand awareness',
        scene: ['office', 'home'],
        currentStep: 3,
        key_feature: ['feature1', 'feature2'],
        purpose: 'Increase brand visibility',
        audience_gender: ['male', 'female'],
        audience_age: ['18-25', '26-35'],
        postingFrequency: 3,
        deliveryDay: 'Monday',
        summary: 'Campaign summary text',
        frequency: 5,
        durationNum: 30,
      },
    },
  };

  beforeEach(() => {
    // Arrange - Reset all mocks before each test
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ profile: mockProfile });
  });

  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BrowserRouter>
      <CampaignContext.Provider
        value={{
          setCampaignInfo: mockSetCampaignInfo,
          campaignInfo: {},
          campaignId: null,
          setCampaignId: vi.fn(),
        }}
      >
        {children}
      </CampaignContext.Provider>
    </BrowserRouter>
  );

  describe('Rendering', () => {
    it('should render the campaign review button with correct text', () => {
      // Arrange & Act
      render(
        <TestWrapper>
          <CampaignReviewButton campaign={mockCampaign} />
        </TestWrapper>
      );

      // Assert
      const button = screen.getByRole('button', { name: 'Campaign Brief' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Campaign Brief');
    });

    it('should have correct styling classes', () => {
      // Arrange & Act
      render(
        <TestWrapper>
          <CampaignReviewButton campaign={mockCampaign} />
        </TestWrapper>
      );

      // Assert
      const button = screen.getByRole('button', { name: 'Campaign Brief' });
      expect(button).toHaveClass(
        'text-[#5145CD]',
        'border',
        'self-end',
        'border-[#5145CD]',
        'text-sm',
        'px-2',
        'py-1',
        'rounded-md',
        'mr-2',
        'h-9'
      );
    });
  });

  describe('User Interactions', () => {
    it('should call setCampaignInfo with correct data when button is clicked', () => {
      // Arrange
      render(
        <TestWrapper>
          <CampaignReviewButton campaign={mockCampaign} />
        </TestWrapper>
      );

      // Act
      const button = screen.getByRole('button', { name: 'Campaign Brief' });
      fireEvent.click(button);

      // Assert
      expect(mockSetCampaignInfo).toHaveBeenCalledWith(expect.any(Function));
      expect(handleNavigate).toHaveBeenCalledWith('user123', '/campaign', mockNavigateFn);
    });

    it('should set campaign info with all campaign data fields', () => {
      // Arrange
      let capturedCampaignInfo: any;
      mockSetCampaignInfo.mockImplementation((callback) => {
        capturedCampaignInfo = callback({});
      });

      render(
        <TestWrapper>
          <CampaignReviewButton campaign={mockCampaign} />
        </TestWrapper>
      );

      // Act
      const button = screen.getByRole('button', { name: 'Campaign Brief' });
      fireEvent.click(button);

      // Assert
      expect(capturedCampaignInfo).toEqual({
        summary: 'Campaign summary text',
        name: 'Test Campaign',
        product: 'Test Product',
        audienceRace: ['Asian', 'Hispanic'],
        audienceEmotion: ['happy', 'excited'],
        audienceInterests: ['technology', 'fitness'],
        productDescription: 'A revolutionary test product',
        purpose: 'Brand awareness',
        locations: ['office', 'home'],
        currentStep: 5,
        product_features: ['feature1', 'feature2'],
        purposeAbout: 'Increase brand visibility',
        audienceGender: ['male', 'female'],
        audienceAgeRange: ['18-25', '26-35'],
        startDate: '2024-02-01',
        duration: '30 days',
        durationNum: 30,
        frequency: 5,
        postingFrequency: 3,
        deliveryDay: 'Monday',
        campaign_id: 'campaign-123',
        campaign_brief: true,
        created_at: '2024-01-15T10:30:00Z',
      });
    });

    it('should navigate to campaign page after setting campaign info', () => {
      // Arrange
      render(
        <TestWrapper>
          <CampaignReviewButton campaign={mockCampaign} />
        </TestWrapper>
      );

      // Act
      const button = screen.getByRole('button', { name: 'Campaign Brief' });
      fireEvent.click(button);

      // Assert
      expect(handleNavigate).toHaveBeenCalledWith('user123', '/campaign', mockNavigateFn);
      expect(handleNavigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle campaign with missing campaign_data gracefully', () => {
      // Arrange
      const campaignWithoutData = {
        campaign_id: 'campaign-123',
        status: 'active',
      } as any;

      render(
        <TestWrapper>
          <CampaignReviewButton campaign={campaignWithoutData} />
        </TestWrapper>
      );

      // Act
      const button = screen.getByRole('button', { name: 'Campaign Brief' });
      fireEvent.click(button);

      // Assert
      expect(mockSetCampaignInfo).toHaveBeenCalled();
      expect(handleNavigate).toHaveBeenCalledWith('user123', '/campaign', mockNavigateFn);
    });

    it('should handle campaign with missing campaign_variables gracefully', () => {
      // Arrange
      const campaignWithoutVariables = {
        campaign_id: 'campaign-123',
        status: 'active',
        campaign_data: {},
      } as any;

      render(
        <TestWrapper>
          <CampaignReviewButton campaign={campaignWithoutVariables} />
        </TestWrapper>
      );

      // Act
      const button = screen.getByRole('button', { name: 'Campaign Brief' });
      fireEvent.click(button);

      // Assert
      expect(mockSetCampaignInfo).toHaveBeenCalled();
      expect(handleNavigate).toHaveBeenCalledWith('user123', '/campaign', mockNavigateFn);
    });

    it('should use empty string for user id when profile id is not available', () => {
      // Arrange
      (useAuth as any).mockReturnValue({ profile: { ...mockProfile, id: undefined } });

      render(
        <TestWrapper>
          <CampaignReviewButton campaign={mockCampaign} />
        </TestWrapper>
      );

      // Act
      const button = screen.getByRole('button', { name: 'Campaign Brief' });
      fireEvent.click(button);

      // Assert
      expect(handleNavigate).toHaveBeenCalledWith('', '/campaign', mockNavigateFn);
    });

    it('should handle null profile gracefully', () => {
      // Arrange
      (useAuth as any).mockReturnValue({ profile: null });

      render(
        <TestWrapper>
          <CampaignReviewButton campaign={mockCampaign} />
        </TestWrapper>
      );

      // Act
      const button = screen.getByRole('button', { name: 'Campaign Brief' });
      fireEvent.click(button);

      // Assert
      expect(handleNavigate).toHaveBeenCalledWith('', '/campaign', mockNavigateFn);
    });

    it('should set currentStep to 5 regardless of original currentStep', () => {
      // Arrange
      const campaignWithDifferentStep = {
        ...mockCampaign,
        campaign_data: {
          campaign_variables: {
            ...mockCampaign.campaign_data.campaign_variables,
            currentStep: 2,
          },
        },
      };

      let capturedCampaignInfo: any;
      mockSetCampaignInfo.mockImplementation((callback) => {
        capturedCampaignInfo = callback({});
      });

      render(
        <TestWrapper>
          <CampaignReviewButton campaign={campaignWithDifferentStep} />
        </TestWrapper>
      );

      // Act
      const button = screen.getByRole('button', { name: 'Campaign Brief' });
      fireEvent.click(button);

      // Assert
      expect(capturedCampaignInfo.currentStep).toBe(5);
    });

    it('should always set campaign_brief to true', () => {
      // Arrange
      let capturedCampaignInfo: any;
      mockSetCampaignInfo.mockImplementation((callback) => {
        capturedCampaignInfo = callback({});
      });

      render(
        <TestWrapper>
          <CampaignReviewButton campaign={mockCampaign} />
        </TestWrapper>
      );

      // Act
      const button = screen.getByRole('button', { name: 'Campaign Brief' });
      fireEvent.click(button);

      // Assert
      expect(capturedCampaignInfo.campaign_brief).toBe(true);
    });
  });

  describe('Context Integration', () => {
    it('should merge campaign data with existing campaign info state', () => {
      // Arrange
      const existingCampaignInfo = {
        someExistingField: 'existing value',
        name: 'Old Name',
      };

      let capturedCampaignInfo: any;
      mockSetCampaignInfo.mockImplementation((callback) => {
        capturedCampaignInfo = callback(existingCampaignInfo);
      });

      render(
        <TestWrapper>
          <CampaignReviewButton campaign={mockCampaign} />
        </TestWrapper>
      );

      // Act
      const button = screen.getByRole('button', { name: 'Campaign Brief' });
      fireEvent.click(button);

      // Assert
      expect(capturedCampaignInfo).toEqual(
        expect.objectContaining({
          someExistingField: 'existing value',
          name: 'Test Campaign', // Should be overridden
          campaign_brief: true,
          currentStep: 5,
        })
      );
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button that is keyboard focusable', () => {
      // Arrange
      render(
        <TestWrapper>
          <CampaignReviewButton campaign={mockCampaign} />
        </TestWrapper>
      );

      // Act & Assert
      const button = screen.getByRole('button', { name: 'Campaign Brief' });
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
      expect(button).toBeVisible();
      expect(button.tagName).toBe('BUTTON');
    });

    it('should be clickable and respond to click events', () => {
      // Arrange
      render(
        <TestWrapper>
          <CampaignReviewButton campaign={mockCampaign} />
        </TestWrapper>
      );

      // Act
      const button = screen.getByRole('button', { name: 'Campaign Brief' });
      expect(() => fireEvent.click(button)).not.toThrow();

      // Assert
      expect(mockSetCampaignInfo).toHaveBeenCalled();
    });
  });
});
