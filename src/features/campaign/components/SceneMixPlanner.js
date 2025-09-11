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
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { plannerApi, policyApi } from '../../../api/contentGenerationApi';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
var SceneMixPlanner = function (_a) {
  var campaignId = _a.campaignId,
    campaignName = _a.campaignName,
    weeks = _a.weeks,
    postsPerWeek = _a.postsPerWeek;
  var profile = useAuth().profile;
  var _b = useState(true),
    loading = _b[0],
    setLoading = _b[1];
  var _c = useState(null),
    error = _c[0],
    setError = _c[1];
  var _d = useState(null),
    contentPlan = _d[0],
    setContentPlan = _d[1];
  var _e = useState(null),
    scenePolicy = _e[0],
    setScenePolicy = _e[1];
  var _f = useState(false),
    creatingPlan = _f[0],
    setCreatingPlan = _f[1];
  // Scene type colors for visual distinction
  var sceneTypeColors = {
    product: '#FF6B6B',
    lifestyle: '#4ECDC4',
    human: '#45B7D1',
    text: '#96CEB4',
    infographic: '#FFEAA7',
  };
  useEffect(
    function () {
      loadPlanAndPolicy();
    },
    [campaignId]
  );
  var loadPlanAndPolicy = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var _a, planData, policyData, _err_1, errorMessage;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (!(profile === null || profile === void 0 ? void 0 : profile.token))
              return [2 /*return*/];
            _b.label = 1;
          case 1:
            _b.trys.push([1, 3, 4, 5]);
            setLoading(true);
            setError(null);
            return [
              4 /*yield*/,
              Promise.all([
                plannerApi.getPlan(campaignId, profile.token).catch(function () {
                  return null;
                }),
                policyApi.getPolicy(campaignId, profile.token).catch(function () {
                  return null;
                }),
              ]),
            ];
          case 2:
            ((_a = _b.sent()), (planData = _a[0]), (policyData = _a[1]));
            setContentPlan(planData);
            setScenePolicy(policyData);
            return [3 /*break*/, 5];
          case 3:
            _err_1 = _b.sent();
            errorMessage = 'Failed to load content plan';
            if (err instanceof Error) {
              if (err.message.includes('404')) {
                errorMessage = 'No existing content plan found for this campaign';
              } else if (err.message.includes('401')) {
                errorMessage = 'Authentication failed. Please refresh the page and try again.';
              } else {
                errorMessage = 'Error loading plan: '.concat(err.message);
              }
            }
            setError(errorMessage);
            return [3 /*break*/, 5];
          case 4:
            setLoading(false);
            return [7 /*endfinally*/];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  var createNewPlan = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var newPolicy, newPlan, _err_2, errorMessage;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!(profile === null || profile === void 0 ? void 0 : profile.token))
              return [2 /*return*/];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, 6, 7]);
            setCreatingPlan(true);
            setError(null);
            if (!!scenePolicy) return [3 /*break*/, 3];
            return [
              4 /*yield*/,
              policyApi.createPolicy(
                campaignId,
                {
                  campaign_id: campaignId,
                  intent: 'awareness',
                  industry: 'consumable',
                  brand_tier: 'standard',
                  target_audience: {
                    age_range: '25-45',
                    interests: ['lifestyle', 'quality'],
                    behavior: ['social_media_active'],
                  },
                  brand_personality: ['authentic', 'approachable', 'quality-focused'],
                  product_features: ['high-quality', 'user-friendly', 'innovative'],
                  seasonal_context: 'general',
                  region: 'us',
                  has_ingredients: false,
                  visual_restrictions: [],
                  performance_history: {},
                  force_regenerate: false,
                },
                profile.token
              ),
            ];
          case 2:
            newPolicy = _a.sent();
            setScenePolicy(newPolicy);
            _a.label = 3;
          case 3:
            return [
              4 /*yield*/,
              plannerApi.createPlan(
                campaignId,
                {
                  campaign_name: campaignName,
                  campaign_type: 'brand_awareness',
                  duration_weeks: weeks,
                  target_audience: ['general_audience', 'brand_enthusiasts'],
                  content_types: ['post', 'story', 'reel'],
                  weekly_post_count: postsPerWeek,
                  themes: ['brand_awareness', 'product_showcase', 'user_stories', 'educational'],
                  brand_values: ['quality', 'innovation', 'authenticity'],
                },
                profile.token
              ),
            ];
          case 4:
            newPlan = _a.sent();
            setContentPlan(newPlan);
            return [3 /*break*/, 7];
          case 5:
            _err_2 = _a.sent();
            errorMessage = 'Failed to create content plan';
            if (err instanceof Error) {
              if (err.message.includes('422')) {
                errorMessage = 'Invalid request parameters. Please check your campaign settings.';
              } else if (err.message.includes('401')) {
                errorMessage = 'Authentication failed. Please refresh the page and try again.';
              } else if (err.message.includes('500')) {
                errorMessage = 'Server error occurred. Please try again in a few moments.';
              } else {
                errorMessage = 'Error: '.concat(err.message);
              }
            }
            setError(errorMessage);
            return [3 /*break*/, 7];
          case 6:
            setCreatingPlan(false);
            return [7 /*endfinally*/];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  var regeneratePlan = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, createNewPlan()];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  if (loading) {
    return _jsx(Box, {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 400,
      children: _jsx(CircularProgress, {}),
    });
  }
  if (_error) {
    return _jsxs(Alert, {
      severity: 'error',
      sx: { m: 2 },
      children: [
        error,
        _jsx(Button, { onClick: loadPlanAndPolicy, sx: { ml: 2 }, children: 'Retry' }),
      ],
    });
  }
  if (!contentPlan) {
    return _jsxs(Paper, {
      sx: { p: 4, textAlign: 'center' },
      children: [
        _jsx(AutoAwesomeIcon, { sx: { fontSize: 64, color: 'primary.main', mb: 2 } }),
        _jsx(Typography, { variant: 'h5', gutterBottom: true, children: 'No Content Plan Yet' }),
        _jsx(Typography, {
          variant: 'body1',
          color: 'text.secondary',
          sx: { mb: 3 },
          children: 'Create an AI-powered content plan using Scene Mix technology',
        }),
        _jsx(Button, {
          variant: 'contained',
          startIcon: _jsx(AddIcon, {}),
          onClick: createNewPlan,
          disabled: creatingPlan,
          size: 'large',
          children: creatingPlan ? 'Creating Plan...' : 'Generate Content Plan',
        }),
        creatingPlan && _jsx(LinearProgress, { sx: { mt: 2 } }),
      ],
    });
  }
  return _jsxs(Box, {
    children: [
      _jsxs(Paper, {
        sx: { p: 3, mb: 3 },
        children: [
          _jsxs(Box, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            children: [
              _jsxs(Box, {
                children: [
                  _jsx(Typography, {
                    variant: 'h5',
                    gutterBottom: true,
                    children: 'Scene Mix Content Plan',
                  }),
                  _jsxs(Typography, {
                    variant: 'body2',
                    color: 'text.secondary',
                    children: ['AI-optimized content distribution for ', campaignName],
                  }),
                ],
              }),
              _jsxs(Box, {
                children: [
                  _jsx(Tooltip, {
                    title: 'Regenerate Plan',
                    children: _jsx(IconButton, {
                      onClick: regeneratePlan,
                      disabled: creatingPlan,
                      children: _jsx(RefreshIcon, {}),
                    }),
                  }),
                  _jsx(Tooltip, {
                    title: 'Edit Policy',
                    children: _jsx(IconButton, { disabled: true, children: _jsx(EditIcon, {}) }),
                  }),
                ],
              }),
            ],
          }),
          scenePolicy &&
            _jsxs(Box, {
              sx: { mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' },
              children: [
                scenePolicy.scenes.map(function (scene) {
                  return _jsx(
                    Chip,
                    {
                      label: ''
                        .concat(scene.type, ': ')
                        .concat((scene.weight * 100).toFixed(0), '%'),
                      size: 'small',
                      sx: {
                        backgroundColor: sceneTypeColors[scene.type] + '20',
                        borderColor: sceneTypeColors[scene.type],
                        border: '1px solid',
                      },
                    },
                    scene.type
                  );
                }),
                _jsx(Chip, {
                  label: 'Diversity: '.concat((scenePolicy.diversity_score * 100).toFixed(0), '%'),
                  size: 'small',
                  variant: 'outlined',
                }),
                _jsx(Chip, {
                  label: 'Consistency: '.concat(
                    (scenePolicy.consistency_level * 100).toFixed(0),
                    '%'
                  ),
                  size: 'small',
                  variant: 'outlined',
                }),
              ],
            }),
        ],
      }),
      _jsx(Grid, {
        container: true,
        spacing: 3,
        children: contentPlan.weeks.map(function (week) {
          return _jsx(
            Grid,
            {
              item: true,
              xs: 12,
              children: _jsxs(Paper, {
                sx: { p: 2 },
                children: [
                  _jsxs(Typography, {
                    variant: 'h6',
                    gutterBottom: true,
                    children: ['Week ', week.week_number],
                  }),
                  _jsx(Grid, {
                    container: true,
                    spacing: 2,
                    children: week.posts.map(function (post, index) {
                      return _jsx(
                        Grid,
                        {
                          item: true,
                          xs: 12,
                          sm: 6,
                          md: 4,
                          lg: 3,
                          children: _jsx(Card, {
                            sx: {
                              height: '100%',
                              borderLeft: '4px solid '.concat(
                                sceneTypeColors[post.scene_type] || '#ccc'
                              ),
                            },
                            children: _jsxs(CardContent, {
                              children: [
                                _jsxs(Box, {
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  mb: 1,
                                  children: [
                                    _jsx(Chip, {
                                      label: post.scene_type,
                                      size: 'small',
                                      sx: {
                                        backgroundColor: sceneTypeColors[post.scene_type] + '20',
                                        fontSize: '0.75rem',
                                      },
                                    }),
                                    _jsxs(Typography, {
                                      variant: 'caption',
                                      color: 'text.secondary',
                                      children: ['Day ', post.day],
                                    }),
                                  ],
                                }),
                                post.theme &&
                                  _jsxs(Typography, {
                                    variant: 'body2',
                                    gutterBottom: true,
                                    children: ['Theme: ', post.theme],
                                  }),
                                post.elements &&
                                  post.elements.length > 0 &&
                                  _jsx(Box, {
                                    sx: { mt: 1 },
                                    children: post.elements.map(function (element, i) {
                                      return _jsx(
                                        Chip,
                                        {
                                          label: element,
                                          size: 'small',
                                          variant: 'outlined',
                                          sx: { mr: 0.5, mb: 0.5, fontSize: '0.7rem' },
                                        },
                                        i
                                      );
                                    }),
                                  }),
                                post.caption_style &&
                                  _jsxs(Typography, {
                                    variant: 'caption',
                                    color: 'text.secondary',
                                    sx: { mt: 1, display: 'block' },
                                    children: ['Style: ', post.caption_style],
                                  }),
                              ],
                            }),
                          }),
                        },
                        index
                      );
                    }),
                  }),
                ],
              }),
            },
            week.week_number
          );
        }),
      }),
      contentPlan &&
        _jsxs(Box, {
          sx: { mt: 3, textAlign: 'center' },
          children: [
            _jsx(CheckCircleIcon, { sx: { color: 'success.main', mr: 1 } }),
            _jsxs(Typography, {
              variant: 'body2',
              color: 'text.secondary',
              component: 'span',
              children: [
                'Plan generated on ',
                new Date(contentPlan.created_at).toLocaleDateString(),
              ],
            }),
          ],
        }),
    ],
  });
};
export default SceneMixPlanner;
//# sourceMappingURL=SceneMixPlanner.js.map
