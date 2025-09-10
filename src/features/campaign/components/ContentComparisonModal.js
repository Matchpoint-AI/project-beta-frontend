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
  Tabs,
  Tab,
  Card,
  CardContent,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { FaSave, FaTimes, FaUndo, FaCopy } from 'react-icons/fa';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
var TabPanel = function (_a) {
  var children = _a.children,
    value = _a.value,
    index = _a.index;
  return _jsx('div', {
    role: 'tabpanel',
    hidden: value !== index,
    id: 'content-tabpanel-'.concat(index),
    'aria-labelledby': 'content-tab-'.concat(index),
    children: value === index && _jsx(Box, { sx: { p: 0 }, children: children }),
  });
};
var ContentComparisonModal = function (_a) {
  var isOpen = _a.isOpen,
    onClose = _a.onClose,
    itemId = _a.itemId,
    itemType = _a.itemType,
    versions = _a.versions,
    onSave = _a.onSave,
    onRevert = _a.onRevert,
    _b = _a.title,
    title = _b === void 0 ? 'Content Comparison & Edit' : _b;
  var _c = useState(0),
    activeTab = _c[0],
    setActiveTab = _c[1];
  var _d = useState(''),
    editedContent = _d[0],
    setEditedContent = _d[1];
  var _e = useState(''),
    editNotes = _e[0],
    setEditNotes = _e[1];
  var _f = useState(false),
    isEditing = _f[0],
    setIsEditing = _f[1];
  var _g = useState(false),
    isFullscreen = _g[0],
    setIsFullscreen = _g[1];
  var _h = useState(false),
    showDiffMode = _h[0],
    setShowDiffMode = _h[1];
  var _j = useState(false),
    loading = _j[0],
    setLoading = _j[1];
  var _k = useState([0, 1]),
    selectedVersions = _k[0],
    setSelectedVersions = _k[1];
  var currentVersion = versions[0]; // Assume first version is current
  var latestContent =
    (currentVersion === null || currentVersion === void 0 ? void 0 : currentVersion.content) || '';
  // Initialize edited content when modal opens or versions change
  React.useEffect(
    function () {
      if (versions.length > 0 && !isEditing) {
        setEditedContent(latestContent);
      }
    },
    [versions, latestContent, isEditing]
  );
  // Generate diff display
  var getDiffDisplay = useMemo(
    function () {
      var _a, _b;
      if (!showDiffMode || selectedVersions[0] === selectedVersions[1]) {
        return null;
      }
      var version1 =
        ((_a = versions[selectedVersions[0]]) === null || _a === void 0 ? void 0 : _a.content) ||
        '';
      var version2 =
        ((_b = versions[selectedVersions[1]]) === null || _b === void 0 ? void 0 : _b.content) ||
        '';
      // Simple word-level diff (in production, use a proper diff library like react-diff-view)
      var words1 = version1.split(/(\s+)/);
      var words2 = version2.split(/(\s+)/);
      return { version1: version1, version2: version2, words1: words1, words2: words2 };
    },
    [showDiffMode, selectedVersions, versions]
  );
  var handleTabChange = useCallback(
    function (event, newValue) {
      setActiveTab(newValue);
      if (newValue < versions.length && !isEditing) {
        setEditedContent(versions[newValue].content);
      }
    },
    [versions, isEditing]
  );
  var handleStartEdit = useCallback(
    function () {
      setIsEditing(true);
      setEditedContent(latestContent);
    },
    [latestContent]
  );
  var handleCancelEdit = useCallback(
    function () {
      setIsEditing(false);
      setEditedContent(latestContent);
      setEditNotes('');
    },
    [latestContent]
  );
  var handleSave = useCallback(
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              if (!editedContent.trim()) return [2 /*return*/];
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, 4, 5]);
              setLoading(true);
              return [4 /*yield*/, onSave(itemId, editedContent, editNotes)];
            case 2:
              _a.sent();
              setIsEditing(false);
              setEditNotes('');
              return [3 /*break*/, 5];
            case 3:
              error_1 = _a.sent();
              console.error('Failed to save content:', error_1);
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
    [itemId, editedContent, editNotes, onSave]
  );
  var handleRevert = useCallback(
    function (versionId) {
      return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, 3, 4]);
              setLoading(true);
              return [4 /*yield*/, onRevert(itemId, versionId)];
            case 1:
              _a.sent();
              return [3 /*break*/, 4];
            case 2:
              error_2 = _a.sent();
              console.error('Failed to revert content:', error_2);
              return [3 /*break*/, 4];
            case 3:
              setLoading(false);
              return [7 /*endfinally*/];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    },
    [itemId, onRevert]
  );
  var copyToClipboard = useCallback(function (content) {
    navigator.clipboard.writeText(content);
  }, []);
  var getVersionTypeColor = function (type) {
    switch (type) {
      case 'original':
        return 'default';
      case 'ai_generated':
        return 'primary';
      case 'human_edited':
        return 'secondary';
      case 'ai_revised':
        return 'warning';
      default:
        return 'default';
    }
  };
  var getVersionTypeLabel = function (type) {
    switch (type) {
      case 'original':
        return 'Original';
      case 'ai_generated':
        return 'AI Generated';
      case 'human_edited':
        return 'Human Edited';
      case 'ai_revised':
        return 'AI Revised';
      default:
        return 'Unknown';
    }
  };
  var renderDiffView = function () {
    if (!getDiffDisplay) return null;
    var version1 = getDiffDisplay.version1,
      version2 = getDiffDisplay.version2;
    return _jsxs(Box, {
      sx: { display: 'flex', gap: 2, height: '400px' },
      children: [
        _jsx(Card, {
          sx: { flex: 1 },
          children: _jsxs(CardContent, {
            children: [
              _jsxs(Typography, {
                variant: 'subtitle2',
                sx: { mb: 1, color: 'error.main' },
                children: ['Version ', selectedVersions[0] + 1, ' (Before)'],
              }),
              _jsx(Box, {
                sx: {
                  backgroundColor: '#ffebee',
                  p: 2,
                  borderRadius: 1,
                  height: '300px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                },
                children: version1,
              }),
            ],
          }),
        }),
        _jsx(Card, {
          sx: { flex: 1 },
          children: _jsxs(CardContent, {
            children: [
              _jsxs(Typography, {
                variant: 'subtitle2',
                sx: { mb: 1, color: 'success.main' },
                children: ['Version ', selectedVersions[1] + 1, ' (After)'],
              }),
              _jsx(Box, {
                sx: {
                  backgroundColor: '#e8f5e8',
                  p: 2,
                  borderRadius: 1,
                  height: '300px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                },
                children: version2,
              }),
            ],
          }),
        }),
      ],
    });
  };
  var renderVersionView = function (version, index) {
    var _a;
    var isCurrentlyShown = index === activeTab;
    return _jsx(
      Card,
      {
        sx: { mb: 2 },
        children: _jsxs(CardContent, {
          children: [
            _jsxs(Box, {
              sx: { display: 'flex', alignItems: 'center', justifyContent: 'between', mb: 2 },
              children: [
                _jsxs(Box, {
                  sx: { display: 'flex', alignItems: 'center', flex: 1 },
                  children: [
                    _jsx(Chip, {
                      label: getVersionTypeLabel(version.type),
                      color: getVersionTypeColor(version.type),
                      size: 'small',
                      sx: { mr: 1 },
                    }),
                    _jsxs(Typography, {
                      variant: 'caption',
                      color: 'textSecondary',
                      children: [
                        new Date(version.timestamp).toLocaleString(),
                        ' by ',
                        version.author,
                      ],
                    }),
                    ((_a = version.metadata) === null || _a === void 0
                      ? void 0
                      : _a.qualityScore) &&
                      _jsx(Chip, {
                        label: ''.concat(Math.round(version.metadata.qualityScore * 100), '%'),
                        size: 'small',
                        color: version.metadata.qualityScore > 0.8 ? 'success' : 'warning',
                        sx: { ml: 1 },
                      }),
                  ],
                }),
                _jsxs(Box, {
                  sx: { display: 'flex', gap: 1 },
                  children: [
                    _jsx(Tooltip, {
                      title: 'Copy to clipboard',
                      children: _jsx(IconButton, {
                        size: 'small',
                        onClick: function () {
                          return copyToClipboard(version.content);
                        },
                        children: _jsx(FaCopy, {}),
                      }),
                    }),
                    index > 0 &&
                      _jsx(Tooltip, {
                        title: 'Revert to this version',
                        children: _jsx(IconButton, {
                          size: 'small',
                          onClick: function () {
                            return handleRevert(version.id);
                          },
                          disabled: loading,
                          children: _jsx(FaUndo, {}),
                        }),
                      }),
                  ],
                }),
              ],
            }),
            version.metadata &&
              _jsxs(Box, {
                sx: { mb: 2 },
                children: [
                  version.metadata.prompt &&
                    _jsxs(Typography, {
                      variant: 'caption',
                      display: 'block',
                      sx: { mb: 0.5 },
                      children: [
                        _jsx('strong', { children: 'Prompt:' }),
                        ' ',
                        version.metadata.prompt,
                      ],
                    }),
                  version.metadata.model &&
                    _jsxs(Typography, {
                      variant: 'caption',
                      display: 'block',
                      sx: { mb: 0.5 },
                      children: [
                        _jsx('strong', { children: 'Model:' }),
                        ' ',
                        version.metadata.model,
                      ],
                    }),
                  version.metadata.feedback &&
                    _jsxs(Typography, {
                      variant: 'caption',
                      display: 'block',
                      sx: { mb: 0.5 },
                      children: [
                        _jsx('strong', { children: 'Feedback:' }),
                        ' ',
                        version.metadata.feedback,
                      ],
                    }),
                ],
              }),
            _jsx(Box, {
              sx: {
                backgroundColor: isCurrentlyShown && isEditing ? 'transparent' : '#f5f5f5',
                p: 2,
                borderRadius: 1,
                minHeight: '100px',
              },
              children:
                isCurrentlyShown && isEditing
                  ? _jsx(TextField, {
                      multiline: true,
                      fullWidth: true,
                      minRows: 6,
                      value: editedContent,
                      onChange: function (e) {
                        return setEditedContent(e.target.value);
                      },
                      placeholder: 'Edit '.concat(itemType, ' content...'),
                      variant: 'outlined',
                    })
                  : _jsx(Typography, {
                      variant: 'body2',
                      sx: { whiteSpace: 'pre-wrap' },
                      children: version.content,
                    }),
            }),
          ],
        }),
      },
      version.id
    );
  };
  return _jsxs(Dialog, {
    open: isOpen,
    onClose: onClose,
    maxWidth: 'lg',
    fullWidth: true,
    fullScreen: isFullscreen,
    sx: {
      '& .MuiDialog-paper': {
        height: isFullscreen ? '100vh' : '80vh',
      },
    },
    children: [
      _jsx(DialogTitle, {
        children: _jsxs(Box, {
          sx: { display: 'flex', alignItems: 'center', justifyContent: 'between' },
          children: [
            _jsx(Typography, { variant: 'h6', children: title }),
            _jsxs(Box, {
              sx: { display: 'flex', alignItems: 'center', gap: 1 },
              children: [
                _jsx(FormControlLabel, {
                  control: _jsx(Switch, {
                    checked: showDiffMode,
                    onChange: function (e) {
                      return setShowDiffMode(e.target.checked);
                    },
                    size: 'small',
                  }),
                  label: 'Diff Mode',
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
        sx: { p: 0 },
        children: [
          showDiffMode
            ? _jsxs(Box, {
                sx: { p: 2 },
                children: [
                  _jsxs(Box, {
                    sx: { mb: 2, display: 'flex', gap: 2 },
                    children: [
                      _jsx(TextField, {
                        select: true,
                        label: 'Compare From',
                        size: 'small',
                        value: selectedVersions[0],
                        onChange: function (e) {
                          return setSelectedVersions([Number(e.target.value), selectedVersions[1]]);
                        },
                        SelectProps: { native: true },
                        children: versions.map(function (version, index) {
                          return _jsxs(
                            'option',
                            {
                              value: index,
                              children: [
                                'Version ',
                                index + 1,
                                ' (',
                                getVersionTypeLabel(version.type),
                                ')',
                              ],
                            },
                            version.id
                          );
                        }),
                      }),
                      _jsx(TextField, {
                        select: true,
                        label: 'Compare To',
                        size: 'small',
                        value: selectedVersions[1],
                        onChange: function (e) {
                          return setSelectedVersions([selectedVersions[0], Number(e.target.value)]);
                        },
                        SelectProps: { native: true },
                        children: versions.map(function (version, index) {
                          return _jsxs(
                            'option',
                            {
                              value: index,
                              children: [
                                'Version ',
                                index + 1,
                                ' (',
                                getVersionTypeLabel(version.type),
                                ')',
                              ],
                            },
                            version.id
                          );
                        }),
                      }),
                    ],
                  }),
                  renderDiffView(),
                ],
              })
            : _jsxs(Box, {
                children: [
                  _jsx(Tabs, {
                    value: activeTab,
                    onChange: handleTabChange,
                    variant: 'scrollable',
                    scrollButtons: 'auto',
                    sx: { borderBottom: 1, borderColor: 'divider', px: 2 },
                    children: versions.map(function (version, index) {
                      return _jsx(
                        Tab,
                        {
                          label: _jsxs(Box, {
                            sx: { display: 'flex', alignItems: 'center', gap: 1 },
                            children: [
                              _jsxs('span', { children: ['Version ', index + 1] }),
                              _jsx(Chip, {
                                label: getVersionTypeLabel(version.type),
                                size: 'small',
                                color: getVersionTypeColor(version.type),
                              }),
                            ],
                          }),
                        },
                        version.id
                      );
                    }),
                  }),
                  _jsx(Box, {
                    sx: { p: 2 },
                    children: versions.map(function (version, index) {
                      return _jsx(
                        TabPanel,
                        {
                          value: activeTab,
                          index: index,
                          children: renderVersionView(version, index),
                        },
                        version.id
                      );
                    }),
                  }),
                ],
              }),
          isEditing &&
            _jsx(Box, {
              sx: { px: 2, pb: 2 },
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
        children: isEditing
          ? _jsxs(_Fragment, {
              children: [
                _jsx(Button, { onClick: handleCancelEdit, disabled: loading, children: 'Cancel' }),
                _jsx(Button, {
                  variant: 'contained',
                  onClick: handleSave,
                  disabled: !editedContent.trim() || loading,
                  startIcon: _jsx(FaSave, {}),
                  children: 'Save Changes',
                }),
              ],
            })
          : _jsxs(_Fragment, {
              children: [
                _jsx(Button, { onClick: onClose, children: 'Close' }),
                _jsx(Button, {
                  variant: 'contained',
                  onClick: handleStartEdit,
                  disabled: versions.length === 0,
                  children: 'Edit Current',
                }),
              ],
            }),
      }),
    ],
  });
};
export default ContentComparisonModal;
//# sourceMappingURL=ContentComparisonModal.js.map
