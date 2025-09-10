var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
import { jsx as _jsx } from 'react/jsx-runtime';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, beforeAll } from 'vitest';
import ServiceForm from './ServiceForm';
import { BrandContext } from '../../context/BrandContext';
import { CampaignContext } from '../../context/CampaignContext';
// Mock the scrapeProduct helper using local import
vi.mock('./scrapeProduct', function () {
  return {
    default: vi.fn(),
  };
});
// Mock the posthog helper
vi.mock('../../helpers/posthog', function () {
  return {
    default: {
      __loaded: false,
      capture: vi.fn(),
    },
  };
});
// Mock the AuthContext
vi.mock('../../features/auth/context/AuthContext', function () {
  return {
    useAuth: function () {
      return {
        profile: { id: 'test-user-id' },
      };
    },
  };
});
// Mock the NextButton component
vi.mock('../../shared/components/buttons/NextButton', function () {
  return {
    default: function (_a) {
      var text = _a.text,
        formId = _a.formId,
        disabled = _a.disabled;
      return _jsx('button', {
        type: 'submit',
        form: formId,
        disabled: disabled,
        'data-testid': 'next-button',
        children: text,
      });
    },
  };
});
// Mock the BackButton component
vi.mock('../../shared/components/buttons/BackButton', function () {
  return {
    default: function (_a) {
      var onClick = _a.onClick;
      return _jsx('button', { onClick: onClick, 'data-testid': 'back-button', children: 'Back' });
    },
  };
});
// Mock the Dropdown component
vi.mock('../../shared/components/ui/Dropdown', function () {
  return {
    default: function (_a) {
      var options = _a.options,
        currentValue = _a.currentValue,
        onUpdateContext = _a.onUpdateContext;
      return _jsx('select', {
        value: currentValue,
        onChange: function (e) {
          return onUpdateContext(e.target.value, 1);
        },
        'data-testid': 'product-dropdown',
        children: options.map(function (option) {
          return _jsx('option', { value: option, children: option }, option);
        }),
      });
    },
  };
});
// Mock the KeyFeatures component
vi.mock('./KeyFeatures', function () {
  return {
    default: function (_a) {
      var pros = _a.pros;
      return _jsx('div', {
        'data-testid': 'key-features',
        children: pros.map(function (pro, index) {
          return _jsx('div', { 'data-testid': 'feature-'.concat(index), children: pro }, index);
        }),
      });
    },
  };
});
// Mock the WebsiteOwnership component
vi.mock('../WebsiteOwnership', function () {
  return {
    default: function () {
      return _jsx('div', { 'data-testid': 'website-ownership' });
    },
  };
});
// Mock the ErrorToast component
vi.mock('../../shared/components/feedback/ErrorToast', function () {
  return {
    default: function (_a) {
      var open = _a.open,
        onClose = _a.onClose,
        message = _a.message;
      return open
        ? _jsx('div', { 'data-testid': 'error-toast', onClick: onClose, children: message })
        : null;
    },
  };
});
// Mock the SparklesMessage component
vi.mock('../shared/SparklesMessage', function () {
  return {
    SparklesMessage: function (_a) {
      var children = _a.children;
      return _jsx('div', { 'data-testid': 'sparkles-message', children: children });
    },
  };
});
// Mock the FormsContainer component
vi.mock('../shared/FormsContainer', function () {
  return {
    default: function (_a) {
      var children = _a.children;
      return _jsx('div', { 'data-testid': 'forms-container', children: children });
    },
  };
});
// Mock the FormInputBox component
vi.mock('../../shared/components/inputs/FormInputBox', function () {
  return {
    default: function (_a) {
      var children = _a.children,
        styles = _a.styles,
        color = _a.color;
      return _jsx('div', {
        className:
          'bg-gray-50 border rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 flex items-center justify-center gap-2',
        style: {
          borderColor: color,
          backgroundColor:
            (styles === null || styles === void 0 ? void 0 : styles.backgroundColor) || 'white',
        },
        children: children,
      });
    },
  };
});
describe('ServiceForm', function () {
  var mockHandleNext = vi.fn();
  var mockHandleBack = vi.fn();
  var mockSetService = vi.fn();
  var mockSetBusinessInfo = vi.fn();
  var mockSetCampaignInfo = vi.fn();
  var mockBusinessInfo = {
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
  var mockCampaignInfo = {
    product: '',
    productDescription: '',
    newProduct: false,
    productLink: '',
  };
  var renderWithProviders = function (component) {
    return render(
      _jsx(BrandContext.Provider, {
        value: { businessInfo: mockBusinessInfo, setBusinessInfo: mockSetBusinessInfo },
        children: _jsx(CampaignContext.Provider, {
          value: { campaignInfo: mockCampaignInfo, setCampaignInfo: mockSetCampaignInfo },
          children: component,
        }),
      })
    );
  };
  beforeAll(function () {
    // Provide a global mock for scrapeProduct
    window.__mockScrapeProduct = vi.fn().mockResolvedValue({
      name: 'Test Product',
      description: 'Test Description',
      product_features: ['Feature 1', 'Feature 2'],
    });
  });
  beforeEach(function () {
    vi.clearAllMocks();
    // Reset the mock implementation for each test
    window.__mockScrapeProduct.mockResolvedValue({
      name: 'Test Product',
      description: 'Test Description',
      product_features: ['Feature 1', 'Feature 2'],
    });
  });
  it('renders form with product dropdown when products exist', function () {
    renderWithProviders(
      _jsx(ServiceForm, {
        handleNext: mockHandleNext,
        handleBack: mockHandleBack,
        setService: mockSetService,
      })
    );
    expect(screen.getByText('Which service or product are you featuring?')).toBeInTheDocument();
    expect(screen.getAllByTestId('product-dropdown')[0]).toBeInTheDocument();
  });
  it('renders new product form when no products exist', function () {
    var emptyBusinessInfo = { products: [] };
    var newProductCampaignInfo = __assign(__assign({}, mockCampaignInfo), { newProduct: true });
    render(
      _jsx(BrandContext.Provider, {
        value: { businessInfo: emptyBusinessInfo, setBusinessInfo: mockSetBusinessInfo },
        children: _jsx(CampaignContext.Provider, {
          value: { campaignInfo: newProductCampaignInfo, setCampaignInfo: mockSetCampaignInfo },
          children: _jsx(ServiceForm, {
            handleNext: mockHandleNext,
            handleBack: mockHandleBack,
            setService: mockSetService,
          }),
        }),
      })
    );
    expect(
      screen.getByText(function (text) {
        return /service or product called/i.test(text);
      })
    ).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Name the new Product/Service')[0]).toBeInTheDocument();
  });
  it('handles product selection from dropdown', function () {
    renderWithProviders(
      _jsx(ServiceForm, {
        handleNext: mockHandleNext,
        handleBack: mockHandleBack,
        setService: mockSetService,
      })
    );
    var dropdown = screen.getAllByTestId('product-dropdown')[0];
    fireEvent.change(dropdown, { target: { value: 'Test Product' } });
    expect(mockSetService).toHaveBeenCalledWith('Test Product');
  });
  it('handles new product selection', function () {
    renderWithProviders(
      _jsx(ServiceForm, {
        handleNext: mockHandleNext,
        handleBack: mockHandleBack,
        setService: mockSetService,
      })
    );
    var dropdown = screen.getAllByTestId('product-dropdown')[0];
    fireEvent.change(dropdown, { target: { value: 'Add Product or Service' } });
    expect(screen.getAllByPlaceholderText('Name the new Product/Service')[0]).toBeInTheDocument();
  });
  it('handles product scraping with valid URL', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var websiteInput, generateButton;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            renderWithProviders(
              _jsx(ServiceForm, {
                handleNext: mockHandleNext,
                handleBack: mockHandleBack,
                setService: mockSetService,
              })
            );
            websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];
            generateButton = screen.getAllByRole('button', { name: /generate/i })[0];
            fireEvent.change(websiteInput, { target: { value: 'https://example.com/product' } });
            fireEvent.click(generateButton);
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(
                  screen.getByText('✓ Product information successfully extracted!')
                ).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('handles product scraping error', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var websiteInput, generateButton;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            window.__mockScrapeProduct.mockRejectedValue(new Error('Scraping failed'));
            renderWithProviders(
              _jsx(ServiceForm, {
                handleNext: mockHandleNext,
                handleBack: mockHandleBack,
                setService: mockSetService,
              })
            );
            websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];
            generateButton = screen.getAllByRole('button', { name: /generate/i })[0];
            fireEvent.change(websiteInput, { target: { value: 'https://example.com/product' } });
            fireEvent.click(generateButton);
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByTestId('error-toast')).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('handles form submission with valid data', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var websiteInput, generateButton, nextButton;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            renderWithProviders(
              _jsx(ServiceForm, {
                handleNext: mockHandleNext,
                handleBack: mockHandleBack,
                setService: mockSetService,
              })
            );
            websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];
            generateButton = screen.getAllByRole('button', { name: /generate/i })[0];
            fireEvent.change(websiteInput, { target: { value: 'https://example.com/product' } });
            fireEvent.click(generateButton);
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(
                  screen.getByText('✓ Product information successfully extracted!')
                ).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            nextButton = screen.getAllByTestId('next-button')[0];
            fireEvent.click(nextButton);
            expect(mockHandleNext).toHaveBeenCalled();
            return [2 /*return*/];
        }
      });
    });
  });
  it('handles back button click', function () {
    renderWithProviders(
      _jsx(ServiceForm, {
        handleNext: mockHandleNext,
        handleBack: mockHandleBack,
        setService: mockSetService,
      })
    );
    var backButton = screen.getAllByTestId('back-button')[0];
    fireEvent.click(backButton);
    expect(mockHandleBack).toHaveBeenCalled();
  });
  it('handles empty product features gracefully', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var websiteInput, generateButton;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            window.__mockScrapeProduct.mockResolvedValue({
              name: 'Test Product',
              description: 'Test Description',
              product_features: [],
            });
            renderWithProviders(
              _jsx(ServiceForm, {
                handleNext: mockHandleNext,
                handleBack: mockHandleBack,
                setService: mockSetService,
              })
            );
            websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];
            generateButton = screen.getAllByRole('button', { name: /generate/i })[0];
            fireEvent.change(websiteInput, { target: { value: 'https://example.com/product' } });
            fireEvent.click(generateButton);
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(
                  screen.getByText('✓ Product information successfully extracted!')
                ).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('updates business info with scraped product data', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var websiteInput, generateButton;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            renderWithProviders(
              _jsx(ServiceForm, {
                handleNext: mockHandleNext,
                handleBack: mockHandleBack,
                setService: mockSetService,
              })
            );
            websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];
            generateButton = screen.getAllByRole('button', { name: /generate/i })[0];
            fireEvent.change(websiteInput, { target: { value: 'https://example.com/product' } });
            fireEvent.click(generateButton);
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(
                  screen.getByText('✓ Product information successfully extracted!')
                ).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            // Check that setBusinessInfo was called
            expect(mockSetBusinessInfo).toHaveBeenCalled();
            return [2 /*return*/];
        }
      });
    });
  });
  it('validates form before submission', function () {
    renderWithProviders(
      _jsx(ServiceForm, {
        handleNext: mockHandleNext,
        handleBack: mockHandleBack,
        setService: mockSetService,
      })
    );
    // Clear both product name and product link inputs
    var productNameInput = screen.getAllByPlaceholderText('Name the new Product/Service')[0];
    var websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];
    fireEvent.change(productNameInput, { target: { value: '' } });
    fireEvent.change(websiteInput, { target: { value: '' } });
    // The next button should be disabled when both are empty
    var nextButton = screen.getAllByTestId('next-button')[0];
    expect(nextButton).toBeDisabled();
    // Fill in the product name - should enable the button
    fireEvent.change(productNameInput, { target: { value: 'Test Product' } });
    expect(nextButton).not.toBeDisabled();
    // Clear product name but add a link - should still be enabled
    fireEvent.change(productNameInput, { target: { value: '' } });
    fireEvent.change(websiteInput, { target: { value: 'https://example.com/product' } });
    expect(nextButton).not.toBeDisabled();
  });
  it('shows error when submitting without product name', function () {
    renderWithProviders(
      _jsx(ServiceForm, {
        handleNext: mockHandleNext,
        handleBack: mockHandleBack,
        setService: mockSetService,
      })
    );
    // Clear the product name input
    var productNameInput = screen.getAllByPlaceholderText('Name the new Product/Service')[0];
    fireEvent.change(productNameInput, { target: { value: '' } });
    var nextButton = screen.getAllByTestId('next-button')[0];
    fireEvent.click(nextButton);
    expect(
      screen.getByText(function (text) {
        return /please at least provide a name of your product/i.test(text);
      })
    ).toBeInTheDocument();
  });
  it('allows form submission with product link but no product name', function () {
    renderWithProviders(
      _jsx(ServiceForm, {
        handleNext: mockHandleNext,
        handleBack: mockHandleBack,
        setService: mockSetService,
      })
    );
    // Add a product link
    var websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];
    fireEvent.change(websiteInput, { target: { value: 'https://example.com/product' } });
    // Clear the product name input
    var productNameInput = screen.getAllByPlaceholderText('Name the new Product/Service')[0];
    fireEvent.change(productNameInput, { target: { value: '' } });
    // The next button should be enabled because we have a product link
    var nextButton = screen.getAllByTestId('next-button')[0];
    expect(nextButton).not.toBeDisabled();
  });
  it('shows informative button text when form is not valid', function () {
    renderWithProviders(
      _jsx(ServiceForm, {
        handleNext: mockHandleNext,
        handleBack: mockHandleBack,
        setService: mockSetService,
      })
    );
    // Clear all inputs
    var websiteInput = screen.getAllByPlaceholderText('Link to Product/Service')[0];
    var productNameInput = screen.getAllByPlaceholderText('Name the new Product/Service')[0];
    fireEvent.change(websiteInput, { target: { value: '' } });
    fireEvent.change(productNameInput, { target: { value: '' } });
    // The next button should show informative text
    var nextButton = screen.getAllByTestId('next-button')[0];
    expect(nextButton).toHaveTextContent('Enter product details to continue');
  });
});
//# sourceMappingURL=ServiceForm.test.js.map
