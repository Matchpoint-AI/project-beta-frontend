import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, beforeAll } from 'vitest';
import ServiceForm from './ServiceForm';
import { BrandContext } from '../../features/brand/context/BrandContext';
import { CampaignContext } from '../../context/CampaignContext';

// Extend window interface for test mocks
interface TestWindow extends Window {
  __mockScrapeProduct: ReturnType<typeof vi.fn>;
}

// Mock the scrapeProduct helper using local import
vi.mock('./scrapeProduct', () => ({
  default: vi.fn(),
}));

// Mock the posthog helper
vi.mock('../../helpers/posthog', () => ({
  default: {
    __loaded: false,
    capture: vi.fn(),
  },
}));

// Mock the AuthContext
vi.mock('../../features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    profile: { id: 'test-user-id' },
  }),
}));

// Mock the NextButton component
vi.mock('../../shared/components/buttons/NextButton', () => ({
  default: ({ text, formId, disabled }: { text: string; formId: string; disabled: boolean }) => (
    <button type="submit" form={formId} disabled={disabled} data-testid="next-button">
      {text}
    </button>
  ),
}));

// Mock the BackButton component
vi.mock('../../shared/components/buttons/BackButton', () => ({
  default: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} data-testid="back-button">
      Back
    </button>
  ),
}));

// Mock the Dropdown component
vi.mock('../../shared/components/ui/Dropdown', () => ({
  default: ({
    options,
    currentValue,
    onUpdateContext,
  }: {
    options: string[];
    currentValue: string;
    onUpdateContext: (value: string, index: number) => void;
  }) => (
    <select
      value={currentValue}
      onChange={(e) => onUpdateContext(e.target.value, 1)}
      data-testid="product-dropdown"
    >
      {options.map((option: string) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  ),
}));

// Mock the KeyFeatures component
vi.mock('./KeyFeatures', () => ({
  default: ({ pros }: { pros: string[] }) => (
    <div data-testid="key-features">
      {pros.map((pro: string, index: number) => (
        <div key={index} data-testid={`feature-${index}`}>
          {pro}
        </div>
      ))}
    </div>
  ),
}));

// Mock the WebsiteOwnership component
vi.mock('../WebsiteOwnership', () => ({
  default: () => <div data-testid="website-ownership" />,
}));

// Mock the ErrorToast component
vi.mock('../../shared/components/feedback/ErrorToast', () => ({
  default: ({ open, onClose, message }: { open: boolean; onClose: () => void; message: string }) =>
    open ? (
      <div data-testid="error-toast" onClick={onClose}>
        {message}
      </div>
    ) : null,
}));

// Mock the SparklesMessage component
vi.mock('../shared/SparklesMessage', () => ({
  SparklesMessage: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sparkles-message">{children}</div>
  ),
}));

// Mock the FormsContainer component
vi.mock('../shared/FormsContainer', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="forms-container">{children}</div>
  ),
}));

// Mock the FormInputBox component
vi.mock('../../shared/components/inputs/FormInputBox', () => ({
  default: ({
    children,
    styles,
    color,
  }: {
    children: React.ReactNode;
    styles?: { backgroundColor?: string };
    color: string;
  }) => (
    <div
      className="bg-gray-50 border rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 flex items-center justify-center gap-2"
      style={{ borderColor: color, backgroundColor: styles?.backgroundColor || 'white' }}
    >
      {children}
    </div>
  ),
}));

describe('ServiceForm', () => {
  const mockHandleNext = vi.fn();
  const mockHandleBack = vi.fn();
  const mockSetService = vi.fn();
  const mockSetBusinessInfo = vi.fn();
  const mockSetCampaignInfo = vi.fn();

  const mockBusinessInfo = {
    products: [
      {
        name: 'Test Product',
        description: 'Test Description',
        product_features: ['Feature 1', 'Feature 2'],
      },
    ],
    product_features: [],
    key_features: [],
  };

  const mockCampaignInfo = {
    product: '',
    productDescription: '',
    newProduct: false,
    productLink: '',
  };

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <BrandContext.Provider
        value={{ businessInfo: mockBusinessInfo, setBusinessInfo: mockSetBusinessInfo }}
      >
        <CampaignContext.Provider
          value={{ campaignInfo: mockCampaignInfo, setCampaignInfo: mockSetCampaignInfo }}
        >
          {component}
        </CampaignContext.Provider>
      </BrandContext.Provider>
    );
  };

  beforeAll(() => {
    // Provide a global mock for scrapeProduct
    (window as TestWindow).__mockScrapeProduct = vi.fn().mockResolvedValue({
      name: 'Test Product',
      description: 'Test Description',
      product_features: ['Feature 1', 'Feature 2'],
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock implementation for each test
    (window as TestWindow).__mockScrapeProduct.mockResolvedValue({
      name: 'Test Product',
      description: 'Test Description',
      product_features: ['Feature 1', 'Feature 2'],
    });
  });

  it('renders form with product dropdown when products exist', () => {
    renderWithProviders(
      <ServiceForm
        handleNext={mockHandleNext}
        handleBack={mockHandleBack}
        setService={mockSetService}
      />
    );

    expect(screen.getByText('Which service or product are you featuring?')).toBeInTheDocument();
    expect(screen.getAllByTestId('product-dropdown')[0]).toBeInTheDocument();
  });

  it('renders new product form when no products exist', () => {
    const emptyBusinessInfo = { products: [] };
    const newProductCampaignInfo = { ...mockCampaignInfo, newProduct: true };
    render(
      <BrandContext.Provider
        value={{ businessInfo: emptyBusinessInfo, setBusinessInfo: mockSetBusinessInfo }}
      >
        <CampaignContext.Provider
          value={{ campaignInfo: newProductCampaignInfo, setCampaignInfo: mockSetCampaignInfo }}
        >
          <ServiceForm
            handleNext={mockHandleNext}
            handleBack={mockHandleBack}
            setService={mockSetService}
          />
        </CampaignContext.Provider>
      </BrandContext.Provider>
    );
    expect(screen.getByText((text) => /service or product called/i.test(text))).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Name the new Product/Service')[0]).toBeInTheDocument();
  });

  it('handles product selection from dropdown', () => {
    renderWithProviders(
      <ServiceForm
        handleNext={mockHandleNext}
        handleBack={mockHandleBack}
        setService={mockSetService}
      />
    );

    const dropdown = screen.getAllByTestId('product-dropdown')[0];
    fireEvent.change(dropdown, { target: { value: 'Test Product' } });

    expect(mockSetService).toHaveBeenCalledWith('Test Product');
  });

  it('handles new product selection', () => {
    renderWithProviders(
      <ServiceForm
        handleNext={mockHandleNext}
        handleBack={mockHandleBack}
        setService={mockSetService}
      />
    );
    const dropdown = screen.getAllByTestId('product-dropdown')[0];
    fireEvent.change(dropdown, { target: { value: 'Add Product or Service' } });
    expect(screen.getAllByPlaceholderText('Name the new Product/Service')[0]).toBeInTheDocument();
  });

  it('handles product scraping with valid URL', async () => {
    renderWithProviders(
      <ServiceForm
        handleNext={mockHandleNext}
        handleBack={mockHandleBack}
        setService={mockSetService}
      />
    );

    const websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];
    const generateButton = screen.getAllByRole('button', { name: /generate/i })[0];

    fireEvent.change(websiteInput, { target: { value: 'https://example.com/product' } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('✓ Product information successfully extracted!')).toBeInTheDocument();
    });
  });

  it('handles product scraping error', async () => {
    (window as TestWindow).__mockScrapeProduct.mockRejectedValue(new Error('Scraping failed'));
    renderWithProviders(
      <ServiceForm
        handleNext={mockHandleNext}
        handleBack={mockHandleBack}
        setService={mockSetService}
      />
    );
    const websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];
    const generateButton = screen.getAllByRole('button', { name: /generate/i })[0];
    fireEvent.change(websiteInput, { target: { value: 'https://example.com/product' } });
    fireEvent.click(generateButton);
    await waitFor(() => {
      expect(screen.getByTestId('error-toast')).toBeInTheDocument();
    });
  });

  it('handles form submission with valid data', async () => {
    renderWithProviders(
      <ServiceForm
        handleNext={mockHandleNext}
        handleBack={mockHandleBack}
        setService={mockSetService}
      />
    );

    const websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];
    const generateButton = screen.getAllByRole('button', { name: /generate/i })[0];

    fireEvent.change(websiteInput, { target: { value: 'https://example.com/product' } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('✓ Product information successfully extracted!')).toBeInTheDocument();
    });

    const nextButton = screen.getAllByTestId('next-button')[0];
    fireEvent.click(nextButton);

    expect(mockHandleNext).toHaveBeenCalled();
  });

  it('handles back button click', () => {
    renderWithProviders(
      <ServiceForm
        handleNext={mockHandleNext}
        handleBack={mockHandleBack}
        setService={mockSetService}
      />
    );

    const backButton = screen.getAllByTestId('back-button')[0];
    fireEvent.click(backButton);
    expect(mockHandleBack).toHaveBeenCalled();
  });

  it('handles empty product features gracefully', async () => {
    (window as TestWindow).__mockScrapeProduct.mockResolvedValue({
      name: 'Test Product',
      description: 'Test Description',
      product_features: [],
    });
    renderWithProviders(
      <ServiceForm
        handleNext={mockHandleNext}
        handleBack={mockHandleBack}
        setService={mockSetService}
      />
    );
    const websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];
    const generateButton = screen.getAllByRole('button', { name: /generate/i })[0];
    fireEvent.change(websiteInput, { target: { value: 'https://example.com/product' } });
    fireEvent.click(generateButton);
    await waitFor(() => {
      expect(screen.getByText('✓ Product information successfully extracted!')).toBeInTheDocument();
    });
  });

  it('updates business info with scraped product data', async () => {
    renderWithProviders(
      <ServiceForm
        handleNext={mockHandleNext}
        handleBack={mockHandleBack}
        setService={mockSetService}
      />
    );

    const websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];
    const generateButton = screen.getAllByRole('button', { name: /generate/i })[0];

    fireEvent.change(websiteInput, { target: { value: 'https://example.com/product' } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('✓ Product information successfully extracted!')).toBeInTheDocument();
    });

    // Check that setBusinessInfo was called
    expect(mockSetBusinessInfo).toHaveBeenCalled();
  });

  it('validates form before submission', () => {
    renderWithProviders(
      <ServiceForm
        handleNext={mockHandleNext}
        handleBack={mockHandleBack}
        setService={mockSetService}
      />
    );

    // Clear both product name and product link inputs
    const productNameInput = screen.getAllByPlaceholderText('Name the new Product/Service')[0];
    const websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];

    fireEvent.change(productNameInput, { target: { value: '' } });
    fireEvent.change(websiteInput, { target: { value: '' } });

    // The next button should be disabled when both are empty
    const nextButton = screen.getAllByTestId('next-button')[0];
    expect(nextButton).toBeDisabled();

    // Fill in the product name - should enable the button
    fireEvent.change(productNameInput, { target: { value: 'Test Product' } });
    expect(nextButton).not.toBeDisabled();

    // Clear product name but add a link - should still be enabled
    fireEvent.change(productNameInput, { target: { value: '' } });
    fireEvent.change(websiteInput, { target: { value: 'https://example.com/product' } });
    expect(nextButton).not.toBeDisabled();
  });

  it('shows error when submitting without product name', () => {
    renderWithProviders(
      <ServiceForm
        handleNext={mockHandleNext}
        handleBack={mockHandleBack}
        setService={mockSetService}
      />
    );
    // Clear the product name input
    const productNameInput = screen.getAllByPlaceholderText('Name the new Product/Service')[0];
    fireEvent.change(productNameInput, { target: { value: '' } });
    const nextButton = screen.getAllByTestId('next-button')[0];
    fireEvent.click(nextButton);
    expect(
      screen.getByText((text) => /please at least provide a name of your product/i.test(text))
    ).toBeInTheDocument();
  });

  it('allows form submission with product link but no product name', () => {
    renderWithProviders(
      <ServiceForm
        handleNext={mockHandleNext}
        handleBack={mockHandleBack}
        setService={mockSetService}
      />
    );

    // Add a product link
    const websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];
    fireEvent.change(websiteInput, { target: { value: 'https://example.com/product' } });

    // Clear the product name input
    const productNameInput = screen.getAllByPlaceholderText('Name the new Product/Service')[0];
    fireEvent.change(productNameInput, { target: { value: '' } });

    // The next button should be enabled because we have a product link
    const nextButton = screen.getAllByTestId('next-button')[0];
    expect(nextButton).not.toBeDisabled();
  });

  it('shows informative button text when form is not valid', () => {
    renderWithProviders(
      <ServiceForm
        handleNext={mockHandleNext}
        handleBack={mockHandleBack}
        setService={mockSetService}
      />
    );

    // Clear all inputs
    const websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];
    const productNameInput = screen.getAllByPlaceholderText('Name the new Product/Service')[0];
    fireEvent.change(websiteInput, { target: { value: '' } });
    fireEvent.change(productNameInput, { target: { value: '' } });

    // The next button should show informative text
    const nextButton = screen.getAllByTestId('next-button')[0];
    expect(nextButton).toHaveTextContent('Enter product details to continue');
  });
});
