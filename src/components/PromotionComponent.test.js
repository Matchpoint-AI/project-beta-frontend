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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
import { jsxs as _jsxs, jsx as _jsx } from 'react/jsx-runtime';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import PromotionComponent from './PromotionComponent';
import { AuthContext } from '../features/auth/context/AuthContext';
import { CampaignContext } from '../context/CampaignContext';
// Mock the modules
vi.mock('../helpers/handleNavigate', function () {
  return {
    default: vi.fn(),
  };
});
vi.mock('../features/dashboard/components/CardStats', function () {
  return {
    default: function (_a) {
      var id = _a.id;
      return _jsxs('div', { 'data-testid': 'card-stats', children: ['Stats for ', id] });
    },
  };
});
vi.mock('./dashboard/CampaignReviewButton', function () {
  return {
    default: function (_a) {
      var _campaign = _a.campaign;
      return _jsx('button', { 'data-testid': 'review-button', children: 'Review Campaign' });
    },
  };
});
vi.mock('./campaign/CampaignThreadWin', function () {
  return {
    default: function (_a) {
      var open = _a.open,
        _onClose = _a.onClose;
      return open ? _jsx('div', { 'data-testid': 'thread-win', children: 'Thread Window' }) : null;
    },
  };
});
vi.mock('../hooks/useFetchThreadMessages', function () {
  return {
    default: function () {
      return [
        [], // messages
        false, // openThreadWin
        vi.fn(), // setOpenThreadWin
        vi.fn(), // fetchMessages
        vi.fn(), // addMessage
        vi.fn(), // popMessage
      ];
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
              Link: function (_a) {
                var to = _a.to,
                  children = _a.children,
                  props = __rest(_a, ['to', 'children']);
                return _jsx(
                  'a',
                  __assign({ href: to, 'data-testid': 'campaign-link' }, props, {
                    children: children,
                  })
                );
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
var mockCampaignContextValue = {
  campaignInfo: {},
  setCampaignInfo: vi.fn(),
  campaignId: null,
  setCampaignId: vi.fn(),
};
var mockCampaign = {
  campaign_id: 'test-campaign-1',
  thread_id: 'test-thread-1',
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
var renderWithContext = function (campaign, status, authValue, campaignValue) {
  if (campaign === void 0) {
    campaign = mockCampaign;
  }
  if (status === void 0) {
    status = 'Current';
  }
  if (authValue === void 0) {
    authValue = mockAuthContextValue;
  }
  if (campaignValue === void 0) {
    campaignValue = mockCampaignContextValue;
  }
  return render(
    _jsx(BrowserRouter, {
      children: _jsx(AuthContext.Provider, {
        value: authValue,
        children: _jsx(CampaignContext.Provider, {
          value: campaignValue,
          children: _jsx(PromotionComponent, { campaign: campaign, status: status }),
        }),
      }),
    })
  );
};
describe('PromotionComponent', function () {
  beforeEach(function () {
    vi.clearAllMocks();
    cleanup();
  });
  afterEach(function () {
    vi.restoreAllMocks();
    cleanup();
  });
  it('should render campaign title correctly', function () {
    renderWithContext();
    var links = screen.getAllByTestId('campaign-link');
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].textContent).toContain('Test Campaign');
  });
  it('should render campaign status', function () {
    renderWithContext(mockCampaign, 'Current');
    // Status is rendered as 'Current' (not uppercase)
    expect(screen.getByText('Current')).toBeTruthy();
  });
  it('should render Link to campaign content for non-draft campaigns', function () {
    renderWithContext(mockCampaign, 'Current');
    var links = screen.getAllByTestId('campaign-link');
    expect(links[0].getAttribute('href')).toBe('/campaign/content/test-campaign-1');
  });
  it('should render clickable title for draft campaigns that calls handleDraft', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var draftCampaign, mockSetCampaignInfo, draftCampaignContext, title, callArg, result;
      return __generator(this, function (_a) {
        draftCampaign = __assign({}, mockCampaign);
        mockSetCampaignInfo = vi.fn();
        draftCampaignContext = __assign(__assign({}, mockCampaignContextValue), {
          setCampaignInfo: mockSetCampaignInfo,
        });
        renderWithContext(draftCampaign, 'Draft', mockAuthContextValue, draftCampaignContext);
        title = screen.getByText('Test Campaign');
        fireEvent.click(title);
        expect(mockSetCampaignInfo).toHaveBeenCalledWith(expect.any(Function));
        callArg = mockSetCampaignInfo.mock.calls[0][0];
        result = callArg({});
        expect(result).toEqual(
          expect.objectContaining({
            name: 'Test Campaign',
            product: 'Test Product',
            campaign_id: 'test-campaign-1',
            currentStep: 5,
          })
        );
        return [2 /*return*/];
      });
    });
  });
  it('should show Continue button for draft campaigns', function () {
    renderWithContext(mockCampaign, 'Draft');
    expect(Boolean(screen.getByText('Continue'))).toBe(true);
  });
  it('should show Content Library button for non-draft campaigns', function () {
    renderWithContext(mockCampaign, 'Current');
    expect(Boolean(screen.getByText('Content Library'))).toBe(true);
  });
  it('should navigate to content library when Content Library button is clicked', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var contentLibraryButton, handleNavigate;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            renderWithContext(mockCampaign, 'Current');
            contentLibraryButton = screen.getByText('Content Library');
            fireEvent.click(contentLibraryButton);
            return [4 /*yield*/, import('../helpers/handleNavigate')];
          case 1:
            handleNavigate = _a.sent().default;
            expect(handleNavigate).toHaveBeenCalledWith(
              'test-user-id',
              '/campaign/content/test-campaign-1',
              expect.any(Function)
            );
            return [2 /*return*/];
        }
      });
    });
  });
  it('should show correct status color for different statuses', function () {
    renderWithContext(mockCampaign, 'Current');
    var statusElement = screen.getByText('Current');
    expect(statusElement.className.includes('text-[#0E9F6E]')).toBe(true);
  });
});
//# sourceMappingURL=PromotionComponent.test.js.map
