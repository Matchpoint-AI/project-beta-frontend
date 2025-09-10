import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CampaignBriefForm from './CampaignBriefForm';
import { BrandContext } from '../../features/brand/context/BrandContext';
import { CampaignContext } from '../../context/CampaignContext';

// Mock the useAuth hook
vi.mock('../../features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    profile: { id: 'test-user-id' },
  }),
}));

// Mock the useNavigate hook
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock the FormsContainer component
vi.mock('../shared/FormsContainer', () => ({
  default: ({ children, className }: any) => (
    <div className={className} data-testid="forms-container">
      {children}
    </div>
  ),
}));

// Mock the BackButton component
vi.mock('../shared/Buttons/BackButton', () => ({
  default: ({ onClick }: any) => (
    <button onClick={onClick} data-testid="back-button">
      Back
    </button>
  ),
}));

// Mock the ApproveButton component
vi.mock('../shared/Buttons/ApproveButton', () => ({
  default: ({ onClick }: any) => (
    <button onClick={onClick} data-testid="approve-button">
      Approve
    </button>
  ),
}));

// Mock other components
vi.mock('../campaign/CampaignSetupCompleteDialog', () => ({
  default: ({ open, onClose, setCurrentStep }: any) =>
    open ? (
      <div data-testid="campaign-setup-complete-dialog" onClick={onClose}>
        Campaign Setup Complete
      </div>
    ) : null,
}));

vi.mock('../campaign/CustomDialog', () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="custom-dialog" onClick={onClose}>
        Custom Dialog
      </div>
    ) : null,
}));

vi.mock('../CampaignBriefTimingBlock', () => ({
  default: ({ title, children }: any) => (
    <div data-testid="timing-block">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

vi.mock('../campaign/CampaignDetailsBlock', () => ({
  default: ({ title, text }: any) => (
    <div data-testid="campaign-details-block">
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  ),
}));

vi.mock('../campaign/CampaignDetails', () => ({
  default: () => <div data-testid="campaign-details" />,
}));

vi.mock('../CampaignSchedule', () => ({
  default: () => <div data-testid="campaign-schedule" />,
}));

// Mock dayjs
vi.mock('dayjs', () => ({
  default: (date?: any) => ({
    format: (format: string) => '01/01/24',
    add: () => ({
      format: (format: string) => '01/15/24',
    }),
  }),
}));

// Mock the getServiceURL helper
vi.mock('../../helpers/getServiceURL', () => ({
  getServiceURL: (service: string) => `https://mock-${service}-service.com`,
}));

// Mock the analytics helper
vi.mock('../../helpers/analytics', () => ({
  trackCampaignBriefCreation: vi.fn(),
}));

// Mock the handleNavigate helper
vi.mock('../../helpers/handleNavigate', () => ({
  default: vi.fn(),
}));

describe('CampaignBriefForm', () => {
  const mockSetCurrentStep = vi.fn();
  const mockHandleBack = vi.fn();
  const mockHandleApprove = vi.fn();
  const mockSetTiming = vi.fn();
  const mockSetService = vi.fn();

  const mockBusinessInfo = {
    name: 'Test Business',
    logo: 'test-logo.png',
  };

  const mockCampaignInfo = {
    name: 'Test Campaign',
    created_at: '2024-01-01T00:00:00Z',
    duration: '4 weeks',
    durationNum: 4,
    startDate: '2024-01-01',
    product: 'Test Product',
    campaign_brief: false,
    campaign_type: 'awareness',
  };

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <BrandContext.Provider value={{ businessInfo: mockBusinessInfo, setBusinessInfo: vi.fn() }}>
        <CampaignContext.Provider
          value={{ campaignInfo: mockCampaignInfo, setCampaignInfo: vi.fn() }}
        >
          {component}
        </CampaignContext.Provider>
      </BrandContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock fetch for the generateSummary call
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          response: {
            choices: [
              {
                message: {
                  content: 'Test campaign summary',
                },
              },
            ],
          },
        }),
    });
  });

  it('renders campaign brief form correctly', () => {
    renderWithProviders(
      <CampaignBriefForm
        setCurrentStep={mockSetCurrentStep}
        handleBack={mockHandleBack}
        handleApprove={mockHandleApprove}
        setTiming={mockSetTiming}
        setService={mockSetService}
      />
    );

    expect(screen.getByTestId('forms-container')).toBeInTheDocument();
    expect(screen.getByText('Test Business')).toBeInTheDocument();
    expect(screen.getByText('Test Campaign')).toBeInTheDocument();
  });

  it('calls parent handleApprove when approve button is clicked', () => {
    renderWithProviders(
      <CampaignBriefForm
        setCurrentStep={mockSetCurrentStep}
        handleBack={mockHandleBack}
        handleApprove={mockHandleApprove}
        setTiming={mockSetTiming}
        setService={mockSetService}
      />
    );

    const approveButton = screen.getByTestId('approve-button');
    fireEvent.click(approveButton);

    // Should call the parent handleApprove function
    expect(mockHandleApprove).toHaveBeenCalled();
  });

  it('calls handleBack when back button is clicked', () => {
    renderWithProviders(
      <CampaignBriefForm
        setCurrentStep={mockSetCurrentStep}
        handleBack={mockHandleBack}
        handleApprove={mockHandleApprove}
        setTiming={mockSetTiming}
        setService={mockSetService}
      />
    );

    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);

    expect(mockHandleBack).toHaveBeenCalled();
  });

  it('shows campaign setup complete dialog after approval', () => {
    renderWithProviders(
      <CampaignBriefForm
        setCurrentStep={mockSetCurrentStep}
        handleBack={mockHandleBack}
        handleApprove={mockHandleApprove}
        setTiming={mockSetTiming}
        setService={mockSetService}
      />
    );

    const approveButton = screen.getByTestId('approve-button');
    fireEvent.click(approveButton);

    // Should show the campaign setup complete dialog
    expect(screen.getByTestId('campaign-setup-complete-dialog')).toBeInTheDocument();
  });

  it('displays campaign details correctly', () => {
    renderWithProviders(
      <CampaignBriefForm
        setCurrentStep={mockSetCurrentStep}
        handleBack={mockHandleBack}
        handleApprove={mockHandleApprove}
        setTiming={mockSetTiming}
        setService={mockSetService}
      />
    );

    // Should display the brand name
    expect(screen.getByText('Test Business')).toBeInTheDocument();

    // Should display the campaign name
    expect(screen.getByText('Test Campaign')).toBeInTheDocument();

    // Should display timing blocks
    expect(screen.getAllByTestId('timing-block')).toHaveLength(2);

    // Should display campaign details block for the product
    expect(screen.getByTestId('campaign-details-block')).toBeInTheDocument();
  });
});
