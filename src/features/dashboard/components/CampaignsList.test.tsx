import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CampaignsList from './CampaignsList';
import { AuthContext } from '../../auth/context/AuthContext';
import { BrandContext } from '../../brand/context/BrandContext';
import { CampaignContext } from '../../../context/CampaignContext';

// Mock the modules
vi.mock('../../../helpers/handleNavigate', () => ({
  default: vi.fn(),
}));

vi.mock('../shared/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock('../PromotionComponent', () => ({
  default: ({ campaign, status }: any) => (
    <div data-testid="promotion-component">
      <span data-testid="campaign-id">{campaign.campaign_id}</span>
      <span data-testid="campaign-status">{status}</span>
    </div>
  ),
}));

vi.mock('../shared/Dropdown', () => ({
  default: ({ currentValue, onUpdateContext, options }: any) => (
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
    campaigns: [],
    name: 'Test Business',
  },
  setBusinessInfo: vi.fn(),
};

const mockCampaignContextValue = {
  campaignInfo: {},
  setCampaignInfo: vi.fn(),
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

const renderWithContext = (
  campaigns: any[] = [],
  campaignType = 'All',
  setCampaignType = vi.fn()
) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContextValue}>
        <CampaignContext.Provider value={mockCampaignContextValue}>
          <BrandContext.Provider value={mockBrandContextValue}>
            <CampaignsList
              campaigns={campaigns}
              campaignType={campaignType}
              setCampaignType={setCampaignType}
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

    const handleNavigate = (await import('../../helpers/handleNavigate')).default;
    expect(handleNavigate).toHaveBeenCalledWith('test-user-id', '/campaign', expect.any(Function));
  });

  it('should filter campaigns by type correctly', () => {
    const campaigns = [
      createMockCampaign('draft-campaign', 'DRAFT'),
      createMockCampaign('active-campaign', 'ACTIVE'),
    ];

    renderWithContext(campaigns, 'Draft');

    // Should only show draft campaigns when filtered
    const promotionComponents = screen.getAllByTestId('promotion-component');
    expect(promotionComponents).toHaveLength(1);
    expect(screen.getByTestId('campaign-id')).toHaveTextContent('draft-campaign');
  });

  it('should show all campaigns when filter is set to All', () => {
    const campaigns = [
      createMockCampaign('draft-campaign', 'DRAFT'),
      createMockCampaign('active-campaign', 'ACTIVE'),
    ];

    renderWithContext(campaigns, 'All');

    const promotionComponents = screen.getAllByTestId('promotion-component');
    expect(promotionComponents).toHaveLength(2);
  });

  it('should update campaign type when dropdown changes', () => {
    const mockSetCampaignType = vi.fn();
    const campaigns = [createMockCampaign('campaign-1', 'ACTIVE')];

    renderWithContext(campaigns, 'All', mockSetCampaignType);

    const dropdown = screen.getByTestId('campaign-filter-dropdown');
    fireEvent.change(dropdown, { target: { value: 'Draft' } });

    expect(mockSetCampaignType).toHaveBeenCalledWith('Draft');
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
