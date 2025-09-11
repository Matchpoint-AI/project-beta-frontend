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
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { AuthContext } from '../../auth/context/AuthContext';
import { BrandContext } from '../../brand/context/BrandContext';
// Mock the modules
vi.mock('../../../helpers/getServiceURL', function () {
  return {
    getServiceURL: vi.fn(function () {
      return 'http://localhost:8080';
    }),
  };
});
vi.mock('../../../helpers/handleNavigate', function () {
  return {
    default: vi.fn(),
  };
});
vi.mock('../../../components/shared/Sidebar', function () {
  return {
    default: function () {
      return _jsx('div', { 'data-testid': 'sidebar', children: 'Sidebar' });
    },
  };
});
vi.mock('../components/CampaignsList', function () {
  return {
    default: function (_a) {
      var campaigns = _a.campaigns,
        campaignType = _a.campaignType;
      return _jsxs('div', {
        'data-testid': 'campaigns-list',
        children: [
          _jsx('span', { 'data-testid': 'campaign-count', children: campaigns.length }),
          _jsx('span', { 'data-testid': 'campaign-type', children: campaignType }),
        ],
      });
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
// Mock fetch
global.fetch = vi.fn();
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
var renderWithContext = function (authValue, brandValue) {
  if (authValue === void 0) {
    authValue = mockAuthContextValue;
  }
  if (brandValue === void 0) {
    brandValue = mockBrandContextValue;
  }
  return render(
    _jsx(BrowserRouter, {
      children: _jsx(AuthContext.Provider, {
        value: authValue,
        children: _jsx(BrandContext.Provider, { value: brandValue, children: _jsx(Dashboard, {}) }),
      }),
    })
  );
};
describe('Dashboard Component', function () {
  beforeEach(function () {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });
  afterEach(function () {
    vi.restoreAllMocks();
  });
  it('should render loading state when profile is not available', function () {
    var authValueWithoutProfile = __assign(__assign({}, mockAuthContextValue), {
      profile: undefined,
    });
    renderWithContext(authValueWithoutProfile);
    expect(screen.getByText('Loading your profile...')).toBeInTheDocument();
  });
  it('should render campaigns list when campaigns are available', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var brandValueWithCampaigns;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            brandValueWithCampaigns = __assign(__assign({}, mockBrandContextValue), {
              businessInfo: __assign(__assign({}, mockBrandContextValue.businessInfo), {
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
              }),
            });
            renderWithContext(mockAuthContextValue, brandValueWithCampaigns);
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByTestId('campaigns-list')).toBeInTheDocument();
                expect(screen.getByTestId('campaign-count')).toHaveTextContent('1');
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('should NOT automatically redirect when there is only one campaign', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var brandValueWithOneCampaign, handleNavigate;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            brandValueWithOneCampaign = __assign(__assign({}, mockBrandContextValue), {
              businessInfo: __assign(__assign({}, mockBrandContextValue.businessInfo), {
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
              }),
            });
            renderWithContext(mockAuthContextValue, brandValueWithOneCampaign);
            // Wait a bit to ensure no automatic navigation occurs
            return [
              4 /*yield*/,
              new Promise(function (resolve) {
                return setTimeout(resolve, 100);
              }),
            ];
          case 1:
            // Wait a bit to ensure no automatic navigation occurs
            _a.sent();
            return [4 /*yield*/, import('../helpers/handleNavigate')];
          case 2:
            handleNavigate = _a.sent().default;
            expect(handleNavigate).not.toHaveBeenCalled();
            return [2 /*return*/];
        }
      });
    });
  });
});
//# sourceMappingURL=Dashboard.test.js.map
