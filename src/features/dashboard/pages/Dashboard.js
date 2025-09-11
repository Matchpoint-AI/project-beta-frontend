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
import { useContext, useEffect, useState } from 'react';
import Sidebar from '../../../components/shared/Sidebar';
import { useAuth } from '../../auth/context/AuthContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { BrandContext } from '../../../context/BrandContext';
import { CircularProgress } from '@mui/material';
import { RiErrorWarningLine } from 'react-icons/ri';
import CampaignsList from '../components/CampaignsList';
import { useNavigate } from 'react-router-dom';
import handleNavigate from '../../../helpers/handleNavigate';
import PerformancePredictionDashboard from '../../../components/performance/PerformancePredictionDashboard';
import { FaFlask, FaExternalLinkAlt } from 'react-icons/fa';
var Dashboard = function () {
  var _a;
  var _b = useState('All'),
    campaignType = _b[0],
    setCampaignType = _b[1];
  var _c = useState('campaigns'),
    activeTab = _c[0],
    setActiveTab = _c[1];
  var _d = useContext(BrandContext),
    businessInfo = _d.businessInfo,
    setBusinessInfo = _d.setBusinessInfo;
  var _e = useState(
      (_a = businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.campaigns) !==
        null && _a !== void 0
        ? _a
        : []
    ),
    campaigns = _e[0],
    setCampaigns = _e[1];
  var _f = useState(
      !(businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.campaigns)
    ),
    loading = _f[0],
    setLoading = _f[1];
  var _g = useState(false),
    error = _g[0],
    setError = _g[1];
  var _h = useAuth(),
    profile = _h.profile,
    isAuthenticated = _h.isAuthenticated;
  var endpointUrl = getServiceURL('data');
  var navigate = useNavigate();
  var fetchCampaigns = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var params, response, data, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!(profile === null || profile === void 0 ? void 0 : profile.token)) {
              setError(true);
              return [2 /*return*/];
            }
            setLoading(true);
            setError(false);
            params = new URLSearchParams({
              query_kind: 'campaign',
              status: campaignType,
            });
            _a.label = 1;
          case 1:
            _a.trys.push([1, 4, , 5]);
            return [
              4 /*yield*/,
              fetch(''.concat(endpointUrl, '/api/v1/data/get/complex?').concat(params.toString()), {
                method: 'GET',
                headers: {
                  Authorization: 'Bearer '.concat(profile.token),
                },
              }),
            ];
          case 2:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            return [4 /*yield*/, response.json()];
          case 3:
            data = _a.sent();
            setCampaigns(data);
            setBusinessInfo(__assign(__assign({}, businessInfo), { campaigns: data }));
            return [3 /*break*/, 5];
          case 4:
            error_1 = _a.sent();
            setError(true);
            return [3 /*break*/, 5];
          case 5:
            setLoading(false);
            return [2 /*return*/];
        }
      });
    });
  };
  useEffect(
    function () {
      if (!(profile === null || profile === void 0 ? void 0 : profile.token)) return;
      if (!businessInfo.campaigns) {
        fetchCampaigns();
      } else setCampaigns(businessInfo.campaigns);
    },
    [
      profile === null || profile === void 0 ? void 0 : profile.token,
      businessInfo.campaigns,
      isAuthenticated,
    ]
  );
  // Removed automatic redirect that was causing navigation issues
  // Users should manually click on campaigns to navigate to them
  if (!profile) {
    return _jsx('div', {
      className: 'w-full h-full',
      children: _jsxs('div', {
        className:
          'flex w-full lg:flex-row flex-col bg-gradient-to-b min-h-screen from-[#F1FDFF] to-[#F5D9FF]',
        children: [
          _jsx(Sidebar, {}),
          _jsxs('div', {
            className: 'w-full min-h-screen flex flex-col gap-5 justify-center items-center',
            children: [
              _jsx(CircularProgress, { sx: { color: '#42389D' }, size: 80, thickness: 5 }),
              _jsx('h1', {
                className: 'text-2xl font-semibold leading-9 text-gradient',
                children: 'Loading your profile...',
              }),
            ],
          }),
        ],
      }),
    });
  }
  return _jsx('div', {
    className: 'w-full h-full',
    children: _jsxs('div', {
      className:
        'flex w-full lg:flex-row flex-col bg-gradient-to-b min-h-screen from-[#F1FDFF] to-[#F5D9FF]',
      children: [
        _jsx(Sidebar, {}),
        loading &&
          !error &&
          _jsxs('div', {
            className: 'w-full min-h-screen flex flex-col gap-5 justify-center items-center',
            children: [
              _jsx(CircularProgress, { sx: { color: '#42389D' }, size: 80, thickness: 5 }),
              _jsx('h1', {
                className: 'text-2xl font-semibold leading-9 text-gradient',
                children: 'We are loading your campaigns',
              }),
            ],
          }),
        !loading &&
          error &&
          _jsxs('div', {
            className: 'w-full min-h-screen flex flex-col gap-5 justify-center items-center',
            children: [
              _jsx(RiErrorWarningLine, { size: 64, color: '#F05252' }),
              _jsx('h1', {
                className:
                  'font-medium md:text-[42px] sm:text-[32px] text-[28px] text-center text-[#30175A]',
                children: 'Unexpected Error',
              }),
              _jsxs('p', {
                className: 'text-[#30175A] md:text-lg text-base text-center max-w-[600px]',
                children: [
                  'Sorry, unexpected error happend while fetching your campaigns',
                  _jsx('br', {}),
                  'Please retry.',
                ],
              }),
              _jsx('button', {
                className:
                  'flex items-center justify-center font-semibold mt-5 bg-[#5145CD] text-white rounded-lg py-3 px-5',
                onClick: fetchCampaigns,
                children: 'Retry',
              }),
            ],
          }),
        !loading &&
          !error &&
          _jsxs('div', {
            className: 'w-full',
            children: [
              _jsxs('div', {
                className: 'flex gap-4 mb-6 px-8 pt-6',
                children: [
                  _jsx('button', {
                    onClick: function () {
                      return setActiveTab('campaigns');
                    },
                    className: 'px-6 py-3 rounded-lg font-semibold transition-all '.concat(
                      activeTab === 'campaigns'
                        ? 'bg-[#5145CD] text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    ),
                    children: 'My Campaigns',
                  }),
                  _jsxs('button', {
                    onClick: function () {
                      return setActiveTab('predictions');
                    },
                    className:
                      'px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 '.concat(
                        activeTab === 'predictions'
                          ? 'bg-[#5145CD] text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      ),
                    children: [
                      _jsx('svg', {
                        className: 'w-5 h-5',
                        fill: 'currentColor',
                        viewBox: '0 0 20 20',
                        children: _jsx('path', {
                          d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z',
                        }),
                      }),
                      'AI Predictions',
                    ],
                  }),
                  _jsxs('button', {
                    onClick: function () {
                      return setActiveTab('demo');
                    },
                    className:
                      'px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 '.concat(
                        activeTab === 'demo'
                          ? 'bg-[#5145CD] text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      ),
                    children: [_jsx(FaFlask, { className: 'w-5 h-5' }), 'Demo Features'],
                  }),
                ],
              }),
              activeTab === 'campaigns'
                ? _jsx(CampaignsList, {
                    campaigns: campaigns,
                    campaignType: campaignType,
                    setCampaignType: setCampaignType,
                  })
                : activeTab === 'predictions'
                  ? _jsx('div', {
                      className: 'px-8',
                      children: _jsx(PerformancePredictionDashboard, {}),
                    })
                  : _jsx('div', {
                      className: 'px-8',
                      children: _jsxs('div', {
                        className: 'bg-white rounded-lg shadow-lg p-6',
                        children: [
                          _jsxs('h2', {
                            className:
                              'text-2xl font-bold text-[#30175A] mb-4 flex items-center gap-2',
                            children: [
                              _jsx(FaFlask, { className: 'text-[#5145CD]' }),
                              'Demo Features',
                            ],
                          }),
                          _jsx('p', {
                            className: 'text-gray-600 mb-6',
                            children:
                              'Explore the latest A/B testing and content optimization features.',
                          }),
                          _jsxs('div', {
                            className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
                            children: [
                              _jsxs('div', {
                                className:
                                  'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow',
                                children: [
                                  _jsxs('div', {
                                    className: 'flex items-center mb-4',
                                    children: [
                                      _jsx(FaFlask, { className: 'text-blue-600 text-xl mr-2' }),
                                      _jsx('h3', {
                                        className: 'text-lg font-semibold text-gray-800',
                                        children: 'A/B Test Variants',
                                      }),
                                    ],
                                  }),
                                  _jsx('p', {
                                    className: 'text-gray-600 mb-4 text-sm',
                                    children:
                                      'Compare different content versions side-by-side with performance metrics and statistical confidence.',
                                  }),
                                  _jsxs('button', {
                                    onClick: function () {
                                      return handleNavigate(navigate, '/demo/abtest');
                                    },
                                    className:
                                      'flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm',
                                    children: ['View Demo', _jsx(FaExternalLinkAlt, {})],
                                  }),
                                ],
                              }),
                              _jsxs('div', {
                                className:
                                  'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 hover:shadow-md transition-shadow opacity-60',
                                children: [
                                  _jsxs('div', {
                                    className: 'flex items-center mb-4',
                                    children: [
                                      _jsx(FaFlask, { className: 'text-green-600 text-xl mr-2' }),
                                      _jsx('h3', {
                                        className: 'text-lg font-semibold text-gray-800',
                                        children: 'Smart Scheduling',
                                      }),
                                    ],
                                  }),
                                  _jsx('p', {
                                    className: 'text-gray-600 mb-4 text-sm',
                                    children:
                                      'AI-powered content scheduling based on audience behavior patterns.',
                                  }),
                                  _jsx('button', {
                                    disabled: true,
                                    className:
                                      'flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed text-sm',
                                    children: 'Coming Soon',
                                  }),
                                ],
                              }),
                              _jsxs('div', {
                                className:
                                  'bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-6 hover:shadow-md transition-shadow opacity-60',
                                children: [
                                  _jsxs('div', {
                                    className: 'flex items-center mb-4',
                                    children: [
                                      _jsx(FaFlask, { className: 'text-purple-600 text-xl mr-2' }),
                                      _jsx('h3', {
                                        className: 'text-lg font-semibold text-gray-800',
                                        children: 'Multi-Language',
                                      }),
                                    ],
                                  }),
                                  _jsx('p', {
                                    className: 'text-gray-600 mb-4 text-sm',
                                    children:
                                      'Automatic content translation and localization for global campaigns.',
                                  }),
                                  _jsx('button', {
                                    disabled: true,
                                    className:
                                      'flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed text-sm',
                                    children: 'Coming Soon',
                                  }),
                                ],
                              }),
                            ],
                          }),
                          _jsxs('div', {
                            className: 'mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg',
                            children: [
                              _jsx('h4', {
                                className: 'font-semibold text-blue-800 mb-2',
                                children: '\uD83D\uDCA1 Pro Tip',
                              }),
                              _jsx('p', {
                                className: 'text-blue-700 text-sm',
                                children:
                                  'A/B testing helps you understand what content resonates best with your audience. Try testing different caption styles, emoji usage, or call-to-action approaches to optimize engagement.',
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
            ],
          }),
      ],
    }),
  });
};
export default Dashboard;
//# sourceMappingURL=Dashboard.js.map
