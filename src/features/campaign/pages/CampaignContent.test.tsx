import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CampaignContent from './CampaignContent';
import { AuthContext } from '../../auth/context/AuthContext';
import { CampaignContext } from '../../../features/campaign/context/CampaignContext';
import handleNavigate from '../../../helpers/handleNavigate';

// Mock the modules
vi.mock('../../../helpers/getServiceURL', () => ({
  getServiceURL: vi.fn(() => 'http://localhost:8080'),
}));

vi.mock('../../../helpers/calculateTiming', () => ({
  displayDuration: vi.fn(() => 'Dec 1 - Dec 28, 2024'),
  getPostingSchedule: vi.fn(() => 'Daily'),
}));

vi.mock('../../../helpers/formatters', () => ({
  capitalizeFirstLetterOfEachWord: vi.fn((str) => str),
}));

vi.mock('../../../helpers/analytics', () => ({
  trackContentReview: vi.fn(),
  trackCampaignPublish: vi.fn(),
}));

vi.mock('../../../helpers/handleNavigate', () => ({
  default: vi.fn(),
}));

vi.mock('../../../shared/components/layout/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock('../components/CampaignHeader', () => ({
  default: ({ handleNavigate }: { handleNavigate: () => void }) => (
    <div data-testid="campaign-header" onClick={handleNavigate}>
      Campaign Header
    </div>
  ),
}));

vi.mock('../components/ButtonGroup', () => ({
  default: () => <div data-testid="button-group">Button Group</div>,
}));

vi.mock('../components/ApprovePopup', () => ({
  default: () => <div data-testid="approve-popup">Approve Popup</div>,
}));

vi.mock('../components/TabWrapper', () => ({
  default: () => <div data-testid="tab-wrapper">Tab Wrapper</div>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: 'test-campaign-id' }),
  };
});

// Mock fetch
global.fetch = vi.fn();

const mockProfile = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'USER',
  token: 'test-token',
};

const mockAuthContextValue = {
  profile: mockProfile,
  setProfile: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
  logout: vi.fn(),
  login: vi.fn(),
};

const mockSetCampaignInfo = vi.fn();
const mockCampaignContextValue = {
  campaignInfo: {} as any,
  setCampaignInfo: mockSetCampaignInfo,
  campaignId: 'test-campaign-id',
  setCampaignId: vi.fn(),
};

const mockCampaignData = [
  {
    campaign_id: 'test-campaign-id',
    timestamp: '2024-12-01T00:00:00Z',
    campaign_data: {
      campaign_variables: {
        name: 'Test Campaign',
        product_service: 'Test Product',
        // frequency: 'daily', // Removed duplicate
        start_date: '12/01/2024',
        durationNum: 4,
        summary: 'Test summary',
        audience_ethnicity: ['Caucasian'],
        emotion: ['Happy'],
        audience_interests: ['Technology'],
        product_service_description: 'A test product',
        purpose_topic: 'Awareness',
        scene: ['Office'],
        key_feature: ['Feature 1', 'Feature 2'],
        purpose: 'To increase awareness',
        audience_gender: ['All'],
        audience_age: ['25-34'],
        postingFrequency: 1,
        deliveryDay: 'Monday',
        frequency: 1,
        duration: '4 weeks',
      },
    },
  },
];

const renderWithContext = (authValue = mockAuthContextValue) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={authValue}>
        <CampaignContext.Provider value={mockCampaignContextValue}>
          <CampaignContent />
        </CampaignContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('CampaignContent Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render campaign content when data is available', async () => {
    // Mock successful API responses
    (global.fetch as unknown as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCampaignData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    renderWithContext();

    await waitFor(() => {
      expect(screen.getByTestId('campaign-header')).toBeInTheDocument();
      expect(screen.getByTestId('tab-wrapper')).toBeInTheDocument();
    });
  });

  it('should handle authentication redirect', () => {
    const unauthenticatedAuthValue = {
      ...mockAuthContextValue,
      isAuthenticated: false,
    };

    renderWithContext(unauthenticatedAuthValue);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should navigate to campaign brief when header is clicked', async () => {
    // Mock successful API responses
    (global.fetch as unknown as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCampaignData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    renderWithContext();

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getAllByTestId('campaign-header')[0]).toBeInTheDocument();
    });

    // Click the campaign header (use the first one if multiple exist)
    const campaignHeaders = screen.getAllByTestId('campaign-header');
    fireEvent.click(campaignHeaders[0]);

    // Verify that setCampaignInfo was called with the correct data
    expect(mockSetCampaignInfo).toHaveBeenCalledWith(expect.any(Function));

    // Get the function passed to setCampaignInfo and call it to verify the data
    const setCampaignInfoCall = mockSetCampaignInfo.mock.calls[0][0];
    const result = setCampaignInfoCall({});

    // Verify the campaign data is set correctly
    expect(result).toMatchObject({
      summary: 'Test summary',
      name: 'Test Campaign',
      product: 'Test Product',
      audienceRace: ['Caucasian'],
      audienceEmotion: ['Happy'],
      audienceInterests: ['Technology'],
      productDescription: 'A test product',
      purpose: 'Awareness',
      locations: ['Office'],
      currentStep: 5,
      product_features: ['Feature 1', 'Feature 2'],
      purposeAbout: 'To increase awareness',
      audienceGender: ['All'],
      audienceAgeRange: ['25-34'],
      startDate: '12/01/2024',
      duration: '4 weeks',
      durationNum: 4,
      frequency: 1,
      postingFrequency: 1,
      deliveryDay: 'Monday',
      campaign_id: 'test-campaign-id',
      campaign_brief: true,
      created_at: '2024-12-01T00:00:00Z',
    });

    // Verify that handleNavigate was called with the correct parameters
    expect(handleNavigate).toHaveBeenCalledWith('test-user-id', '/campaign', mockNavigate);
  });
});
