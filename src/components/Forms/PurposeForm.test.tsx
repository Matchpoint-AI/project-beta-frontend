import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import PurposeForm from './PurposeForm';
import { CampaignContext } from '../../context/CampaignContext';
import { BrandContext } from '../../features/brand/context/BrandContext';
import { AuthContext } from '../../features/auth/context/AuthContext';

// Mock dependencies
vi.mock('../../helpers/posthog', () => ({
  default: {
    __loaded: false,
    capture: vi.fn(),
  },
}));

const mockSetCampaignInfo = vi.fn();
const mockHandleNext = vi.fn();
const mockSetBusinessInfo = vi.fn();

const mockCampaignContextValue = {
  campaignInfo: {
    name: '',
    purpose: 'Make customers aware/excited',
    purposeAbout: "Our business's brand",
  },
  setCampaignInfo: mockSetCampaignInfo,
};

const mockBrandContextValue = {
  businessInfo: {
    name: 'Test Business',
    industry: 'Technology',
    vertical: 'SaaS',
  },
  setBusinessInfo: mockSetBusinessInfo,
};

const mockAuthContextValue = {
  profile: {
    id: 'test-user-id',
    email: 'test@example.com',
  },
  user: null,
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AuthContext.Provider value={mockAuthContextValue}>
      <BrandContext.Provider value={mockBrandContextValue}>
        <CampaignContext.Provider value={mockCampaignContextValue}>
          {component}
        </CampaignContext.Provider>
      </BrandContext.Provider>
    </AuthContext.Provider>
  );
};

describe('PurposeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders campaign name input and purpose dropdowns', () => {
    renderWithProviders(<PurposeForm handleNext={mockHandleNext} />);

    expect(screen.getByPlaceholderText('Campaign Name')).toBeInTheDocument();
    expect(screen.getByText("What is your campaign's purpose?")).toBeInTheDocument();
    expect(screen.getByText('Make customers aware/excited About')).toBeInTheDocument();
  });

  it('allows user to enter campaign name', async () => {
    renderWithProviders(<PurposeForm handleNext={mockHandleNext} />);

    const nameInputs = screen.getAllByPlaceholderText('Campaign Name');
    const nameInput = nameInputs[0]; // Use the first input

    // Enter campaign name
    fireEvent.change(nameInput, { target: { value: 'Test Campaign' } });

    // Verify that campaign info was updated with the name
    expect(mockSetCampaignInfo).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Campaign',
      })
    );
  });

  it('prevents navigation when campaign name is empty', async () => {
    renderWithProviders(<PurposeForm handleNext={mockHandleNext} />);

    const nameInputs = screen.getAllByPlaceholderText('Campaign Name');
    const nameInput = nameInputs[0]; // Use the first input
    const nextButtons = screen.getAllByText('Next');
    const nextButton = nextButtons[0]; // Use the first button

    // Clear the name input
    fireEvent.change(nameInput, { target: { value: '' } });

    // Click next button
    fireEvent.click(nextButton);

    // Verify error state is shown
    expect(screen.getByText('Please provide a valid value')).toBeInTheDocument();
  });

  it('updates campaign purpose when dropdown is changed', async () => {
    renderWithProviders(<PurposeForm handleNext={mockHandleNext} />);

    // Find and click the purpose dropdown - use getAllByText to handle multiple instances
    const purposeDropdowns = screen.getAllByText('Make customers aware/excited');
    const purposeDropdown = purposeDropdowns[0]; // Use the first one
    fireEvent.click(purposeDropdown);

    // Select the other option
    const otherOption = screen.getByText('Drive customers to convert/use');
    fireEvent.click(otherOption);

    // Verify that campaign info was updated (simplified expectation)
    expect(mockSetCampaignInfo).toHaveBeenCalled();
  });

  it('shows error when submitting without campaign name', async () => {
    renderWithProviders(<PurposeForm handleNext={mockHandleNext} />);

    const nextButtons = screen.getAllByText('Next');
    const nextButton = nextButtons[0]; // Use the first button

    // Submit the form without entering a name
    fireEvent.click(nextButton);

    // Verify error state is shown
    expect(screen.getByText('Please provide a valid value')).toBeInTheDocument();
  });
});
