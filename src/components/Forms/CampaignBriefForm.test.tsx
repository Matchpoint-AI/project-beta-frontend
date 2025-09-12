import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CampaignBriefForm from './CampaignBriefForm';
import { BrandContext } from '../../features/brand/context/BrandContext';
import { CampaignContext } from '../../features/campaign/context/CampaignContext';

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
interface FormsContainerProps {
  children: React.ReactNode;
  className?: string;
}

vi.mock('../../shared/components/layout/FormsContainer', () => ({
  default: ({ children, className }: FormsContainerProps) => (
    <div className={className} data-testid="forms-container">
      {children}
    </div>
  ),
}));

// Mock the BackButton component
interface BackButtonProps {
  onClick: () => void;
}

vi.mock('../../shared/components/buttons/BackButton', () => ({
  default: ({ onClick }: BackButtonProps) => (
    <button onClick={onClick} data-testid="back-button">
      Back
    </button>
  ),
}));

// Mock the ApproveButton component
interface ApproveButtonProps {
  double: boolean;
  handleApproveAll: () => void;
  loading: boolean;
}

vi.mock('../../shared/components/buttons/ApproveButton', () => ({
  default: ({ double, handleApproveAll, loading }: ApproveButtonProps) => (
    <button 
      onClick={handleApproveAll} 
      data-testid="approve-button"
      disabled={double || loading}
    >
      Approve
    </button>
  ),
}));

// Mock other components
interface CampaignSetupCompleteDialogProps {
  open: boolean;
  onClose: () => void;
  setCurrentStep: (step: number) => void;
}

vi.mock('../../features/campaign/components/CampaignSetupCompleteDialog', () => ({
  default: ({
    open,
    onClose,
    setCurrentStep: _setCurrentStep,
  }: CampaignSetupCompleteDialogProps) =>
    open ? (
      <div data-testid="campaign-setup-complete-dialog" onClick={onClose}>
        Campaign Setup Complete
      </div>
    ) : null,
}));

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

vi.mock('../../features/campaign/components/CustomDialog', () => ({
  default: ({ isOpen, onClose }: CustomDialogProps) =>
    isOpen ? (
      <div data-testid="custom-dialog" onClick={onClose}>
        Custom Dialog
      </div>
    ) : null,
}));

interface CampaignBriefTimingBlockProps {
  title: string;
  children: React.ReactNode;
}

vi.mock('../../features/campaign/components/CampaignBriefTimingBlock', () => ({
  default: ({ title, children }: CampaignBriefTimingBlockProps) => (
    <div data-testid="timing-block">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

interface CampaignDetailsBlockProps {
  title: string;
  text: string;
}

vi.mock('../../features/campaign/components/CampaignDetailsBlock', () => ({
  default: ({ title, text }: CampaignDetailsBlockProps) => (
    <div data-testid="campaign-details-block">
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  ),
}));

vi.mock('../../features/campaign/components/CampaignDetails', () => ({
  default: () => <div data-testid="campaign-details" />,
}));

vi.mock('../../features/campaign/components/CampaignSchedule', () => ({
  default: () => <div data-testid="campaign-schedule" />,
}));

// Mock dayjs
vi.mock('dayjs', () => ({
  default: (_date?: string | Date | number) => ({
    format: (format: string) => {
      if (format === 'MM/DD/YY') return '01/01/24';
      if (format === 'MMMM') return 'January';
      return '01/01/24';
    },
    add: () => ({
      format: (format: string) => {
        if (format === 'MM/DD/YY') return '01/15/24';
        if (format === 'MMMM') return 'January';
        return '01/15/24';
      },
      get: (unit: string) => {
        if (unit === 'D') return 1;
        return 1;
      },
    }),
    get: (unit: string) => {
      if (unit === 'D') return 1;
      return 1;
    },
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
    website: 'https://test.com',
    product_features: ['Feature 1', 'Feature 2'],
    product_description: 'Test product description',
    product_link: 'https://test.com/product',
    start_date: '2024-01-01',
    durationNum: 4,
    logo: 'test-logo.png',
    products: 'Test Products',
  };

  const mockCampaignInfo = {
    name: 'Test Campaign',
    created_at: '2024-01-01T00:00:00Z',
    duration: '4 weeks',
    durationNum: 4,
    startDate: '2024-01-01',
    start_date: '2024-01-01',
    product: 'Test Product',
    campaign_brief: false,
    campaign_type: 'awareness',
    frequency: 1,
    audienceGender: 'all',
    audienceInterests: 'technology',
    product_features: ['Feature 1', 'Feature 2'],
    summary: 'Test campaign summary',
  };

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <BrandContext.Provider value={{ businessInfo: mockBusinessInfo, setBusinessInfo: vi.fn() }}>
        <CampaignContext.Provider
          value={{
            campaignInfo: mockCampaignInfo,
            setCampaignInfo: vi.fn(),
            campaignId: 'test-campaign-id',
            setCampaignId: vi.fn(),
          }}
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
    }) as unknown as vi.Mock;
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

  it('calls parent handleApprove when approve button is clicked', async () => {
    // Arrange
    renderWithProviders(
      <CampaignBriefForm
        setCurrentStep={mockSetCurrentStep}
        handleBack={mockHandleBack}
        handleApprove={mockHandleApprove}
        setTiming={mockSetTiming}
        setService={mockSetService}
      />
    );

    // Act
    const approveButton = screen.getByTestId('approve-button');
    fireEvent.click(approveButton);

    // Wait for any async operations to complete
    await screen.findByTestId('campaign-setup-complete-dialog');

    // Assert - Should call the parent handleApprove function
    expect(mockHandleApprove).toHaveBeenCalled();
  });

  it('calls handleBack when back button is clicked', () => {
    // Arrange
    renderWithProviders(
      <CampaignBriefForm
        setCurrentStep={mockSetCurrentStep}
        handleBack={mockHandleBack}
        handleApprove={mockHandleApprove}
        setTiming={mockSetTiming}
        setService={mockSetService}
      />
    );

    // Act
    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);

    // Assert
    expect(mockHandleBack).toHaveBeenCalled();
  });

  it('shows campaign setup complete dialog after approval', async () => {
    // Arrange
    renderWithProviders(
      <CampaignBriefForm
        setCurrentStep={mockSetCurrentStep}
        handleBack={mockHandleBack}
        handleApprove={mockHandleApprove}
        setTiming={mockSetTiming}
        setService={mockSetService}
      />
    );

    // Act
    const approveButton = screen.getByTestId('approve-button');
    fireEvent.click(approveButton);

    // Assert - Should show the campaign setup complete dialog (wait for it to appear)
    await screen.findByTestId('campaign-setup-complete-dialog');
    expect(screen.getByTestId('campaign-setup-complete-dialog')).toBeInTheDocument();
  });

  it('displays campaign details correctly', () => {
    // Arrange & Act
    renderWithProviders(
      <CampaignBriefForm
        setCurrentStep={mockSetCurrentStep}
        handleBack={mockHandleBack}
        handleApprove={mockHandleApprove}
        setTiming={mockSetTiming}
        setService={mockSetService}
      />
    );

    // Assert - Should display the brand name
    expect(screen.getByText('Test Business')).toBeInTheDocument();

    // Assert - Should display the campaign name
    expect(screen.getByText('Test Campaign')).toBeInTheDocument();

    // Assert - Should display timing blocks
    expect(screen.getAllByTestId('timing-block')).toHaveLength(2);

    // Assert - Should display campaign details blocks (there can be multiple)
    expect(screen.getAllByTestId('campaign-details-block')).toHaveLength(2);
  });
});
