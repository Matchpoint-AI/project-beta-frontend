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
import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Divider,
  Button,
} from '@mui/material';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { MdExpandMore, MdRefresh } from 'react-icons/md';
import { useAuth } from '../../../features/auth/context/AuthContext';
var QualityGatePanel = function (_a) {
  var itemId = _a.itemId,
    itemType = _a.itemType,
    content = _a.content,
    metadata = _a.metadata,
    onRecheck = _a.onRecheck,
    className = _a.className;
  var _b = useState(null),
    result = _b[0],
    setResult = _b[1];
  var _c = useState(false),
    loading = _c[0],
    setLoading = _c[1];
  var _d = useState(null),
    error = _d[0],
    setError = _d[1];
  var profile = useAuth().profile;
  // Mock quality gate analysis - in production, this would call the actual quality gate service
  var performQualityCheck = useCallback(
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var checks,
          brandScore,
          diversityScore,
          consistencyScore,
          completenessScore,
          policyScore,
          overallScore,
          failedChecks,
          warningChecks,
          recommendations,
          blockers;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              // Simulate API delay
              return [
                4 /*yield*/,
                new Promise(function (resolve) {
                  return setTimeout(resolve, 1000);
                }),
              ];
            case 1:
              // Simulate API delay
              _a.sent();
              checks = [];
              brandScore = Math.random() * 0.4 + 0.6;
              checks.push({
                id: 'brand-compliance',
                name: 'Brand Compliance',
                description: 'Ensures content aligns with brand guidelines and voice',
                score: brandScore,
                status: brandScore > 0.8 ? 'pass' : brandScore > 0.6 ? 'warning' : 'fail',
                category: 'brand_compliance',
                details: [
                  brandScore > 0.8
                    ? 'Brand voice and tone are consistent'
                    : 'Brand voice needs adjustment',
                  brandScore > 0.7
                    ? 'Visual style aligns with brand guidelines'
                    : 'Visual style deviates from guidelines',
                  brandScore > 0.6
                    ? 'Approved messaging elements present'
                    : 'Missing key brand messaging',
                ],
              });
              // Diversity Check (for image content)
              if (itemType === 'image' || itemType === 'prompt') {
                diversityScore = Math.random() * 0.3 + 0.7;
                checks.push({
                  id: 'diversity',
                  name: 'Diversity & Inclusion',
                  description: 'Validates representation and inclusivity in visual content',
                  score: diversityScore,
                  status: diversityScore > 0.8 ? 'pass' : diversityScore > 0.6 ? 'warning' : 'fail',
                  category: 'diversity',
                  details: [
                    diversityScore > 0.8
                      ? 'Diverse representation achieved'
                      : 'Limited diversity in representation',
                    diversityScore > 0.7
                      ? 'Inclusive messaging and imagery'
                      : 'Consider more inclusive approach',
                    'Accessibility considerations reviewed',
                  ],
                });
              }
              consistencyScore = Math.random() * 0.4 + 0.6;
              checks.push({
                id: 'consistency',
                name: 'Content Consistency',
                description: 'Ensures consistency across campaign content',
                score: consistencyScore,
                status:
                  consistencyScore > 0.8 ? 'pass' : consistencyScore > 0.6 ? 'warning' : 'fail',
                category: 'consistency',
                details: [
                  consistencyScore > 0.8
                    ? 'Consistent with campaign theme'
                    : 'Some inconsistency with campaign theme',
                  consistencyScore > 0.7
                    ? 'Messaging tone is uniform'
                    : 'Tone varies from campaign standard',
                  consistencyScore > 0.6
                    ? 'Visual elements are cohesive'
                    : 'Visual elements need alignment',
                ],
              });
              completenessScore = content.length > 50 ? 0.9 : 0.6;
              checks.push({
                id: 'completeness',
                name: 'Content Completeness',
                description: 'Validates that all required content elements are present',
                score: completenessScore,
                status:
                  completenessScore > 0.8 ? 'pass' : completenessScore > 0.6 ? 'warning' : 'fail',
                category: 'completeness',
                details: [
                  completenessScore > 0.8
                    ? 'All required elements present'
                    : 'Missing some required elements',
                  itemType === 'caption' ? 'Caption length appropriate' : 'Content length adequate',
                  'Call-to-action included where appropriate',
                ],
              });
              policyScore = Math.random() * 0.2 + 0.8;
              checks.push({
                id: 'policy',
                name: 'Policy & Legal Compliance',
                description: 'Ensures content meets platform policies and legal requirements',
                score: policyScore,
                status: policyScore > 0.9 ? 'pass' : policyScore > 0.7 ? 'warning' : 'fail',
                category: 'policy',
                details: [
                  policyScore > 0.9 ? 'No policy violations detected' : 'Minor policy concerns',
                  'Copyright and trademark compliance verified',
                  'Platform-specific guidelines followed',
                ],
              });
              overallScore =
                checks.reduce(function (sum, check) {
                  return sum + check.score;
                }, 0) / checks.length;
              failedChecks = checks.filter(function (check) {
                return check.status === 'fail';
              });
              warningChecks = checks.filter(function (check) {
                return check.status === 'warning';
              });
              recommendations = [];
              blockers = [];
              if (overallScore < 0.7) {
                recommendations.push(
                  'Consider regenerating content with more specific brand guidelines'
                );
              }
              if (warningChecks.length > 2) {
                recommendations.push('Review and address warning items before approval');
              }
              if (itemType === 'caption' && content.length < 30) {
                recommendations.push('Consider expanding caption for better engagement');
              }
              if (failedChecks.length > 0) {
                blockers.push(
                  ''.concat(
                    failedChecks.length,
                    ' critical check(s) failed - content cannot be approved'
                  )
                );
              }
              if (policyScore < 0.7) {
                blockers.push('Policy compliance issues must be resolved');
              }
              return [
                2 /*return*/,
                {
                  itemId: itemId,
                  overallScore: overallScore,
                  passed: failedChecks.length === 0,
                  checks: checks,
                  recommendations: recommendations,
                  blockers: blockers,
                  timestamp: new Date().toISOString(),
                },
              ];
          }
        });
      });
    },
    [itemId, itemType, content]
  );
  var runQualityCheck = useCallback(
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var checkResult, _a, err_1;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              _b.trys.push([0, 5, 6, 7]);
              setLoading(true);
              setError(null);
              if (!onRecheck) return [3 /*break*/, 2];
              return [4 /*yield*/, onRecheck(itemId)];
            case 1:
              _a = _b.sent();
              return [3 /*break*/, 4];
            case 2:
              return [4 /*yield*/, performQualityCheck()];
            case 3:
              _a = _b.sent();
              _b.label = 4;
            case 4:
              checkResult = _a;
              setResult(checkResult);
              return [3 /*break*/, 7];
            case 5:
              err_1 = _b.sent();
              setError(err_1 instanceof Error ? err_1.message : 'Quality check failed');
              return [3 /*break*/, 7];
            case 6:
              setLoading(false);
              return [7 /*endfinally*/];
            case 7:
              return [2 /*return*/];
          }
        });
      });
    },
    [itemId, onRecheck, performQualityCheck]
  );
  useEffect(
    function () {
      runQualityCheck();
    },
    [runQualityCheck]
  );
  var getScoreColor = function (score) {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };
  var getStatusIcon = function (status) {
    switch (status) {
      case 'pass':
        return _jsx(FaCheckCircle, { color: '#4caf50' });
      case 'warning':
        return _jsx(FaExclamationTriangle, { color: '#ff9800' });
      case 'fail':
        return _jsx(FaExclamationTriangle, { color: '#f44336' });
    }
  };
  var getCategoryColor = function (category) {
    switch (category) {
      case 'brand_compliance':
        return '#1976d2';
      case 'diversity':
        return '#9c27b0';
      case 'consistency':
        return '#2e7d32';
      case 'completeness':
        return '#ed6c02';
      case 'policy':
        return '#d32f2f';
      default:
        return '#757575';
    }
  };
  if (loading) {
    return _jsx(Card, {
      className: className,
      children: _jsxs(CardContent, {
        children: [
          _jsxs(Box, {
            sx: { display: 'flex', alignItems: 'center', mb: 2 },
            children: [
              _jsx(FaInfoCircle, {}),
              _jsx(Typography, {
                variant: 'h6',
                sx: { ml: 1 },
                children: 'Running Quality Check...',
              }),
            ],
          }),
          _jsx(LinearProgress, {}),
        ],
      }),
    });
  }
  if (error) {
    return _jsx(Card, {
      className: className,
      children: _jsxs(CardContent, {
        children: [
          _jsx(Alert, { severity: 'error', sx: { mb: 2 }, children: error }),
          _jsx(Button, {
            variant: 'outlined',
            startIcon: _jsx(MdRefresh, {}),
            onClick: runQualityCheck,
            children: 'Retry Quality Check',
          }),
        ],
      }),
    });
  }
  if (!result) {
    return null;
  }
  return _jsx(Card, {
    className: className,
    children: _jsxs(CardContent, {
      children: [
        _jsxs(Box, {
          sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 },
          children: [
            _jsx(Typography, { variant: 'h6', children: 'Quality Gate Results' }),
            _jsx(Button, {
              size: 'small',
              startIcon: _jsx(MdRefresh, {}),
              onClick: runQualityCheck,
              children: 'Recheck',
            }),
          ],
        }),
        _jsxs(Box, {
          sx: { mb: 3 },
          children: [
            _jsxs(Box, {
              sx: { display: 'flex', alignItems: 'center', mb: 1 },
              children: [
                _jsxs(Typography, {
                  variant: 'subtitle1',
                  sx: { mr: 2 },
                  children: ['Overall Score: ', Math.round(result.overallScore * 100), '%'],
                }),
                _jsx(Chip, {
                  label: result.passed ? 'PASSED' : 'FAILED',
                  color: result.passed ? 'success' : 'error',
                  variant: 'filled',
                }),
              ],
            }),
            _jsx(LinearProgress, {
              variant: 'determinate',
              value: result.overallScore * 100,
              color: getScoreColor(result.overallScore),
              sx: { height: 8, borderRadius: 4 },
            }),
          ],
        }),
        result.blockers.length > 0 &&
          _jsxs(Alert, {
            severity: 'error',
            sx: { mb: 2 },
            children: [
              _jsx(Typography, {
                variant: 'subtitle2',
                sx: { mb: 1 },
                children: 'Critical Issues:',
              }),
              result.blockers.map(function (blocker, index) {
                return _jsxs(
                  Typography,
                  { variant: 'body2', children: ['\u2022 ', blocker] },
                  index
                );
              }),
            ],
          }),
        result.recommendations.length > 0 &&
          _jsxs(Alert, {
            severity: 'info',
            sx: { mb: 2 },
            children: [
              _jsx(Typography, {
                variant: 'subtitle2',
                sx: { mb: 1 },
                children: 'Recommendations:',
              }),
              result.recommendations.map(function (rec, index) {
                return _jsxs(Typography, { variant: 'body2', children: ['\u2022 ', rec] }, index);
              }),
            ],
          }),
        _jsx(Divider, { sx: { my: 2 } }),
        _jsx(Typography, { variant: 'subtitle1', sx: { mb: 2 }, children: 'Detailed Checks:' }),
        result.checks.map(function (check) {
          return _jsxs(
            Accordion,
            {
              sx: { mb: 1 },
              children: [
                _jsx(AccordionSummary, {
                  expandIcon: _jsx(MdExpandMore, {}),
                  children: _jsxs(Box, {
                    sx: { display: 'flex', alignItems: 'center', width: '100%' },
                    children: [
                      _jsx(Box, { sx: { mr: 2 }, children: getStatusIcon(check.status) }),
                      _jsx(Box, {
                        sx: { flex: 1 },
                        children: _jsx(Typography, { variant: 'subtitle2', children: check.name }),
                      }),
                      _jsxs(Box, {
                        sx: { display: 'flex', alignItems: 'center', mr: 2 },
                        children: [
                          _jsxs(Typography, {
                            variant: 'body2',
                            sx: { mr: 1 },
                            children: [Math.round(check.score * 100), '%'],
                          }),
                          _jsx(Chip, {
                            label: check.category.replace('_', ' '),
                            size: 'small',
                            sx: {
                              bgcolor: getCategoryColor(check.category),
                              color: 'white',
                              fontSize: '0.7rem',
                            },
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                _jsxs(AccordionDetails, {
                  children: [
                    _jsx(Typography, {
                      variant: 'body2',
                      color: 'textSecondary',
                      sx: { mb: 2 },
                      children: check.description,
                    }),
                    _jsx(Box, {
                      sx: { mb: 2 },
                      children: _jsx(LinearProgress, {
                        variant: 'determinate',
                        value: check.score * 100,
                        color: getScoreColor(check.score),
                        sx: { height: 6, borderRadius: 3 },
                      }),
                    }),
                    _jsx(Typography, { variant: 'subtitle2', sx: { mb: 1 }, children: 'Details:' }),
                    check.details.map(function (detail, index) {
                      return _jsxs(
                        Typography,
                        { variant: 'body2', sx: { mb: 0.5 }, children: ['\u2022 ', detail] },
                        index
                      );
                    }),
                  ],
                }),
              ],
            },
            check.id
          );
        }),
        _jsxs(Typography, {
          variant: 'caption',
          color: 'textSecondary',
          sx: { mt: 2, display: 'block' },
          children: ['Last checked: ', new Date(result.timestamp).toLocaleString()],
        }),
      ],
    }),
  });
};
export default QualityGatePanel;
//# sourceMappingURL=QualityGatePanel.js.map
