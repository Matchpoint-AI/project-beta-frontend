import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import PromotionComponent from './PromotionComponent';
import { AuthContext } from '../../auth/context/AuthContext';
import { CampaignContext } from '../../../context/CampaignContext';

// Mock the modules
vi.mock('../../../helpers/handleNavigate', () => ({
  default: vi.fn(),
}));

vi.mock('./CardStats', () => ({
  default: ({ id }: { id: string }) => <div data-testid="card-stats">Stats for {id}</div>,
}));

interface Campaign {
  campaign_id: string;
  thread_id?: string;
  status: string;
  timestamp?: string;
  campaign_data?: {
    campaign_variables?: {
      [key: string]: unknown;
    };
  };
}

interface CampaignReviewButtonProps {
  campaign: Campaign;
}

vi.mock('./dashboard/CampaignReviewButton', () => ({
  default: ({ campaign: _campaign }: CampaignReviewButtonProps) => (
    <button data-testid="review-button">Review Campaign</button>
  ),
}));

interface CampaignThreadWinProps {
  open: boolean;
  onClose: () => void;
}

vi.mock('./campaign/CampaignThreadWin', () => ({
  default: ({ open, onClose: _onClose }: CampaignThreadWinProps) =>
    open ? <div data-testid="thread-win">Thread Window</div> : null,
}));

vi.mock('../hooks/useFetchThreadMessages', () => ({
  default: () => [
    [], // messages
    false, // openThreadWin
    vi.fn(), // setOpenThreadWin
    vi.fn(), // fetchMessages
    vi.fn(), // addMessage
    vi.fn(), // popMessage
  ],
}));

interface LinkProps {
  to: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ to, children, ...props }: LinkProps) => (
      <a href={to} data-testid="campaign-link" {...props}>
        {children}
      </a>
    ),
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

const mockCampaignContextValue = {
  campaignInfo: {},
  setCampaignInfo: vi.fn(),
  campaignId: null,
  setCampaignId: vi.fn(),
};

const mockCampaign = {
  campaign_id: 'test-campaign-1',
  thread_id: 'test-thread-1',
  status: 'active',
  campaign_data: {
    campaign_variables: {
      name: 'Test Campaign',
      product_service: 'Test Product',
      start_date: '12/01/2024',
      duration: '4 weeks',
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
};

const renderWithContext = (
  campaign = mockCampaign,
  status = 'Current',
  authValue = mockAuthContextValue,
  campaignValue = mockCampaignContextValue
) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={authValue}>
        <CampaignContext.Provider value={campaignValue}>
          <PromotionComponent campaign={campaign} status={status} />
        </CampaignContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('PromotionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should render campaign title correctly', () => {
    renderWithContext();
    const links = screen.getAllByTestId('campaign-link');
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].textContent).toContain('Test Campaign');
  });

  it('should render campaign status', () => {
    renderWithContext(mockCampaign, 'Current');
    // Status is rendered as 'Current' (not uppercase)
    expect(screen.getByText('Current')).toBeTruthy();
  });

  it('should render Link to campaign content for non-draft campaigns', () => {
    renderWithContext(mockCampaign, 'Current');
    const links = screen.getAllByTestId('campaign-link');
    expect(links[0].getAttribute('href')).toBe('/campaign/content/test-campaign-1');
  });

  it('should render clickable title for draft campaigns that calls handleDraft', async () => {
    const draftCampaign = { ...mockCampaign };
    const mockSetCampaignInfo = vi.fn();
    const draftCampaignContext = {
      ...mockCampaignContextValue,
      setCampaignInfo: mockSetCampaignInfo,
    };

    renderWithContext(draftCampaign, 'Draft', mockAuthContextValue, draftCampaignContext);

    const title = screen.getByText('Test Campaign');
    fireEvent.click(title);

    expect(mockSetCampaignInfo).toHaveBeenCalledWith(expect.any(Function));
    // Test the function passed to setCampaignInfo
    const callArg = mockSetCampaignInfo.mock.calls[0][0];
    const result = callArg({});
    expect(result).toEqual(
      expect.objectContaining({
        name: 'Test Campaign',
        product: 'Test Product',
        campaign_id: 'test-campaign-1',
        currentStep: 5,
      })
    );
  });

  it('should show Continue button for draft campaigns', () => {
    renderWithContext(mockCampaign, 'Draft');
    expect(Boolean(screen.getByText('Continue'))).toBe(true);
  });

  it('should show Content Library button for non-draft campaigns', () => {
    renderWithContext(mockCampaign, 'Current');
    expect(Boolean(screen.getByText('Content Library'))).toBe(true);
  });

  it('should navigate to content library when Content Library button is clicked', async () => {
    renderWithContext(mockCampaign, 'Current');
    const contentLibraryButton = screen.getByText('Content Library');
    fireEvent.click(contentLibraryButton);
    const handleNavigate = (await import('../../../helpers/handleNavigate')).default;
    expect(handleNavigate).toHaveBeenCalledWith(
      'test-user-id',
      '/campaign/content/test-campaign-1',
      expect.any(Function)
    );
  });

  it('should show correct status color for different statuses', () => {
    renderWithContext(mockCampaign, 'Current');
    const statusElement = screen.getByText('Current');
    expect(statusElement.className.includes('text-[#0E9F6E]')).toBe(true);
  });
});
