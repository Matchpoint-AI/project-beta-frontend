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
import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { FaCheck, FaTimes, FaEdit, FaRedo, FaEye, FaEyeSlash } from 'react-icons/fa';
// import { MdCompare, MdHistory } from 'react-icons/md';
import { useAuth } from '../../../features/auth/context/AuthContext';
import ErrorToast from '../../../shared/components/feedback/ErrorToast';
var HITLReviewPanel = function (_a) {
  var items = _a.items,
    onApprove = _a.onApprove,
    onReject = _a.onReject,
    onEdit = _a.onEdit,
    onRegenerate = _a.onRegenerate,
    onClose = _a.onClose,
    isOpen = _a.isOpen,
    _campaignId = _a.campaignId;
  var _b = useState(null),
    selectedItem = _b[0],
    setSelectedItem = _b[1];
  var _c = useState(null),
    editingItem = _c[0],
    setEditingItem = _c[1];
  var _d = useState(''),
    editContent = _d[0],
    setEditContent = _d[1];
  var _e = useState({}),
    showDiff = _e[0],
    setShowDiff = _e[1];
  var _f = useState({}),
    feedback = _f[0],
    setFeedback = _f[1];
  var _g = useState({}),
    loading = _g[0],
    setLoading = _g[1];
  var _h = useState(null),
    error = _h[0],
    setError = _h[1];
  var profile = useAuth().profile;
  var handleApprove = useCallback(
    function (itemId) {
      return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, 3, 4]);
              setLoading(function (prev) {
                var _a;
                return __assign(__assign({}, prev), ((_a = {}), (_a[itemId] = true), _a));
              });
              setError(null);
              return [4 /*yield*/, onApprove(itemId)];
            case 1:
              _a.sent();
              return [3 /*break*/, 4];
            case 2:
              err_1 = _a.sent();
              setError(err_1 instanceof Error ? err_1.message : 'Failed to approve item');
              return [3 /*break*/, 4];
            case 3:
              setLoading(function (prev) {
                var _a;
                return __assign(__assign({}, prev), ((_a = {}), (_a[itemId] = false), _a));
              });
              return [7 /*endfinally*/];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    },
    [onApprove]
  );
  var handleReject = useCallback(
    function (itemId) {
      return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, 3, 4]);
              setLoading(function (prev) {
                var _a;
                return __assign(__assign({}, prev), ((_a = {}), (_a[itemId] = true), _a));
              });
              setError(null);
              return [4 /*yield*/, onReject(itemId, feedback[itemId])];
            case 1:
              _a.sent();
              setFeedback(function (prev) {
                var _a;
                return __assign(__assign({}, prev), ((_a = {}), (_a[itemId] = ''), _a));
              });
              return [3 /*break*/, 4];
            case 2:
              err_2 = _a.sent();
              setError(err_2 instanceof Error ? err_2.message : 'Failed to reject item');
              return [3 /*break*/, 4];
            case 3:
              setLoading(function (prev) {
                var _a;
                return __assign(__assign({}, prev), ((_a = {}), (_a[itemId] = false), _a));
              });
              return [7 /*endfinally*/];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    },
    [onReject, feedback]
  );
  var handleEdit = useCallback(
    function (itemId) {
      return __awaiter(void 0, void 0, void 0, function () {
        var item, err_3;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              if (editingItem !== itemId) {
                item = items.find(function (i) {
                  return i.id === itemId;
                });
                if (item) {
                  setEditContent(item.content);
                  setEditingItem(itemId);
                }
                return [2 /*return*/];
              }
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, 4, 5]);
              setLoading(function (prev) {
                var _a;
                return __assign(__assign({}, prev), ((_a = {}), (_a[itemId] = true), _a));
              });
              setError(null);
              return [4 /*yield*/, onEdit(itemId, editContent)];
            case 2:
              _a.sent();
              setEditingItem(null);
              setEditContent('');
              return [3 /*break*/, 5];
            case 3:
              err_3 = _a.sent();
              setError(err_3 instanceof Error ? err_3.message : 'Failed to edit item');
              return [3 /*break*/, 5];
            case 4:
              setLoading(function (prev) {
                var _a;
                return __assign(__assign({}, prev), ((_a = {}), (_a[itemId] = false), _a));
              });
              return [7 /*endfinally*/];
            case 5:
              return [2 /*return*/];
          }
        });
      });
    },
    [editingItem, editContent, onEdit, items]
  );
  var handleRegenerate = useCallback(
    function (itemId) {
      return __awaiter(void 0, void 0, void 0, function () {
        var targetedChanges, err_4;
        var _a;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              _b.trys.push([0, 2, 3, 4]);
              setLoading(function (prev) {
                var _a;
                return __assign(__assign({}, prev), ((_a = {}), (_a[itemId] = true), _a));
              });
              setError(null);
              targetedChanges =
                (_a = feedback[itemId]) === null || _a === void 0
                  ? void 0
                  : _a
                      .split(',')
                      .map(function (s) {
                        return s.trim();
                      })
                      .filter(Boolean);
              return [4 /*yield*/, onRegenerate(itemId, targetedChanges)];
            case 1:
              _b.sent();
              setFeedback(function (prev) {
                var _a;
                return __assign(__assign({}, prev), ((_a = {}), (_a[itemId] = ''), _a));
              });
              return [3 /*break*/, 4];
            case 2:
              err_4 = _b.sent();
              setError(err_4 instanceof Error ? err_4.message : 'Failed to regenerate item');
              return [3 /*break*/, 4];
            case 3:
              setLoading(function (prev) {
                var _a;
                return __assign(__assign({}, prev), ((_a = {}), (_a[itemId] = false), _a));
              });
              return [7 /*endfinally*/];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    },
    [onRegenerate, feedback]
  );
  var toggleDiff = useCallback(function (itemId) {
    setShowDiff(function (prev) {
      var _a;
      return __assign(__assign({}, prev), ((_a = {}), (_a[itemId] = !prev[itemId]), _a));
    });
  }, []);
  var getStatusColor = function (status) {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'edited':
        return 'warning';
      default:
        return 'default';
    }
  };
  var getQualityScoreColor = function (score) {
    if (!score) return 'default';
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };
  var renderContentDiff = function (item) {
    if (!item.originalContent || !showDiff[item.id]) {
      return _jsx(Typography, {
        variant: 'body2',
        sx: { whiteSpace: 'pre-wrap', mb: 1 },
        children:
          editingItem === item.id
            ? _jsx('textarea', {
                value: editContent,
                onChange: function (e) {
                  return setEditContent(e.target.value);
                },
                className: 'w-full h-32 p-2 border rounded resize-none',
                placeholder: 'Edit content...',
              })
            : item.content,
      });
    }
    // Simple diff display - in production, use a proper diff library
    var original = item.originalContent.split(' ');
    var current = item.content.split(' ');
    return _jsxs(Box, {
      sx: { mb: 1 },
      children: [
        _jsx(Typography, { variant: 'caption', color: 'textSecondary', children: 'Original:' }),
        _jsx(Typography, {
          variant: 'body2',
          sx: {
            background: '#ffebee',
            p: 1,
            borderRadius: 1,
            mb: 1,
            whiteSpace: 'pre-wrap',
          },
          children: item.originalContent,
        }),
        _jsx(Typography, { variant: 'caption', color: 'textSecondary', children: 'Current:' }),
        _jsx(Typography, {
          variant: 'body2',
          sx: {
            background: '#e8f5e8',
            p: 1,
            borderRadius: 1,
            whiteSpace: 'pre-wrap',
          },
          children: item.content,
        }),
      ],
    });
  };
  return _jsxs(_Fragment, {
    children: [
      _jsx(Dialog, {
        open: isOpen,
        onClose: onClose,
        maxWidth: 'lg',
        fullWidth: true,
        sx: {
          '& .MuiDialog-paper': {
            height: '90vh',
            maxHeight: '90vh',
          },
        },
        children: _jsx(DialogContent, {
          sx: { p: 0 },
          children: _jsxs(Box, {
            sx: { display: 'flex', height: '100%' },
            children: [
              _jsxs(Box, {
                sx: { width: '30%', borderRight: 1, borderColor: 'divider', p: 2 },
                children: [
                  _jsx(Typography, {
                    variant: 'h6',
                    sx: { mb: 2 },
                    children: 'Content Review Queue',
                  }),
                  items.map(function (item) {
                    return _jsx(
                      Card,
                      {
                        sx: {
                          mb: 1,
                          cursor: 'pointer',
                          border: selectedItem === item.id ? 2 : 1,
                          borderColor: selectedItem === item.id ? 'primary.main' : 'divider',
                        },
                        onClick: function () {
                          return setSelectedItem(item.id);
                        },
                        children: _jsxs(CardContent, {
                          sx: { p: 1.5, '&:last-child': { pb: 1.5 } },
                          children: [
                            _jsxs(Box, {
                              sx: { display: 'flex', alignItems: 'center', mb: 1 },
                              children: [
                                _jsx(Chip, { label: item.type, size: 'small', sx: { mr: 1 } }),
                                _jsx(Chip, {
                                  label: item.status,
                                  size: 'small',
                                  color: getStatusColor(item.status),
                                }),
                                item.qualityScore &&
                                  _jsx(Chip, {
                                    label: ''.concat(Math.round(item.qualityScore * 100), '%'),
                                    size: 'small',
                                    color: getQualityScoreColor(item.qualityScore),
                                    sx: { ml: 1 },
                                  }),
                              ],
                            }),
                            _jsxs(Typography, {
                              variant: 'body2',
                              noWrap: true,
                              children: [item.content.substring(0, 50), '...'],
                            }),
                          ],
                        }),
                      },
                      item.id
                    );
                  }),
                ],
              }),
              _jsx(Box, {
                sx: { width: '70%', p: 2 },
                children: selectedItem
                  ? (function () {
                      var item = items.find(function (i) {
                        return i.id === selectedItem;
                      });
                      if (!item) return null;
                      return _jsxs(Box, {
                        children: [
                          _jsxs(Box, {
                            sx: { display: 'flex', alignItems: 'center', mb: 2 },
                            children: [
                              _jsxs(Typography, {
                                variant: 'h6',
                                sx: { flex: 1 },
                                children: [
                                  item.type.charAt(0).toUpperCase() + item.type.slice(1),
                                  ' Review',
                                ],
                              }),
                              _jsx(Button, {
                                size: 'small',
                                startIcon: showDiff[item.id]
                                  ? _jsx(FaEyeSlash, {})
                                  : _jsx(FaEye, {}),
                                onClick: function () {
                                  return toggleDiff(item.id);
                                },
                                disabled: !item.originalContent,
                                sx: { mr: 1 },
                                children: showDiff[item.id] ? 'Hide Diff' : 'Show Diff',
                              }),
                            ],
                          }),
                          item.metadata &&
                            _jsxs(Box, {
                              sx: { mb: 2 },
                              children: [
                                _jsx(Typography, {
                                  variant: 'subtitle2',
                                  sx: { mb: 1 },
                                  children: 'Metadata:',
                                }),
                                _jsxs(Box, {
                                  sx: { display: 'flex', flexWrap: 'wrap', gap: 1 },
                                  children: [
                                    item.metadata.sceneType &&
                                      _jsx(Chip, {
                                        label: 'Scene: '.concat(item.metadata.sceneType),
                                        size: 'small',
                                      }),
                                    item.metadata.sceneSubtype &&
                                      _jsx(Chip, {
                                        label: 'Subtype: '.concat(item.metadata.sceneSubtype),
                                        size: 'small',
                                      }),
                                    item.metadata.brandCompliance &&
                                      _jsx(Chip, {
                                        label: 'Brand: '.concat(
                                          Math.round(item.metadata.brandCompliance * 100),
                                          '%'
                                        ),
                                        size: 'small',
                                        color:
                                          item.metadata.brandCompliance > 0.8
                                            ? 'success'
                                            : 'warning',
                                      }),
                                    item.metadata.diversityScore &&
                                      _jsx(Chip, {
                                        label: 'Diversity: '.concat(
                                          Math.round(item.metadata.diversityScore * 100),
                                          '%'
                                        ),
                                        size: 'small',
                                        color:
                                          item.metadata.diversityScore > 0.7
                                            ? 'success'
                                            : 'warning',
                                      }),
                                  ],
                                }),
                              ],
                            }),
                          _jsxs(Box, {
                            sx: { mb: 3 },
                            children: [
                              _jsx(Typography, {
                                variant: 'subtitle2',
                                sx: { mb: 1 },
                                children: 'Content:',
                              }),
                              renderContentDiff(item),
                            ],
                          }),
                          _jsxs(Box, {
                            sx: { mb: 3 },
                            children: [
                              _jsx(Typography, {
                                variant: 'subtitle2',
                                sx: { mb: 1 },
                                children: 'Feedback / Targeted Changes:',
                              }),
                              _jsx('textarea', {
                                value: feedback[item.id] || '',
                                onChange: function (e) {
                                  return setFeedback(function (prev) {
                                    var _a;
                                    return __assign(
                                      __assign({}, prev),
                                      ((_a = {}), (_a[item.id] = e.target.value), _a)
                                    );
                                  });
                                },
                                className: 'w-full h-20 p-2 border rounded resize-none',
                                placeholder:
                                  'Provide feedback or specify targeted changes (comma-separated)...',
                              }),
                            ],
                          }),
                          _jsxs(Box, {
                            sx: { display: 'flex', gap: 1, flexWrap: 'wrap' },
                            children: [
                              _jsx(Button, {
                                variant: 'contained',
                                color: 'success',
                                startIcon: _jsx(FaCheck, {}),
                                onClick: function () {
                                  return handleApprove(item.id);
                                },
                                disabled: loading[item.id] || item.status === 'approved',
                                children: 'Approve',
                              }),
                              _jsx(Button, {
                                variant: 'contained',
                                color: 'error',
                                startIcon: _jsx(FaTimes, {}),
                                onClick: function () {
                                  return handleReject(item.id);
                                },
                                disabled: loading[item.id] || item.status === 'rejected',
                                children: 'Reject',
                              }),
                              _jsx(Button, {
                                variant: 'outlined',
                                startIcon: _jsx(FaEdit, {}),
                                onClick: function () {
                                  return handleEdit(item.id);
                                },
                                disabled: loading[item.id],
                                children: editingItem === item.id ? 'Save Edit' : 'Edit',
                              }),
                              _jsx(Button, {
                                variant: 'outlined',
                                startIcon: _jsx(FaRedo, {}),
                                onClick: function () {
                                  return handleRegenerate(item.id);
                                },
                                disabled: loading[item.id],
                                children: 'Regenerate',
                              }),
                              editingItem === item.id &&
                                _jsx(Button, {
                                  variant: 'text',
                                  onClick: function () {
                                    setEditingItem(null);
                                    setEditContent('');
                                  },
                                  children: 'Cancel Edit',
                                }),
                            ],
                          }),
                        ],
                      });
                    })()
                  : _jsx(Box, {
                      sx: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: 'text.secondary',
                      },
                      children: _jsx(Typography, {
                        variant: 'h6',
                        children: 'Select an item to review',
                      }),
                    }),
              }),
            ],
          }),
        }),
      }),
      error &&
        _jsx(ErrorToast, {
          message: error,
          onClose: function () {
            return setError(null);
          },
        }),
    ],
  });
};
export default HITLReviewPanel;
//# sourceMappingURL=HITLReviewPanel.js.map
