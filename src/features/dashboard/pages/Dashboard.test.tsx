import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { AuthContext } from '../../auth/context/AuthContext';
import { BrandContext } from '../../brand/context/BrandContext';

// Mock the modules
vi.mock('../../../helpers/getServiceURL', () => ({
  getServiceURL: vi.fn(() => 'http://localhost:8080'),
}));

vi.mock('../../../helpers/handleNavigate', () => ({
  default: vi.fn(),
}));

vi.mock('../../../components/shared/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock('../components/CampaignsList', () => ({
  default: ({ campaigns, campaignType }: { campaigns: Array<Record<string, unknown>>; campaignType: string; setCampaignType?: (type: string) => void }) => (
    <div data-testid="campaigns-list">
      <span data-testid="campaign-count">{campaigns.length}</span>
      <span data-testid="campaign-type">{campaignType}</span>
    </div>
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
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
    id: 'test-business-id',
    name: 'Test Business',
    website: 'https://testbusiness.com',
    campaigns: [],
    product_features: [],
    product_description: 'Test product description',
    product_link: 'https://testbusiness.com/product',
    start_date: '2024-01-01',
    durationNum: 4,
    summary: 'Test business summary',
    brandLogo: '',
    logo: '',
    brandColors: [],
  },
  setBusinessInfo: vi.fn(),
};

const renderWithContext = (
  authValue = mockAuthContextValue,
  brandValue = mockBrandContextValue
) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={authValue}>
        <BrandContext.Provider value={brandValue}>
          <Dashboard />
        </BrandContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render loading state when profile is not available', () => {
    const authValueWithoutProfile = {
      ...mockAuthContextValue,
      profile: undefined,
    };

    renderWithContext(authValueWithoutProfile);

    expect(screen.getByText('Loading your profile...')).toBeInTheDocument();
  });

  it('should render campaigns list when campaigns are available', async () => {
    const brandValueWithCampaigns = {
      ...mockBrandContextValue,
      businessInfo: {
        ...mockBrandContextValue.businessInfo,
        campaigns: [
          {
            campaign_id: 'test-campaign-1',
            campaign_data: {
              campaign_variables: {
                name: 'Test Campaign',
                product_service: 'Test Product',
                start_date: '12/01/2024',
                duration: '4 weeks',
              },
            },
          },
        ],
      },
    };

    renderWithContext(mockAuthContextValue, brandValueWithCampaigns);

    await waitFor(() => {
      expect(screen.getByTestId('campaigns-list')).toBeInTheDocument();
      expect(screen.getByTestId('campaign-count')).toHaveTextContent('1');
    });
  });

  it('should NOT automatically redirect when there is only one campaign', async () => {
    // This test ensures the fix for the automatic redirect issue
    const brandValueWithOneCampaign = {
      ...mockBrandContextValue,
      businessInfo: {
        ...mockBrandContextValue.businessInfo,
        campaigns: [
          {
            campaign_id: 'test-campaign-1',
            campaign_data: {
              campaign_variables: {
                name: 'Test Campaign',
                product_service: 'Test Product',
                start_date: '12/01/2024',
                duration: '4 weeks',
              },
            },
          },
        ],
      },
    };

    renderWithContext(mockAuthContextValue, brandValueWithOneCampaign);

    // Wait a bit to ensure no automatic navigation occurs
    await new Promise((resolve) => setTimeout(resolve, 100));

    // The handleNavigate mock should NOT have been called
    const handleNavigate = (await import('../helpers/handleNavigate')).default;
    expect(handleNavigate).not.toHaveBeenCalled();
  });
});
