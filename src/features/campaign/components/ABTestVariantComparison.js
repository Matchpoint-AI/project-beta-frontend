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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import React, { useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  LinearProgress,
  Avatar,
  Badge,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { FaSave, FaTimes, FaCopy, FaPlay, FaPause } from 'react-icons/fa';
import { MdFullscreen, MdFullscreenExit, MdThumbUp } from 'react-icons/md';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
var ABTestVariantComparison = function (_a) {
  var isOpen = _a.isOpen,
    onClose = _a.onClose,
    testConfig = _a.testConfig,
    onSaveVariant = _a.onSaveVariant,
    _onUpdateTrafficAllocation = _a.onUpdateTrafficAllocation,
    onStartTest = _a.onStartTest,
    onPauseTest = _a.onPauseTest,
    onDeclareWinner = _a.onDeclareWinner,
    _onCreateVariant = _a.onCreateVariant,
    _b = _a.title,
    title = _b === void 0 ? 'A/B Test Variant Comparison' : _b;
  var _c = useState([]),
    selectedVariants = _c[0],
    setSelectedVariants = _c[1];
  var _d = useState('comparison'),
    viewMode = _d[0],
    setViewMode = _d[1];
  var _e = useState(false),
    isFullscreen = _e[0],
    setIsFullscreen = _e[1];
  var _f = useState(false),
    loading = _f[0],
    setLoading = _f[1];
  var _g = useState(null),
    editingVariant = _g[0],
    setEditingVariant = _g[1];
  var _h = useState({}),
    editedContent = _h[0],
    setEditedContent = _h[1];
  var _j = useState(''),
    editNotes = _j[0],
    setEditNotes = _j[1];
  var _k = useState(false),
    _newVariantDialogOpen = _k[0],
    _setNewVariantDialogOpen = _k[1];
  // Auto-select first two variants for comparison
  React.useEffect(
    function () {
      if (testConfig.variants.length >= 2 && selectedVariants.length === 0) {
        setSelectedVariants([testConfig.variants[0].id, testConfig.variants[1].id]);
      }
    },
    [testConfig.variants, selectedVariants]
  );
  var _selectedVariantObjects = useMemo(
    function () {
      return selectedVariants
        .map(function (id) {
          return testConfig.variants.find(function (v) {
            return v.id === id;
          });
        })
        .filter(Boolean);
    },
    [selectedVariants, testConfig.variants]
  );
  var getPerformanceTrend = function (metric, baseline) {
    if (!baseline) return _jsx(TrendingFlat, { color: 'disabled' });
    var change = ((metric - baseline) / baseline) * 100;
    if (change > 5) return _jsx(TrendingUp, { color: 'success' });
    if (change < -5) return _jsx(TrendingDown, { color: 'error' });
    return _jsx(TrendingFlat, { color: 'primary' });
  };
  var getStatusColor = function (status) {
    switch (status) {
      case 'draft':
        return 'default';
      case 'running':
        return 'primary';
      case 'paused':
        return 'warning';
      case 'completed':
        return 'secondary';
      case 'winner':
        return 'success';
      default:
        return 'default';
    }
  };
  var handleStartEdit = useCallback(
    function (variantId) {
      var variant = testConfig.variants.find(function (v) {
        return v.id === variantId;
      });
      if (variant) {
        setEditingVariant(variantId);
        setEditedContent(variant.content);
        setEditNotes('');
      }
    },
    [testConfig.variants]
  );
  var handleSaveEdit = useCallback(
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var _error_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              if (!editingVariant) return [2 /*return*/];
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, 4, 5]);
              setLoading(true);
              return [4 /*yield*/, onSaveVariant(editingVariant, editedContent, editNotes)];
            case 2:
              _a.sent();
              setEditingVariant(null);
              setEditedContent({});
              setEditNotes('');
              return [3 /*break*/, 5];
            case 3:
              _error_1 = _a.sent();
              return [3 /*break*/, 5];
            case 4:
              setLoading(false);
              return [7 /*endfinally*/];
            case 5:
              return [2 /*return*/];
          }
        });
      });
    },
    [editingVariant, editedContent, editNotes, onSaveVariant]
  );
  var handleCancelEdit = useCallback(function () {
    setEditingVariant(null);
    setEditedContent({});
    setEditNotes('');
  }, []);
  var copyToClipboard = useCallback(function (content) {
    navigator.clipboard.writeText(content);
  }, []);
  var renderPerformanceMetrics = function (variant, baseline) {
    if (!variant.performance) {
      return _jsx(Typography, {
        variant: 'body2',
        color: 'textSecondary',
        children: 'No performance data yet',
      });
    }
    var performance = variant.performance;
    var baselinePerf = baseline === null || baseline === void 0 ? void 0 : baseline.performance;
    return _jsxs(Grid, {
      container: true,
      spacing: 2,
      children: [
        _jsxs(Grid, {
          item: true,
          xs: 6,
          children: [
            _jsxs(Box, {
              sx: { display: 'flex', alignItems: 'center', mb: 1 },
              children: [
                _jsx(Typography, { variant: 'body2', sx: { mr: 1 }, children: 'CTR:' }),
                _jsxs(Typography, {
                  variant: 'h6',
                  color: 'primary',
                  children: [(performance.ctr * 100).toFixed(2), '%'],
                }),
                getPerformanceTrend(
                  performance.ctr,
                  baselinePerf === null || baselinePerf === void 0 ? void 0 : baselinePerf.ctr
                ),
              ],
            }),
            _jsx(LinearProgress, {
              variant: 'determinate',
              value: performance.ctr * 100,
              sx: { height: 6, borderRadius: 3 },
            }),
          ],
        }),
        _jsxs(Grid, {
          item: true,
          xs: 6,
          children: [
            _jsxs(Box, {
              sx: { display: 'flex', alignItems: 'center', mb: 1 },
              children: [
                _jsx(Typography, { variant: 'body2', sx: { mr: 1 }, children: 'Engagement:' }),
                _jsx(Typography, {
                  variant: 'h6',
                  color: 'primary',
                  children: performance.engagement.toLocaleString(),
                }),
                getPerformanceTrend(
                  performance.engagement,
                  baselinePerf === null || baselinePerf === void 0
                    ? void 0
                    : baselinePerf.engagement
                ),
              ],
            }),
            _jsx(LinearProgress, {
              variant: 'determinate',
              value:
                (performance.engagement /
                  Math.max.apply(
                    Math,
                    testConfig.variants.map(function (v) {
                      var _a;
                      return (
                        ((_a = v.performance) === null || _a === void 0 ? void 0 : _a.engagement) ||
                        0
                      );
                    })
                  )) *
                100,
              color: 'secondary',
              sx: { height: 6, borderRadius: 3 },
            }),
          ],
        }),
        _jsxs(Grid, {
          item: true,
          xs: 6,
          children: [
            _jsxs(Typography, {
              variant: 'caption',
              color: 'textSecondary',
              children: ['Clicks: ', performance.clicks.toLocaleString()],
            }),
            _jsx('br', {}),
            _jsxs(Typography, {
              variant: 'caption',
              color: 'textSecondary',
              children: ['Impressions: ', performance.impressions.toLocaleString()],
            }),
          ],
        }),
        _jsxs(Grid, {
          item: true,
          xs: 6,
          children: [
            _jsxs(Typography, {
              variant: 'caption',
              color: 'textSecondary',
              children: ['Conversions: ', performance.conversions.toLocaleString()],
            }),
            _jsx('br', {}),
            _jsxs(Typography, {
              variant: 'caption',
              color: 'textSecondary',
              children: ['Cost: $', performance.cost.toFixed(2)],
            }),
          ],
        }),
        _jsx(Grid, {
          item: true,
          xs: 12,
          children: _jsxs(Box, {
            sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
            children: [
              _jsxs(Typography, {
                variant: 'caption',
                children: ['Confidence: ', (performance.confidenceLevel * 100).toFixed(1), '%'],
              }),
              _jsx(LinearProgress, {
                variant: 'determinate',
                value: performance.confidenceLevel * 100,
                color: performance.confidenceLevel > 0.95 ? 'success' : 'warning',
                sx: { width: 100, height: 4, borderRadius: 2 },
              }),
            ],
          }),
        }),
      ],
    });
  };
  var renderVariantCard = function (variant, index) {
    var isEditing = editingVariant === variant.id;
    var isBaseline = index === 0;
    var baselineVariant = testConfig.variants[0];
    return _jsx(
      Card,
      {
        sx: {
          mb: 2,
          border: selectedVariants.includes(variant.id) ? 2 : 1,
          borderColor: selectedVariants.includes(variant.id) ? 'primary.main' : 'divider',
        },
        children: _jsxs(CardContent, {
          children: [
            _jsxs(Box, {
              sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 },
              children: [
                _jsxs(Box, {
                  sx: { display: 'flex', alignItems: 'center', flex: 1 },
                  children: [
                    _jsx(Badge, {
                      badgeContent: variant.status === 'winner' ? '👑' : '',
                      color: 'primary',
                      children: _jsx(Avatar, {
                        sx: { mr: 2, bgcolor: getStatusColor(variant.status) + '.main' },
                        children: variant.name.charAt(0).toUpperCase(),
                      }),
                    }),
                    _jsxs(Box, {
                      children: [
                        _jsx(Typography, { variant: 'h6', children: variant.name }),
                        _jsxs(Box, {
                          sx: { display: 'flex', alignItems: 'center', gap: 1 },
                          children: [
                            _jsx(Chip, {
                              label: variant.status.replace('_', ' ').toUpperCase(),
                              color: getStatusColor(variant.status),
                              size: 'small',
                            }),
                            _jsxs(Typography, {
                              variant: 'caption',
                              color: 'textSecondary',
                              children: [variant.trafficAllocation, '% traffic'],
                            }),
                            isBaseline &&
                              _jsx(Chip, { label: 'Baseline', size: 'small', variant: 'outlined' }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                _jsxs(Box, {
                  sx: { display: 'flex', gap: 1 },
                  children: [
                    _jsx(Tooltip, {
                      title: 'Copy content',
                      children: _jsx(IconButton, {
                        size: 'small',
                        onClick: function () {
                          return copyToClipboard(JSON.stringify(variant.content, null, 2));
                        },
                        children: _jsx(FaCopy, {}),
                      }),
                    }),
                    _jsx(Tooltip, {
                      title: 'Edit variant',
                      children: _jsx(IconButton, {
                        size: 'small',
                        onClick: function () {
                          return handleStartEdit(variant.id);
                        },
                        disabled: loading || variant.status === 'running',
                        children: _jsx(MdThumbUp, {}),
                      }),
                    }),
                    variant.status !== 'winner' &&
                      variant.performance &&
                      variant.performance.confidenceLevel > 0.95 &&
                      _jsx(Tooltip, {
                        title: 'Declare winner',
                        children: _jsx(IconButton, {
                          size: 'small',
                          color: 'success',
                          onClick: function () {
                            return onDeclareWinner(variant.id);
                          },
                          disabled: loading,
                          children: _jsx(MdThumbUp, {}),
                        }),
                      }),
                  ],
                }),
              ],
            }),
            _jsxs(Box, {
              sx: { mb: 2 },
              children: [
                variant.type === 'image' &&
                  variant.content.image_url &&
                  _jsxs(Box, {
                    sx: { mb: 2 },
                    children: [
                      _jsx('img', {
                        src: variant.content.image_url,
                        alt: 'Variant '.concat(variant.name),
                        style: { width: '100%', maxWidth: 300, height: 'auto', borderRadius: 8 },
                      }),
                      variant.content.image_prompt &&
                        _jsxs(Typography, {
                          variant: 'caption',
                          display: 'block',
                          sx: { mt: 1, fontStyle: 'italic' },
                          children: ['Prompt: ', variant.content.image_prompt],
                        }),
                    ],
                  }),
                (variant.type === 'caption' || variant.type === 'complete_post') &&
                  variant.content.text &&
                  _jsx(Box, {
                    sx: {
                      backgroundColor: isEditing ? 'transparent' : '#f5f5f5',
                      p: 2,
                      borderRadius: 1,
                      minHeight: '80px',
                    },
                    children: isEditing
                      ? _jsx(TextField, {
                          multiline: true,
                          fullWidth: true,
                          minRows: 4,
                          value: editedContent.text || '',
                          onChange: function (e) {
                            return setEditedContent(function (prev) {
                              return __assign(__assign({}, prev), { text: e.target.value });
                            });
                          },
                          placeholder: 'Edit caption text...',
                          variant: 'outlined',
                        })
                      : _jsx(Typography, {
                          variant: 'body2',
                          sx: { whiteSpace: 'pre-wrap' },
                          children: variant.content.text,
                        }),
                  }),
              ],
            }),
            viewMode === 'performance' &&
              _jsxs(Box, {
                sx: { mt: 2 },
                children: [
                  _jsx(Typography, {
                    variant: 'subtitle2',
                    sx: { mb: 1 },
                    children: 'Performance Metrics',
                  }),
                  renderPerformanceMetrics(variant, !isBaseline ? baselineVariant : undefined),
                ],
              }),
            _jsxs(Box, {
              sx: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2,
                pt: 2,
                borderTop: 1,
                borderColor: 'divider',
              },
              children: [
                _jsxs(Typography, {
                  variant: 'caption',
                  color: 'textSecondary',
                  children: [
                    'Created: ',
                    new Date(variant.created_at).toLocaleDateString(),
                    ' by ',
                    variant.author,
                  ],
                }),
                variant.notes &&
                  _jsx(Tooltip, {
                    title: variant.notes,
                    children: _jsx(Chip, {
                      label: 'Has Notes',
                      size: 'small',
                      variant: 'outlined',
                    }),
                  }),
              ],
            }),
          ],
        }),
      },
      variant.id
    );
  };
  var renderTrafficAllocation = function () {
    var totalAllocation = testConfig.variants.reduce(function (sum, v) {
      return sum + v.trafficAllocation;
    }, 0);
    return _jsxs(Box, {
      children: [
        _jsx(Typography, { variant: 'h6', sx: { mb: 2 }, children: 'Traffic Allocation' }),
        testConfig.variants.map(function (variant) {
          return _jsxs(
            Box,
            {
              sx: { mb: 2 },
              children: [
                _jsxs(Box, {
                  sx: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                  },
                  children: [
                    _jsx(Typography, { variant: 'body2', children: variant.name }),
                    _jsxs(Typography, {
                      variant: 'body2',
                      color: 'primary',
                      children: [variant.trafficAllocation, '%'],
                    }),
                  ],
                }),
                _jsx(LinearProgress, {
                  variant: 'determinate',
                  value: variant.trafficAllocation,
                  sx: { height: 8, borderRadius: 4 },
                }),
              ],
            },
            variant.id
          );
        }),
        _jsx(Box, {
          sx: {
            mt: 2,
            p: 2,
            backgroundColor: totalAllocation === 100 ? 'success.light' : 'warning.light',
            borderRadius: 1,
          },
          children: _jsxs(Typography, {
            variant: 'caption',
            children: [
              'Total Allocation: ',
              totalAllocation,
              '% ',
              totalAllocation !== 100 && '(Must equal 100%)',
            ],
          }),
        }),
      ],
    });
  };
  return _jsxs(Dialog, {
    open: isOpen,
    onClose: onClose,
    maxWidth: 'xl',
    fullWidth: true,
    fullScreen: isFullscreen,
    sx: {
      '& .MuiDialog-paper': {
        height: isFullscreen ? '100vh' : '90vh',
      },
    },
    children: [
      _jsx(DialogTitle, {
        children: _jsxs(Box, {
          sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
          children: [
            _jsxs(Box, {
              children: [
                _jsx(Typography, { variant: 'h6', children: title }),
                _jsxs(Typography, {
                  variant: 'subtitle2',
                  color: 'textSecondary',
                  children: [
                    testConfig.name,
                    ' \u2022 ',
                    testConfig.status.toUpperCase(),
                    ' \u2022 ',
                    testConfig.variants.length,
                    ' ',
                    'variants',
                  ],
                }),
              ],
            }),
            _jsxs(Box, {
              sx: { display: 'flex', alignItems: 'center', gap: 1 },
              children: [
                _jsxs(FormControl, {
                  size: 'small',
                  sx: { minWidth: 120 },
                  children: [
                    _jsx(InputLabel, { children: 'View Mode' }),
                    _jsxs(Select, {
                      value: viewMode,
                      onChange: function (e) {
                        return setViewMode(e.target.value);
                      },
                      label: 'View Mode',
                      children: [
                        _jsx(MenuItem, { value: 'comparison', children: 'Comparison' }),
                        _jsx(MenuItem, { value: 'performance', children: 'Performance' }),
                        _jsx(MenuItem, { value: 'traffic', children: 'Traffic' }),
                      ],
                    }),
                  ],
                }),
                _jsx(IconButton, {
                  onClick: function () {
                    return setIsFullscreen(!isFullscreen);
                  },
                  children: isFullscreen ? _jsx(MdFullscreenExit, {}) : _jsx(MdFullscreen, {}),
                }),
                _jsx(IconButton, { onClick: onClose, children: _jsx(FaTimes, {}) }),
              ],
            }),
          ],
        }),
      }),
      _jsxs(DialogContent, {
        sx: { p: 2 },
        children: [
          _jsx(Box, {
            sx: { mb: 3, p: 2, backgroundColor: 'primary.light', borderRadius: 1 },
            children: _jsxs(Box, {
              sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
              children: [
                _jsxs(Box, {
                  children: [
                    _jsxs(Typography, {
                      variant: 'h6',
                      color: 'primary.contrastText',
                      children: ['Test Status: ', testConfig.status.toUpperCase()],
                    }),
                    _jsxs(Typography, {
                      variant: 'body2',
                      color: 'primary.contrastText',
                      children: [
                        'Primary Metric: ',
                        testConfig.primaryMetric.toUpperCase(),
                        ' | Min Sample:',
                        ' ',
                        testConfig.minSampleSize.toLocaleString(),
                      ],
                    }),
                  ],
                }),
                _jsxs(Box, {
                  sx: { display: 'flex', gap: 1 },
                  children: [
                    testConfig.status === 'draft' &&
                      _jsx(Button, {
                        variant: 'contained',
                        color: 'success',
                        onClick: onStartTest,
                        disabled: loading,
                        startIcon: _jsx(FaPlay, {}),
                        children: 'Start Test',
                      }),
                    testConfig.status === 'running' &&
                      _jsx(Button, {
                        variant: 'contained',
                        color: 'warning',
                        onClick: onPauseTest,
                        disabled: loading,
                        startIcon: _jsx(FaPause, {}),
                        children: 'Pause Test',
                      }),
                  ],
                }),
              ],
            }),
          }),
          viewMode === 'traffic'
            ? renderTrafficAllocation()
            : _jsx(Grid, {
                container: true,
                spacing: 2,
                children: testConfig.variants.map(function (variant, index) {
                  return _jsx(
                    Grid,
                    {
                      item: true,
                      xs: 12,
                      md: viewMode === 'comparison' ? 6 : 12,
                      children: renderVariantCard(variant, index),
                    },
                    variant.id
                  );
                }),
              }),
          editingVariant &&
            _jsx(Box, {
              sx: {
                mt: 2,
                p: 2,
                backgroundColor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
              },
              children: _jsx(TextField, {
                fullWidth: true,
                label: 'Edit Notes (Optional)',
                placeholder: 'Describe the changes you made...',
                value: editNotes,
                onChange: function (e) {
                  return setEditNotes(e.target.value);
                },
                size: 'small',
              }),
            }),
        ],
      }),
      _jsx(DialogActions, {
        sx: { p: 2 },
        children: editingVariant
          ? _jsxs(_Fragment, {
              children: [
                _jsx(Button, { onClick: handleCancelEdit, disabled: loading, children: 'Cancel' }),
                _jsx(Button, {
                  variant: 'contained',
                  onClick: handleSaveEdit,
                  disabled: loading,
                  startIcon: _jsx(FaSave, {}),
                  children: 'Save Changes',
                }),
              ],
            })
          : _jsxs(_Fragment, {
              children: [
                _jsx(Button, { onClick: onClose, children: 'Close' }),
                _jsx(Button, {
                  variant: 'outlined',
                  onClick: function () {
                    return setNewVariantDialogOpen(true);
                  },
                  disabled: testConfig.status === 'running',
                  children: 'Add Variant',
                }),
              ],
            }),
      }),
    ],
  });
};
export default ABTestVariantComparison;
//# sourceMappingURL=ABTestVariantComparison.js.map
