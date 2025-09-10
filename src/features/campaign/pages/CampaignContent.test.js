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
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CampaignContent from './CampaignContent';
import { AuthContext } from '../features/auth/context/AuthContext';
import { CampaignContext } from '../context/CampaignContext';
import handleNavigate from '../helpers/handleNavigate';
// Mock the modules
vi.mock('../helpers/getServiceURL', function () {
  return {
    getServiceURL: vi.fn(function () {
      return 'http://localhost:8080';
    }),
  };
});
vi.mock('../helpers/calculateTiming', function () {
  return {
    displayDuration: vi.fn(function () {
      return 'Dec 1 - Dec 28, 2024';
    }),
    getPostingSchedule: vi.fn(function () {
      return 'Daily';
    }),
  };
});
vi.mock('../helpers/formatters', function () {
  return {
    capitalizeFirstLetterOfEachWord: vi.fn(function (str) {
      return str;
    }),
  };
});
vi.mock('../helpers/analytics', function () {
  return {
    trackContentReview: vi.fn(),
    trackCampaignPublish: vi.fn(),
  };
});
vi.mock('../helpers/handleNavigate', function () {
  return {
    default: vi.fn(),
  };
});
vi.mock('../components/shared/Sidebar', function () {
  return {
    default: function () {
      return _jsx('div', { 'data-testid': 'sidebar', children: 'Sidebar' });
    },
  };
});
vi.mock('../components/campaign/CampaignHeader', function () {
  return {
    default: function (_a) {
      var handleNavigate = _a.handleNavigate;
      return _jsx('div', {
        'data-testid': 'campaign-header',
        onClick: handleNavigate,
        children: 'Campaign Header',
      });
    },
  };
});
vi.mock('../components/campaign/ButtonGroup', function () {
  return {
    default: function () {
      return _jsx('div', { 'data-testid': 'button-group', children: 'Button Group' });
    },
  };
});
vi.mock('../components/campaign/ApprovePopup', function () {
  return {
    default: function () {
      return _jsx('div', { 'data-testid': 'approve-popup', children: 'Approve Popup' });
    },
  };
});
vi.mock('../components/campaign/TabWrapper', function () {
  return {
    default: function () {
      return _jsx('div', { 'data-testid': 'tab-wrapper', children: 'Tab Wrapper' });
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
              useParams: function () {
                return { id: 'test-campaign-id' };
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
};
var mockAuthContextValue = {
  profile: mockProfile,
  setProfile: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
  logout: vi.fn(),
  login: vi.fn(),
};
var mockSetCampaignInfo = vi.fn();
var mockCampaignContextValue = {
  campaignInfo: {},
  setCampaignInfo: mockSetCampaignInfo,
};
var mockCampaignData = [
  {
    campaign_id: 'test-campaign-id',
    timestamp: '2024-12-01T00:00:00Z',
    campaign_data: {
      campaign_variables: {
        name: 'Test Campaign',
        product_service: 'Test Product',
        frequency: 'daily',
        start_date: '12/01/2024',
        durationNum: 4,
        summary: 'Test summary',
        audience_ethnicity: ['Caucasian'],
        emotion: ['Happy'],
        audience_interests: ['Technology'],
        product_service_description: 'A test product',
        purpose_topic: 'Awareness',
        scene: ['Office'],
        key_feature: ['Feature 1', 'Feature 2'],
        purpose: 'To increase awareness',
        audience_gender: ['All'],
        audience_age: ['25-34'],
        postingFrequency: 1,
        deliveryDay: 'Monday',
        frequency: 1,
        duration: '4 weeks',
      },
    },
  },
];
var renderWithContext = function (authValue) {
  if (authValue === void 0) {
    authValue = mockAuthContextValue;
  }
  return render(
    _jsx(BrowserRouter, {
      children: _jsx(AuthContext.Provider, {
        value: authValue,
        children: _jsx(CampaignContext.Provider, {
          value: mockCampaignContextValue,
          children: _jsx(CampaignContent, {}),
        }),
      }),
    })
  );
};
describe('CampaignContent Component', function () {
  beforeEach(function () {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });
  afterEach(function () {
    vi.restoreAllMocks();
  });
  it('should render campaign content when data is available', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            // Mock successful API responses
            global.fetch
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      return [2 /*return*/, mockCampaignData];
                    });
                  });
                },
              })
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      return [2 /*return*/, []];
                    });
                  });
                },
              });
            renderWithContext();
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByTestId('campaign-header')).toBeInTheDocument();
                expect(screen.getByTestId('tab-wrapper')).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('should handle authentication redirect', function () {
    var unauthenticatedAuthValue = __assign(__assign({}, mockAuthContextValue), {
      isAuthenticated: false,
    });
    renderWithContext(unauthenticatedAuthValue);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
  it('should navigate to campaign brief when header is clicked', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var campaignHeaders, setCampaignInfoCall, result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            // Mock successful API responses
            global.fetch
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      return [2 /*return*/, mockCampaignData];
                    });
                  });
                },
              })
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      return [2 /*return*/, []];
                    });
                  });
                },
              });
            renderWithContext();
            // Wait for the component to load
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getAllByTestId('campaign-header')[0]).toBeInTheDocument();
              }),
            ];
          case 1:
            // Wait for the component to load
            _a.sent();
            campaignHeaders = screen.getAllByTestId('campaign-header');
            fireEvent.click(campaignHeaders[0]);
            // Verify that setCampaignInfo was called with the correct data
            expect(mockSetCampaignInfo).toHaveBeenCalledWith(expect.any(Function));
            setCampaignInfoCall = mockSetCampaignInfo.mock.calls[0][0];
            result = setCampaignInfoCall({});
            // Verify the campaign data is set correctly
            expect(result).toMatchObject({
              summary: 'Test summary',
              name: 'Test Campaign',
              product: 'Test Product',
              audienceRace: ['Caucasian'],
              audienceEmotion: ['Happy'],
              audienceInterests: ['Technology'],
              productDescription: 'A test product',
              purpose: 'Awareness',
              locations: ['Office'],
              currentStep: 5,
              product_features: ['Feature 1', 'Feature 2'],
              purposeAbout: 'To increase awareness',
              audienceGender: ['All'],
              audienceAgeRange: ['25-34'],
              startDate: '12/01/2024',
              duration: '4 weeks',
              durationNum: 4,
              frequency: 1,
              postingFrequency: 1,
              deliveryDay: 'Monday',
              campaign_id: 'test-campaign-id',
              campaign_brief: true,
              created_at: '2024-12-01T00:00:00Z',
            });
            // Verify that handleNavigate was called with the correct parameters
            expect(handleNavigate).toHaveBeenCalledWith('test-user-id', '/campaign', mockNavigate);
            return [2 /*return*/];
        }
      });
    });
  });
});
//# sourceMappingURL=CampaignContent.test.js.map
