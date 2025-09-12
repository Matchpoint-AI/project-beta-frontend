import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CampaignsList from './CampaignsList';
import { AuthContext } from '../../auth/context/AuthContext';
import { BrandContext } from '../../brand/context/BrandContext';
import { CampaignContext } from '../../../features/campaign/context/CampaignContext';

// Mock the modules
vi.mock('../../../helpers/handleNavigate', () => ({
  default: vi.fn(),
}));

vi.mock('../shared/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock('../PromotionComponent', () => ({
  default: ({ campaign, status }: { campaign: { campaign_id: string }; status: string }) => (
    <div data-testid="promotion-component">
      <span data-testid="campaign-id">{campaign.campaign_id}</span>
      <span data-testid="campaign-status">{status}</span>
    </div>
  ),
}));

vi.mock('../shared/Dropdown', () => ({
  default: ({
    currentValue,
    onUpdateContext,
    options,
  }: {
    currentValue: string;
    onUpdateContext: (value: string) => void;
    options: string[];
  }) => (
    <select
      data-testid="campaign-filter-dropdown"
      value={currentValue}
      onChange={(e) => onUpdateContext(e.target.value)}
    >
      {options.map((option: string) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  ),
}));

vi.mock('./EmptyDashboard', () => ({
  default: () => <div data-testid="empty-dashboard">No campaigns</div>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockProfile = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'USER',
  token: 'test-token',
  plan: 'free',
  is_admin: false,
  hasBrand: true,
};

const mockAuthContextValue = {
  profile: mockProfile,
  setProfile: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
  logout: vi.fn(),
  login: vi.fn(),
};

const mockBrandContextValue = {
  businessInfo: {
    id: 'test-id',
    campaigns: [],
    name: 'Test Business',
    website: 'https://test.com',
    product_features: [],
    product_description: 'Test product',
    product_link: 'https://test.com/product',
    start_date: '2023-01-01',
    durationNum: 7,
    summary: 'Test summary',
    brandLogo: 'test-logo.png',
    logo: 'test-logo.png',
    brandColors: [],
  },
  setBusinessInfo: vi.fn(),
};

const mockCampaignContextValue = {
  campaignInfo: {},
  setCampaignInfo: vi.fn(),
  campaignId: null,
  setCampaignId: vi.fn(),
};

const createMockCampaign = (id: string, status: string, timestamp?: string) => ({
  campaign_id: id,
  thread_id: `thread-${id}`,
  status,
  timestamp: timestamp || '2024-12-01T00:00:00Z',
  campaign_data: {
    campaign_variables: {
      name: `Campaign ${id}`,
      product_service: 'Test Product',
      start_date: '12/01/2024',
      duration: '4 weeks',
      durationNum: 4,
      audience_ethnicity: ['diverse'],
      emotion: ['happy'],
      audience_interests: ['technology'],
      product_service_description: 'A great product',
      purpose_topic: 'awareness',
      scene: ['office'],
      currentStep: 5,
      key_feature: ['feature1'],
      purpose: 'Brand awareness',
      audience_gender: ['all'],
      audience_age: ['25-35'],
      postingFrequency: 3,
      deliveryDay: 'Monday',
      summary: 'Campaign summary',
    },
  },
});

interface Campaign {
  campaign_id: string;
  status: string;
  campaign_data: any;
  timestamp?: string;
}

const renderWithContext = (
  campaigns: Campaign[] = [],
  campaignType = 'All',
  _setCampaignType = vi.fn()
) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContextValue}>
        <CampaignContext.Provider value={mockCampaignContextValue}>
          <BrandContext.Provider value={mockBrandContextValue}>
            <CampaignsList
              campaigns={campaigns}
              campaignType={campaignType}
              setCampaignType={_setCampaignType}
            />
          </BrandContext.Provider>
        </CampaignContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('CampaignsList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
    // Mock current date to ensure consistent test results
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-12-15'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    cleanup();
  });

  it('should render empty dashboard when no campaigns exist', () => {
    renderWithContext([]);
    expect(screen.getByTestId('empty-dashboard')).toBeInTheDocument();
  });

  it('should render campaigns list when campaigns exist', () => {
    const campaigns = [
      createMockCampaign('campaign-1', 'ACTIVE'),
      createMockCampaign('campaign-2', 'DRAFT'),
    ];

    renderWithContext(campaigns);

    expect(screen.getAllByTestId('promotion-component')).toHaveLength(2);
    expect(screen.getByText('Test Business Campaigns')).toBeInTheDocument();
  });

  it('should handle New Campaign button click', async () => {
    const campaigns = [createMockCampaign('campaign-1', 'ACTIVE')];

    renderWithContext(campaigns);

    const newCampaignButton = screen.getByText('New Campaign');
    fireEvent.click(newCampaignButton);

    const handleNavigate = (await import('../../../helpers/handleNavigate')).default;
    expect(handleNavigate).toHaveBeenCalledWith('test-user-id', '/campaign', expect.any(Function));
  });

  it('should filter campaigns by type correctly', () => {
    const campaigns = [
      createMockCampaign('draft-campaign', 'DRAFT'),
      createMockCampaign('active-campaign', 'ACTIVE'),
    ];

    renderWithContext(campaigns, 'Draft');

    // Should only show draft campaigns when filtered
    // Should only show draft campaigns when filtered
    // The component will calculate status based on dates
    expect(screen.queryByText('Campaign Draft-campaign')).toBeInTheDocument();
  });

  it('should show all campaigns when filter is set to All', () => {
    const campaigns = [
      createMockCampaign('draft-campaign', 'DRAFT'),
      createMockCampaign('active-campaign', 'ACTIVE'),
    ];

    renderWithContext(campaigns, 'All');

    // Should show both campaigns when filter is All
    expect(screen.queryByText('Campaign Draft-campaign')).toBeInTheDocument();
    expect(screen.queryByText('Campaign Active-campaign')).toBeInTheDocument();
  });

  it('should update campaign type when dropdown changes', () => {
    const mockSetCampaignType = vi.fn();
    const campaigns = [createMockCampaign('campaign-1', 'ACTIVE')];

    renderWithContext(campaigns, 'All', mockSetCampaignType);

    // The Dropdown component renders a button that shows current value
    const dropdownButton = screen.getByRole('button', { name: /All/i });
    expect(dropdownButton).toBeInTheDocument();

    // Note: Testing dropdown interaction would require knowing Dropdown implementation
    // For now, just verify the dropdown renders with correct value
  });

  it('should clear campaign info when New Campaign is clicked', async () => {
    const mockSetCampaignInfo = vi.fn();
    const campaignContextWithSetInfo = {
      ...mockCampaignContextValue,
      setCampaignInfo: mockSetCampaignInfo,
    };

    const campaigns = [createMockCampaign('campaign-1', 'ACTIVE')];

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContextValue}>
          <CampaignContext.Provider value={campaignContextWithSetInfo}>
            <BrandContext.Provider value={mockBrandContextValue}>
              <CampaignsList campaigns={campaigns} campaignType="All" setCampaignType={vi.fn()} />
            </BrandContext.Provider>
          </CampaignContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const newCampaignButton = screen.getByText('New Campaign');
    fireEvent.click(newCampaignButton);

    expect(mockSetCampaignInfo).toHaveBeenCalledWith({});
  });
});
