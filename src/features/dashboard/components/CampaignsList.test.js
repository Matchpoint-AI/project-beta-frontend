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
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CampaignsList from './CampaignsList';
import { AuthContext } from '../../auth/context/AuthContext';
import { BrandContext } from '../../../context/BrandContext';
import { CampaignContext } from '../../../context/CampaignContext';
// Mock the modules
vi.mock('../../helpers/handleNavigate', function () {
  return {
    default: vi.fn(),
  };
});
vi.mock('../shared/Sidebar', function () {
  return {
    default: function () {
      return _jsx('div', { 'data-testid': 'sidebar', children: 'Sidebar' });
    },
  };
});
vi.mock('../PromotionComponent', function () {
  return {
    default: function (_a) {
      var campaign = _a.campaign,
        status = _a.status;
      return _jsxs('div', {
        'data-testid': 'promotion-component',
        children: [
          _jsx('span', { 'data-testid': 'campaign-id', children: campaign.campaign_id }),
          _jsx('span', { 'data-testid': 'campaign-status', children: status }),
        ],
      });
    },
  };
});
vi.mock('../shared/Dropdown', function () {
  return {
    default: function (_a) {
      var currentValue = _a.currentValue,
        onUpdateContext = _a.onUpdateContext,
        options = _a.options;
      return _jsx('select', {
        'data-testid': 'campaign-filter-dropdown',
        value: currentValue,
        onChange: function (e) {
          return onUpdateContext(e.target.value);
        },
        children: options.map(function (option) {
          return _jsx('option', { value: option, children: option }, option);
        }),
      });
    },
  };
});
vi.mock('./EmptyDashboard', function () {
  return {
    default: function () {
      return _jsx('div', { 'data-testid': 'empty-dashboard', children: 'No campaigns' });
    },
  };
});
var mockNavigate = vi.fn();
vi.mock('react-router-dom', function () {
  return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, vi.importActual('react-router-dom')];
        case 1:
          actual = _a.sent();
          return [
            2 /*return*/,
            __assign(__assign({}, actual), {
              useNavigate: function () {
                return mockNavigate;
              },
            }),
          ];
      }
    });
  });
});
var mockProfile = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'USER',
  token: 'test-token',
  plan: 'free',
  is_admin: false,
  hasBrand: true,
};
var mockAuthContextValue = {
  profile: mockProfile,
  setProfile: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
  logout: vi.fn(),
  login: vi.fn(),
};
var mockBrandContextValue = {
  businessInfo: {
    campaigns: [],
    name: 'Test Business',
  },
  setBusinessInfo: vi.fn(),
};
var mockCampaignContextValue = {
  campaignInfo: {},
  setCampaignInfo: vi.fn(),
};
var createMockCampaign = function (id, status, timestamp) {
  return {
    campaign_id: id,
    thread_id: 'thread-'.concat(id),
    status: status,
    timestamp: timestamp || '2024-12-01T00:00:00Z',
    campaign_data: {
      campaign_variables: {
        name: 'Campaign '.concat(id),
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
  };
};
var renderWithContext = function (campaigns, campaignType, setCampaignType) {
  if (campaigns === void 0) {
    campaigns = [];
  }
  if (campaignType === void 0) {
    campaignType = 'All';
  }
  if (setCampaignType === void 0) {
    setCampaignType = vi.fn();
  }
  return render(
    _jsx(BrowserRouter, {
      children: _jsx(AuthContext.Provider, {
        value: mockAuthContextValue,
        children: _jsx(CampaignContext.Provider, {
          value: mockCampaignContextValue,
          children: _jsx(BrandContext.Provider, {
            value: mockBrandContextValue,
            children: _jsx(CampaignsList, {
              campaigns: campaigns,
              campaignType: campaignType,
              setCampaignType: setCampaignType,
            }),
          }),
        }),
      }),
    })
  );
};
describe('CampaignsList Component', function () {
  beforeEach(function () {
    vi.clearAllMocks();
    cleanup();
    // Mock current date to ensure consistent test results
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-12-15'));
  });
  afterEach(function () {
    vi.restoreAllMocks();
    vi.useRealTimers();
    cleanup();
  });
  it('should render empty dashboard when no campaigns exist', function () {
    renderWithContext([]);
    expect(screen.getByTestId('empty-dashboard')).toBeInTheDocument();
  });
  it('should render campaigns list when campaigns exist', function () {
    var campaigns = [
      createMockCampaign('campaign-1', 'ACTIVE'),
      createMockCampaign('campaign-2', 'DRAFT'),
    ];
    renderWithContext(campaigns);
    expect(screen.getAllByTestId('promotion-component')).toHaveLength(2);
    expect(screen.getByText('Test Business Campaigns')).toBeInTheDocument();
  });
  it('should handle New Campaign button click', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var campaigns, newCampaignButton, handleNavigate;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            campaigns = [createMockCampaign('campaign-1', 'ACTIVE')];
            renderWithContext(campaigns);
            newCampaignButton = screen.getByText('New Campaign');
            fireEvent.click(newCampaignButton);
            return [4 /*yield*/, import('../../helpers/handleNavigate')];
          case 1:
            handleNavigate = _a.sent().default;
            expect(handleNavigate).toHaveBeenCalledWith(
              'test-user-id',
              '/campaign',
              expect.any(Function)
            );
            return [2 /*return*/];
        }
      });
    });
  });
  it('should filter campaigns by type correctly', function () {
    var campaigns = [
      createMockCampaign('draft-campaign', 'DRAFT'),
      createMockCampaign('active-campaign', 'ACTIVE'),
    ];
    renderWithContext(campaigns, 'Draft');
    // Should only show draft campaigns when filtered
    var promotionComponents = screen.getAllByTestId('promotion-component');
    expect(promotionComponents).toHaveLength(1);
    expect(screen.getByTestId('campaign-id')).toHaveTextContent('draft-campaign');
  });
  it('should show all campaigns when filter is set to All', function () {
    var campaigns = [
      createMockCampaign('draft-campaign', 'DRAFT'),
      createMockCampaign('active-campaign', 'ACTIVE'),
    ];
    renderWithContext(campaigns, 'All');
    var promotionComponents = screen.getAllByTestId('promotion-component');
    expect(promotionComponents).toHaveLength(2);
  });
  it('should update campaign type when dropdown changes', function () {
    var mockSetCampaignType = vi.fn();
    var campaigns = [createMockCampaign('campaign-1', 'ACTIVE')];
    renderWithContext(campaigns, 'All', mockSetCampaignType);
    var dropdown = screen.getByTestId('campaign-filter-dropdown');
    fireEvent.change(dropdown, { target: { value: 'Draft' } });
    expect(mockSetCampaignType).toHaveBeenCalledWith('Draft');
  });
  it('should clear campaign info when New Campaign is clicked', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var mockSetCampaignInfo, campaignContextWithSetInfo, campaigns, newCampaignButton;
      return __generator(this, function (_a) {
        mockSetCampaignInfo = vi.fn();
        campaignContextWithSetInfo = __assign(__assign({}, mockCampaignContextValue), {
          setCampaignInfo: mockSetCampaignInfo,
        });
        campaigns = [createMockCampaign('campaign-1', 'ACTIVE')];
        render(
          _jsx(BrowserRouter, {
            children: _jsx(AuthContext.Provider, {
              value: mockAuthContextValue,
              children: _jsx(CampaignContext.Provider, {
                value: campaignContextWithSetInfo,
                children: _jsx(BrandContext.Provider, {
                  value: mockBrandContextValue,
                  children: _jsx(CampaignsList, {
                    campaigns: campaigns,
                    campaignType: 'All',
                    setCampaignType: vi.fn(),
                  }),
                }),
              }),
            }),
          })
        );
        newCampaignButton = screen.getByText('New Campaign');
        fireEvent.click(newCampaignButton);
        expect(mockSetCampaignInfo).toHaveBeenCalledWith({});
        return [2 /*return*/];
      });
    });
  });
});
//# sourceMappingURL=CampaignsList.test.js.map
