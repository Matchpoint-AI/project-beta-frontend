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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Chip,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  CircularProgress,
  Collapse,
} from '@mui/material';
import { LuPlus, LuTrash2, LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { BrandContext } from '../../context/BrandContext';
import FormsContainer from '../shared/FormsContainer';
import NextButton from '../../shared/components/buttons/NextButton';
import BackButton from '../../shared/components/buttons/BackButton';
// import ColorPicker from '../../shared/components/ui/ColorPicker';
import { getServiceURL } from '../../helpers/getServiceURL';
var BRAND_CATEGORIES = [
  'fashion',
  'food_beverage',
  'cosmetics',
  'technology',
  'health_wellness',
  'home_decor',
  'automotive',
  'travel',
  'education',
  'entertainment',
];
var PERSONALITY_TRAITS = [
  'premium',
  'accessible',
  'playful',
  'serious',
  'innovative',
  'traditional',
  'minimalist',
  'bold',
  'friendly',
  'professional',
  'adventurous',
  'sophisticated',
  'casual',
  'formal',
  'youthful',
  'mature',
];
var STYLE_TAGS = [
  'modern',
  'vintage',
  'clean',
  'organic',
  'geometric',
  'abstract',
  'realistic',
  'illustrative',
  'photographic',
  'minimalist',
  'maximalist',
  'colorful',
  'monochrome',
];
var PHOTOGRAPHY_STYLES = [
  'lifestyle',
  'product-focused',
  'editorial',
  'documentary',
  'commercial',
  'artistic',
  'candid',
  'staged',
];
var BrandKnowledgeForm = function (_a) {
  var handleNext = _a.handleNext,
    handleBack = _a.handleBack,
    onSave = _a.onSave,
    existingData = _a.existingData;
  var authContext = useContext(AuthContext);
  var authState = authContext === null || authContext === void 0 ? void 0 : authContext.profile;
  var businessInfo = useContext(BrandContext).businessInfo;
  var _b = useState(false),
    loading = _b[0],
    setLoading = _b[1];
  var _c = useState(false),
    saving = _c[0],
    setSaving = _c[1];
  var _d = useState(null),
    error = _d[0],
    setError = _d[1];
  var _e = useState(false),
    success = _e[0],
    setSuccess = _e[1];
  var _f = useState({
      personality: true,
      visual: false,
      products: false,
      scenes: false,
    }),
    expandedSections = _f[0],
    setExpandedSections = _f[1];
  // Form state
  var _g = useState({
      brand_id:
        (existingData === null || existingData === void 0 ? void 0 : existingData.brand_id) ||
        (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.id) ||
        '',
      brand_name:
        (existingData === null || existingData === void 0 ? void 0 : existingData.brand_name) ||
        (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.name) ||
        '',
      personality: (existingData === null || existingData === void 0
        ? void 0
        : existingData.personality) || {
        traits: [],
        tone: {
          formality: 'neutral',
          humor: 'neutral',
          technicality: 'neutral',
        },
        voice_attributes: [],
      },
      visual_style: (existingData === null || existingData === void 0
        ? void 0
        : existingData.visual_style) || {
        color_palette:
          (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.brandColors) ||
          [],
        style_tags: [],
        photography_style: '',
        composition_preferences: [],
      },
      products:
        (existingData === null || existingData === void 0 ? void 0 : existingData.products) || [],
      approved_scenes:
        (existingData === null || existingData === void 0
          ? void 0
          : existingData.approved_scenes) || [],
      avoid_list:
        (existingData === null || existingData === void 0 ? void 0 : existingData.avoid_list) || [],
      guardrails:
        (existingData === null || existingData === void 0 ? void 0 : existingData.guardrails) || {},
    }),
    formData = _g[0],
    setFormData = _g[1];
  // Input states for adding items
  // Removed unused state variables: newTrait, setNewTrait, newStyleTag, setNewStyleTag, colorPickerVisible, setColorPickerVisible
  var _h = useState(''),
    newVoiceAttribute = _h[0],
    setNewVoiceAttribute = _h[1];
  var _j = useState(''),
    newCompositionPref = _j[0],
    setNewCompositionPref = _j[1];
  var _k = useState(''),
    newApprovedScene = _k[0],
    setNewApprovedScene = _k[1];
  var _l = useState(''),
    newAvoidItem = _l[0],
    setNewAvoidItem = _l[1];
  var _m = useState('#000000'),
    newColor = _m[0],
    setNewColor = _m[1];
  // Load existing brand knowledge on mount
  useEffect(
    function () {
      if (
        (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.id) &&
        !existingData &&
        (authState === null || authState === void 0 ? void 0 : authState.token)
      ) {
        loadExistingBrandKnowledge();
      }
    },
    [
      businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.id,
      authState === null || authState === void 0 ? void 0 : authState.token,
    ]
  );
  var loadExistingBrandKnowledge = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var response, data, err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (
              !(authState === null || authState === void 0 ? void 0 : authState.token) ||
              !(businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.id)
            ) {
              return [2 /*return*/];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, 6, 7]);
            setLoading(true);
            return [
              4 /*yield*/,
              fetch(
                ''
                  .concat(getServiceURL('content_generation'), '/api/v1/brand-knowledge/by-brand/')
                  .concat(businessInfo.id),
                {
                  headers: {
                    Authorization: 'Bearer '.concat(authState.token),
                  },
                }
              ),
            ];
          case 2:
            response = _a.sent();
            if (!(response && response.ok)) return [3 /*break*/, 4];
            return [4 /*yield*/, response.json()];
          case 3:
            data = _a.sent();
            if (data.brand_knowledge) {
              setFormData(data.brand_knowledge);
            }
            _a.label = 4;
          case 4:
            return [3 /*break*/, 7];
          case 5:
            err_1 = _a.sent();
            console.error('Error loading brand knowledge:', err_1);
            return [3 /*break*/, 7];
          case 6:
            setLoading(false);
            return [7 /*endfinally*/];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  var toggleSection = function (section) {
    setExpandedSections(function (prev) {
      var _a;
      return __assign(__assign({}, prev), ((_a = {}), (_a[section] = !prev[section]), _a));
    });
  };
  var addPersonalityTrait = function (trait) {
    if (trait && !formData.personality.traits.includes(trait)) {
      setFormData(function (prev) {
        return __assign(__assign({}, prev), {
          personality: __assign(__assign({}, prev.personality), {
            traits: __spreadArray(__spreadArray([], prev.personality.traits, true), [trait], false),
          }),
        });
      });
    }
  };
  var removePersonalityTrait = function (trait) {
    setFormData(function (prev) {
      return __assign(__assign({}, prev), {
        personality: __assign(__assign({}, prev.personality), {
          traits: prev.personality.traits.filter(function (t) {
            return t !== trait;
          }),
        }),
      });
    });
  };
  var addVoiceAttribute = function () {
    if (newVoiceAttribute && !formData.personality.voice_attributes.includes(newVoiceAttribute)) {
      setFormData(function (prev) {
        return __assign(__assign({}, prev), {
          personality: __assign(__assign({}, prev.personality), {
            voice_attributes: __spreadArray(
              __spreadArray([], prev.personality.voice_attributes, true),
              [newVoiceAttribute],
              false
            ),
          }),
        });
      });
      setNewVoiceAttribute('');
    }
  };
  var removeVoiceAttribute = function (attr) {
    setFormData(function (prev) {
      return __assign(__assign({}, prev), {
        personality: __assign(__assign({}, prev.personality), {
          voice_attributes: prev.personality.voice_attributes.filter(function (a) {
            return a !== attr;
          }),
        }),
      });
    });
  };
  var updateTone = function (key, value) {
    setFormData(function (prev) {
      var _a;
      return __assign(__assign({}, prev), {
        personality: __assign(__assign({}, prev.personality), {
          tone: __assign(__assign({}, prev.personality.tone), ((_a = {}), (_a[key] = value), _a)),
        }),
      });
    });
  };
  var addColor = function (color) {
    if (!formData.visual_style.color_palette.includes(color)) {
      setFormData(function (prev) {
        return __assign(__assign({}, prev), {
          visual_style: __assign(__assign({}, prev.visual_style), {
            color_palette: __spreadArray(
              __spreadArray([], prev.visual_style.color_palette, true),
              [color],
              false
            ),
          }),
        });
      });
    }
  };
  var removeColor = function (index) {
    setFormData(function (prev) {
      return __assign(__assign({}, prev), {
        visual_style: __assign(__assign({}, prev.visual_style), {
          color_palette: prev.visual_style.color_palette.filter(function (_, i) {
            return i !== index;
          }),
        }),
      });
    });
  };
  var addProduct = function () {
    var newProduct = {
      name: '',
      generic_term: '',
      category: '',
      differentiators: [],
      usage_context: '',
      ingredients: [],
    };
    setFormData(function (prev) {
      return __assign(__assign({}, prev), {
        products: __spreadArray(__spreadArray([], prev.products, true), [newProduct], false),
      });
    });
  };
  var updateProduct = function (index, field, value) {
    setFormData(function (prev) {
      return __assign(__assign({}, prev), {
        products: prev.products.map(function (product, i) {
          var _a;
          return i === index
            ? __assign(__assign({}, product), ((_a = {}), (_a[field] = value), _a))
            : product;
        }),
      });
    });
  };
  var removeProduct = function (index) {
    setFormData(function (prev) {
      return __assign(__assign({}, prev), {
        products: prev.products.filter(function (_, i) {
          return i !== index;
        }),
      });
    });
  };
  var extractFromCampaigns = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var campaignIds, response, result, err_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (
              !(businessInfo === null || businessInfo === void 0
                ? void 0
                : businessInfo.campaigns) ||
              businessInfo.campaigns.length === 0
            ) {
              setError('No campaigns available to extract from');
              return [2 /*return*/];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 4, 5, 6]);
            setLoading(true);
            setError(null);
            campaignIds = businessInfo.campaigns.map(function (c) {
              return c.campaign_id;
            });
            return [
              4 /*yield*/,
              fetch(
                ''.concat(
                  getServiceURL('content_generation'),
                  '/api/v1/brand-knowledge/extract-from-campaigns'
                ),
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer '.concat(authState.token),
                  },
                  body: JSON.stringify({ campaign_ids: campaignIds }),
                }
              ),
            ];
          case 2:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Failed to extract brand knowledge');
            }
            return [4 /*yield*/, response.json()];
          case 3:
            result = _a.sent();
            if (result.success && result.brand_knowledge) {
              setFormData(result.brand_knowledge);
              setSuccess(true);
              setTimeout(function () {
                return setSuccess(false);
              }, 3000);
            } else {
              setError(result.message || 'Could not extract brand knowledge');
            }
            return [3 /*break*/, 6];
          case 4:
            err_2 = _a.sent();
            setError(err_2 instanceof Error ? err_2.message : 'Failed to extract from campaigns');
            return [3 /*break*/, 6];
          case 5:
            setLoading(false);
            return [7 /*endfinally*/];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  var handleSave = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var endpoint, response, errorData, err_3;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 5, 6, 7]);
            setSaving(true);
            setError(null);
            // Validate required fields
            if (!formData.brand_name) {
              setError('Brand name is required');
              return [2 /*return*/];
            }
            if (formData.personality.traits.length === 0) {
              setError('At least one personality trait is required');
              return [2 /*return*/];
            }
            endpoint = existingData
              ? ''
                  .concat(getServiceURL('content_generation'), '/api/v1/brand-knowledge/')
                  .concat(existingData.brand_id)
              : ''.concat(getServiceURL('content_generation'), '/api/v1/brand-knowledge');
            return [
              4 /*yield*/,
              fetch(endpoint, {
                method: existingData ? 'PUT' : 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '.concat(authState.token),
                },
                body: JSON.stringify(formData),
              }),
            ];
          case 1:
            response = _a.sent();
            if (!!response.ok) return [3 /*break*/, 3];
            return [4 /*yield*/, response.json()];
          case 2:
            errorData = _a.sent();
            throw new Error(errorData.detail || 'Failed to save brand knowledge');
          case 3:
            return [4 /*yield*/, response.json()];
          case 4:
            _a.sent(); // Consume response body
            setSuccess(true);
            if (onSave) {
              onSave(formData);
            }
            setTimeout(function () {
              setSuccess(false);
              if (handleNext) {
                handleNext();
              }
            }, 2000);
            return [3 /*break*/, 7];
          case 5:
            err_3 = _a.sent();
            setError(err_3 instanceof Error ? err_3.message : 'Failed to save');
            return [3 /*break*/, 7];
          case 6:
            setSaving(false);
            return [7 /*endfinally*/];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  if (loading) {
    return _jsx(FormsContainer, {
      children: _jsx(Box, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        children: _jsx(CircularProgress, {}),
      }),
    });
  }
  return _jsxs(FormsContainer, {
    children: [
      _jsx(Typography, { variant: 'h4', gutterBottom: true, children: 'Brand Knowledge Base' }),
      _jsx(Typography, {
        variant: 'body2',
        color: 'textSecondary',
        paragraph: true,
        children:
          "Define your brand's personality, visual style, and product details to enhance AI-generated content.",
      }),
      error &&
        _jsx(Alert, {
          severity: 'error',
          onClose: function () {
            return setError(null);
          },
          sx: { mb: 2 },
          children: error,
        }),
      success &&
        _jsx(Alert, {
          severity: 'success',
          sx: { mb: 2 },
          children: 'Brand knowledge saved successfully!',
        }),
      (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.campaigns) &&
        businessInfo.campaigns.length > 0 &&
        _jsx(Box, {
          mb: 3,
          children: _jsx(Button, {
            variant: 'outlined',
            onClick: extractFromCampaigns,
            disabled: loading,
            startIcon: loading && _jsx(CircularProgress, { size: 20 }),
            children: 'Extract from Existing Campaigns',
          }),
        }),
      _jsxs(Paper, {
        elevation: 1,
        sx: { p: 2, mb: 2 },
        children: [
          _jsxs(Box, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            children: [
              _jsx(Typography, { variant: 'h6', children: 'Brand Personality' }),
              _jsx(IconButton, {
                onClick: function () {
                  return toggleSection('personality');
                },
                children: expandedSections.personality
                  ? _jsx(LuChevronUp, {})
                  : _jsx(LuChevronDown, {}),
              }),
            ],
          }),
          _jsx(Collapse, {
            in: expandedSections.personality,
            children: _jsxs(Box, {
              mt: 2,
              children: [
                _jsx(Typography, {
                  variant: 'subtitle2',
                  gutterBottom: true,
                  children: 'Personality Traits',
                }),
                _jsx(Box, {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  mb: 2,
                  children: PERSONALITY_TRAITS.map(function (trait) {
                    return _jsx(
                      Chip,
                      {
                        label: trait,
                        onClick: function () {
                          return addPersonalityTrait(trait);
                        },
                        variant: formData.personality.traits.includes(trait)
                          ? 'filled'
                          : 'outlined',
                        color: formData.personality.traits.includes(trait) ? 'primary' : 'default',
                      },
                      trait
                    );
                  }),
                }),
                _jsx(Box, {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  mb: 3,
                  children: formData.personality.traits.map(function (trait) {
                    return _jsx(
                      Chip,
                      {
                        label: trait,
                        onDelete: function () {
                          return removePersonalityTrait(trait);
                        },
                        color: 'primary',
                      },
                      trait
                    );
                  }),
                }),
                _jsx(Typography, {
                  variant: 'subtitle2',
                  gutterBottom: true,
                  children: 'Brand Tone',
                }),
                _jsxs(Grid, {
                  container: true,
                  spacing: 2,
                  mb: 3,
                  children: [
                    _jsx(Grid, {
                      item: true,
                      xs: 12,
                      sm: 4,
                      children: _jsxs(FormControl, {
                        fullWidth: true,
                        size: 'small',
                        children: [
                          _jsx(InputLabel, { children: 'Formality' }),
                          _jsxs(Select, {
                            value: formData.personality.tone.formality || 'neutral',
                            onChange: function (e) {
                              return updateTone('formality', e.target.value);
                            },
                            label: 'Formality',
                            children: [
                              _jsx(MenuItem, { value: 'very_formal', children: 'Very Formal' }),
                              _jsx(MenuItem, { value: 'formal', children: 'Formal' }),
                              _jsx(MenuItem, { value: 'neutral', children: 'Neutral' }),
                              _jsx(MenuItem, { value: 'casual', children: 'Casual' }),
                              _jsx(MenuItem, { value: 'very_casual', children: 'Very Casual' }),
                            ],
                          }),
                        ],
                      }),
                    }),
                    _jsx(Grid, {
                      item: true,
                      xs: 12,
                      sm: 4,
                      children: _jsxs(FormControl, {
                        fullWidth: true,
                        size: 'small',
                        children: [
                          _jsx(InputLabel, { children: 'Humor' }),
                          _jsxs(Select, {
                            value: formData.personality.tone.humor || 'neutral',
                            onChange: function (e) {
                              return updateTone('humor', e.target.value);
                            },
                            label: 'Humor',
                            children: [
                              _jsx(MenuItem, { value: 'serious', children: 'Serious' }),
                              _jsx(MenuItem, { value: 'neutral', children: 'Neutral' }),
                              _jsx(MenuItem, { value: 'witty', children: 'Witty' }),
                              _jsx(MenuItem, { value: 'playful', children: 'Playful' }),
                              _jsx(MenuItem, { value: 'humorous', children: 'Humorous' }),
                            ],
                          }),
                        ],
                      }),
                    }),
                    _jsx(Grid, {
                      item: true,
                      xs: 12,
                      sm: 4,
                      children: _jsxs(FormControl, {
                        fullWidth: true,
                        size: 'small',
                        children: [
                          _jsx(InputLabel, { children: 'Technicality' }),
                          _jsxs(Select, {
                            value: formData.personality.tone.technicality || 'neutral',
                            onChange: function (e) {
                              return updateTone('technicality', e.target.value);
                            },
                            label: 'Technicality',
                            children: [
                              _jsx(MenuItem, { value: 'simple', children: 'Simple' }),
                              _jsx(MenuItem, { value: 'accessible', children: 'Accessible' }),
                              _jsx(MenuItem, { value: 'neutral', children: 'Neutral' }),
                              _jsx(MenuItem, { value: 'technical', children: 'Technical' }),
                              _jsx(MenuItem, { value: 'expert', children: 'Expert' }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                _jsx(Typography, {
                  variant: 'subtitle2',
                  gutterBottom: true,
                  children: 'Voice Attributes',
                }),
                _jsxs(Box, {
                  display: 'flex',
                  gap: 1,
                  mb: 2,
                  children: [
                    _jsx(TextField, {
                      size: 'small',
                      placeholder: 'Add voice attribute',
                      value: newVoiceAttribute,
                      onChange: function (e) {
                        return setNewVoiceAttribute(e.target.value);
                      },
                      onKeyPress: function (e) {
                        return e.key === 'Enter' && addVoiceAttribute();
                      },
                    }),
                    _jsx(Button, {
                      variant: 'outlined',
                      onClick: addVoiceAttribute,
                      startIcon: _jsx(LuPlus, {}),
                      children: 'Add',
                    }),
                  ],
                }),
                _jsx(Box, {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  children: formData.personality.voice_attributes.map(function (attr) {
                    return _jsx(
                      Chip,
                      {
                        label: attr,
                        onDelete: function () {
                          return removeVoiceAttribute(attr);
                        },
                      },
                      attr
                    );
                  }),
                }),
              ],
            }),
          }),
        ],
      }),
      _jsxs(Paper, {
        elevation: 1,
        sx: { p: 2, mb: 2 },
        children: [
          _jsxs(Box, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            children: [
              _jsx(Typography, { variant: 'h6', children: 'Visual Style' }),
              _jsx(IconButton, {
                onClick: function () {
                  return toggleSection('visual');
                },
                children: expandedSections.visual ? _jsx(LuChevronUp, {}) : _jsx(LuChevronDown, {}),
              }),
            ],
          }),
          _jsx(Collapse, {
            in: expandedSections.visual,
            children: _jsxs(Box, {
              mt: 2,
              children: [
                _jsx(Typography, {
                  variant: 'subtitle2',
                  gutterBottom: true,
                  children: 'Color Palette',
                }),
                _jsxs(Box, {
                  display: 'flex',
                  gap: 1,
                  mb: 3,
                  children: [
                    _jsx(TextField, {
                      size: 'small',
                      type: 'color',
                      value: newColor,
                      onChange: function (e) {
                        return setNewColor(e.target.value);
                      },
                      sx: { width: 100 },
                    }),
                    _jsx(Button, {
                      variant: 'outlined',
                      onClick: function () {
                        if (newColor && !formData.visual_style.color_palette.includes(newColor)) {
                          addColor(newColor);
                          setNewColor('#000000');
                        }
                      },
                      startIcon: _jsx(LuPlus, {}),
                      children: 'Add Color',
                    }),
                  ],
                }),
                _jsx(Box, {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  mb: 3,
                  children: formData.visual_style.color_palette.map(function (color, index) {
                    return _jsxs(
                      Box,
                      {
                        sx: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                          border: '1px solid #ddd',
                          borderRadius: 1,
                        },
                        children: [
                          _jsx(Box, {
                            sx: {
                              width: 24,
                              height: 24,
                              backgroundColor: color,
                              borderRadius: 1,
                              border: '1px solid #ccc',
                            },
                          }),
                          _jsx(Typography, { variant: 'body2', children: color }),
                          _jsx(IconButton, {
                            size: 'small',
                            onClick: function () {
                              return removeColor(index);
                            },
                            children: _jsx(LuTrash2, { size: 16 }),
                          }),
                        ],
                      },
                      index
                    );
                  }),
                }),
                _jsx(Typography, {
                  variant: 'subtitle2',
                  gutterBottom: true,
                  children: 'Style Tags',
                }),
                _jsx(Box, {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  mb: 3,
                  children: STYLE_TAGS.map(function (tag) {
                    return _jsx(
                      Chip,
                      {
                        label: tag,
                        onClick: function () {
                          var tags = formData.visual_style.style_tags;
                          if (tags.includes(tag)) {
                            setFormData(function (prev) {
                              return __assign(__assign({}, prev), {
                                visual_style: __assign(__assign({}, prev.visual_style), {
                                  style_tags: tags.filter(function (t) {
                                    return t !== tag;
                                  }),
                                }),
                              });
                            });
                          } else {
                            setFormData(function (prev) {
                              return __assign(__assign({}, prev), {
                                visual_style: __assign(__assign({}, prev.visual_style), {
                                  style_tags: __spreadArray(
                                    __spreadArray([], tags, true),
                                    [tag],
                                    false
                                  ),
                                }),
                              });
                            });
                          }
                        },
                        variant: formData.visual_style.style_tags.includes(tag)
                          ? 'filled'
                          : 'outlined',
                        color: formData.visual_style.style_tags.includes(tag)
                          ? 'primary'
                          : 'default',
                      },
                      tag
                    );
                  }),
                }),
                _jsxs(FormControl, {
                  fullWidth: true,
                  size: 'small',
                  sx: { mb: 3 },
                  children: [
                    _jsx(InputLabel, { children: 'Photography Style' }),
                    _jsx(Select, {
                      value: formData.visual_style.photography_style,
                      onChange: function (e) {
                        return setFormData(function (prev) {
                          return __assign(__assign({}, prev), {
                            visual_style: __assign(__assign({}, prev.visual_style), {
                              photography_style: e.target.value,
                            }),
                          });
                        });
                      },
                      label: 'Photography Style',
                      children: PHOTOGRAPHY_STYLES.map(function (style) {
                        return _jsx(
                          MenuItem,
                          {
                            value: style,
                            children:
                              style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' '),
                          },
                          style
                        );
                      }),
                    }),
                  ],
                }),
                _jsx(Typography, {
                  variant: 'subtitle2',
                  gutterBottom: true,
                  children: 'Composition Preferences',
                }),
                _jsxs(Box, {
                  display: 'flex',
                  gap: 1,
                  mb: 2,
                  children: [
                    _jsx(TextField, {
                      size: 'small',
                      placeholder: 'Add composition preference',
                      value: newCompositionPref,
                      onChange: function (e) {
                        return setNewCompositionPref(e.target.value);
                      },
                      onKeyPress: function (e) {
                        if (e.key === 'Enter' && newCompositionPref) {
                          setFormData(function (prev) {
                            return __assign(__assign({}, prev), {
                              visual_style: __assign(__assign({}, prev.visual_style), {
                                composition_preferences: __spreadArray(
                                  __spreadArray(
                                    [],
                                    prev.visual_style.composition_preferences,
                                    true
                                  ),
                                  [newCompositionPref],
                                  false
                                ),
                              }),
                            });
                          });
                          setNewCompositionPref('');
                        }
                      },
                    }),
                    _jsx(Button, {
                      variant: 'outlined',
                      onClick: function () {
                        if (newCompositionPref) {
                          setFormData(function (prev) {
                            return __assign(__assign({}, prev), {
                              visual_style: __assign(__assign({}, prev.visual_style), {
                                composition_preferences: __spreadArray(
                                  __spreadArray(
                                    [],
                                    prev.visual_style.composition_preferences,
                                    true
                                  ),
                                  [newCompositionPref],
                                  false
                                ),
                              }),
                            });
                          });
                          setNewCompositionPref('');
                        }
                      },
                      startIcon: _jsx(LuPlus, {}),
                      children: 'Add',
                    }),
                  ],
                }),
                _jsx(Box, {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  children: formData.visual_style.composition_preferences.map(
                    function (pref, index) {
                      return _jsx(
                        Chip,
                        {
                          label: pref,
                          onDelete: function () {
                            setFormData(function (prev) {
                              return __assign(__assign({}, prev), {
                                visual_style: __assign(__assign({}, prev.visual_style), {
                                  composition_preferences:
                                    prev.visual_style.composition_preferences.filter(
                                      function (_, i) {
                                        return i !== index;
                                      }
                                    ),
                                }),
                              });
                            });
                          },
                        },
                        index
                      );
                    }
                  ),
                }),
              ],
            }),
          }),
        ],
      }),
      _jsxs(Paper, {
        elevation: 1,
        sx: { p: 2, mb: 2 },
        children: [
          _jsxs(Box, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            children: [
              _jsx(Typography, { variant: 'h6', children: 'Products' }),
              _jsxs(Box, {
                display: 'flex',
                gap: 1,
                children: [
                  _jsx(Button, {
                    variant: 'outlined',
                    size: 'small',
                    onClick: addProduct,
                    startIcon: _jsx(LuPlus, {}),
                    children: 'Add Product',
                  }),
                  _jsx(IconButton, {
                    onClick: function () {
                      return toggleSection('products');
                    },
                    children: expandedSections.products
                      ? _jsx(LuChevronUp, {})
                      : _jsx(LuChevronDown, {}),
                  }),
                ],
              }),
            ],
          }),
          _jsx(Collapse, {
            in: expandedSections.products,
            children: _jsxs(Box, {
              mt: 2,
              children: [
                formData.products.map(function (product, index) {
                  return _jsxs(
                    Paper,
                    {
                      variant: 'outlined',
                      sx: { p: 2, mb: 2 },
                      children: [
                        _jsxs(Box, {
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          children: [
                            _jsxs(Typography, {
                              variant: 'subtitle2',
                              gutterBottom: true,
                              children: ['Product ', index + 1],
                            }),
                            _jsx(IconButton, {
                              size: 'small',
                              onClick: function () {
                                return removeProduct(index);
                              },
                              children: _jsx(LuTrash2, { size: 16 }),
                            }),
                          ],
                        }),
                        _jsxs(Grid, {
                          container: true,
                          spacing: 2,
                          children: [
                            _jsx(Grid, {
                              item: true,
                              xs: 12,
                              sm: 6,
                              children: _jsx(TextField, {
                                fullWidth: true,
                                size: 'small',
                                label: 'Product Name',
                                value: product.name,
                                onChange: function (e) {
                                  return updateProduct(index, 'name', e.target.value);
                                },
                              }),
                            }),
                            _jsx(Grid, {
                              item: true,
                              xs: 12,
                              sm: 6,
                              children: _jsx(TextField, {
                                fullWidth: true,
                                size: 'small',
                                label: 'Generic Term',
                                value: product.generic_term,
                                onChange: function (e) {
                                  return updateProduct(index, 'generic_term', e.target.value);
                                },
                              }),
                            }),
                            _jsx(Grid, {
                              item: true,
                              xs: 12,
                              sm: 6,
                              children: _jsxs(FormControl, {
                                fullWidth: true,
                                size: 'small',
                                children: [
                                  _jsx(InputLabel, { children: 'Category' }),
                                  _jsx(Select, {
                                    value: product.category,
                                    onChange: function (e) {
                                      return updateProduct(index, 'category', e.target.value);
                                    },
                                    label: 'Category',
                                    children: BRAND_CATEGORIES.map(function (cat) {
                                      return _jsx(
                                        MenuItem,
                                        {
                                          value: cat,
                                          children:
                                            cat.replace('_', ' ').charAt(0).toUpperCase() +
                                            cat.slice(1).replace('_', ' '),
                                        },
                                        cat
                                      );
                                    }),
                                  }),
                                ],
                              }),
                            }),
                            _jsx(Grid, {
                              item: true,
                              xs: 12,
                              sm: 6,
                              children: _jsx(TextField, {
                                fullWidth: true,
                                size: 'small',
                                label: 'Usage Context',
                                value: product.usage_context,
                                onChange: function (e) {
                                  return updateProduct(index, 'usage_context', e.target.value);
                                },
                              }),
                            }),
                            _jsx(Grid, {
                              item: true,
                              xs: 12,
                              children: _jsx(TextField, {
                                fullWidth: true,
                                size: 'small',
                                label: 'Differentiators (comma-separated)',
                                value: product.differentiators.join(', '),
                                onChange: function (e) {
                                  return updateProduct(
                                    index,
                                    'differentiators',
                                    e.target.value
                                      .split(',')
                                      .map(function (s) {
                                        return s.trim();
                                      })
                                      .filter(Boolean)
                                  );
                                },
                                helperText: 'What makes this product unique?',
                              }),
                            }),
                          ],
                        }),
                      ],
                    },
                    index
                  );
                }),
                formData.products.length === 0 &&
                  _jsx(Typography, {
                    variant: 'body2',
                    color: 'textSecondary',
                    sx: { textAlign: 'center', py: 3 },
                    children: 'No products added yet. Click "Add Product" to get started.',
                  }),
              ],
            }),
          }),
        ],
      }),
      _jsxs(Paper, {
        elevation: 1,
        sx: { p: 2, mb: 3 },
        children: [
          _jsxs(Box, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            children: [
              _jsx(Typography, { variant: 'h6', children: 'Scenes & Guardrails' }),
              _jsx(IconButton, {
                onClick: function () {
                  return toggleSection('scenes');
                },
                children: expandedSections.scenes ? _jsx(LuChevronUp, {}) : _jsx(LuChevronDown, {}),
              }),
            ],
          }),
          _jsx(Collapse, {
            in: expandedSections.scenes,
            children: _jsxs(Box, {
              mt: 2,
              children: [
                _jsx(Typography, {
                  variant: 'subtitle2',
                  gutterBottom: true,
                  children: 'Approved Scenes',
                }),
                _jsxs(Box, {
                  display: 'flex',
                  gap: 1,
                  mb: 2,
                  children: [
                    _jsx(TextField, {
                      size: 'small',
                      placeholder: 'Add approved scene type',
                      value: newApprovedScene,
                      onChange: function (e) {
                        return setNewApprovedScene(e.target.value);
                      },
                      onKeyPress: function (e) {
                        if (e.key === 'Enter' && newApprovedScene) {
                          setFormData(function (prev) {
                            return __assign(__assign({}, prev), {
                              approved_scenes: __spreadArray(
                                __spreadArray([], prev.approved_scenes, true),
                                [newApprovedScene],
                                false
                              ),
                            });
                          });
                          setNewApprovedScene('');
                        }
                      },
                    }),
                    _jsx(Button, {
                      variant: 'outlined',
                      onClick: function () {
                        if (newApprovedScene) {
                          setFormData(function (prev) {
                            return __assign(__assign({}, prev), {
                              approved_scenes: __spreadArray(
                                __spreadArray([], prev.approved_scenes, true),
                                [newApprovedScene],
                                false
                              ),
                            });
                          });
                          setNewApprovedScene('');
                        }
                      },
                      startIcon: _jsx(LuPlus, {}),
                      children: 'Add',
                    }),
                  ],
                }),
                _jsx(Box, {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  mb: 3,
                  children: formData.approved_scenes.map(function (scene, index) {
                    return _jsx(
                      Chip,
                      {
                        label: scene,
                        color: 'success',
                        onDelete: function () {
                          setFormData(function (prev) {
                            return __assign(__assign({}, prev), {
                              approved_scenes: prev.approved_scenes.filter(function (_, i) {
                                return i !== index;
                              }),
                            });
                          });
                        },
                      },
                      index
                    );
                  }),
                }),
                _jsx(Typography, {
                  variant: 'subtitle2',
                  gutterBottom: true,
                  children: 'Avoid List',
                }),
                _jsxs(Box, {
                  display: 'flex',
                  gap: 1,
                  mb: 2,
                  children: [
                    _jsx(TextField, {
                      size: 'small',
                      placeholder: 'Add item to avoid',
                      value: newAvoidItem,
                      onChange: function (e) {
                        return setNewAvoidItem(e.target.value);
                      },
                      onKeyPress: function (e) {
                        if (e.key === 'Enter' && newAvoidItem) {
                          setFormData(function (prev) {
                            return __assign(__assign({}, prev), {
                              avoid_list: __spreadArray(
                                __spreadArray([], prev.avoid_list, true),
                                [newAvoidItem],
                                false
                              ),
                            });
                          });
                          setNewAvoidItem('');
                        }
                      },
                    }),
                    _jsx(Button, {
                      variant: 'outlined',
                      onClick: function () {
                        if (newAvoidItem) {
                          setFormData(function (prev) {
                            return __assign(__assign({}, prev), {
                              avoid_list: __spreadArray(
                                __spreadArray([], prev.avoid_list, true),
                                [newAvoidItem],
                                false
                              ),
                            });
                          });
                          setNewAvoidItem('');
                        }
                      },
                      startIcon: _jsx(LuPlus, {}),
                      children: 'Add',
                    }),
                  ],
                }),
                _jsx(Box, {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  children: formData.avoid_list.map(function (item, index) {
                    return _jsx(
                      Chip,
                      {
                        label: item,
                        color: 'error',
                        onDelete: function () {
                          setFormData(function (prev) {
                            return __assign(__assign({}, prev), {
                              avoid_list: prev.avoid_list.filter(function (_, i) {
                                return i !== index;
                              }),
                            });
                          });
                        },
                      },
                      index
                    );
                  }),
                }),
              ],
            }),
          }),
        ],
      }),
      _jsxs(Box, {
        display: 'flex',
        justifyContent: 'space-between',
        mt: 3,
        children: [
          handleBack && _jsx(BackButton, { onClick: handleBack }),
          _jsxs(Box, {
            display: 'flex',
            gap: 2,
            children: [
              _jsx(Button, {
                variant: 'outlined',
                onClick: handleSave,
                disabled: saving || loading,
                startIcon: saving && _jsx(CircularProgress, { size: 20 }),
                children: 'Save Draft',
              }),
              handleNext &&
                _jsx(NextButton, {
                  onClick: function () {
                    handleSave();
                  },
                  disabled: saving || loading,
                  children: 'Save & Continue',
                }),
            ],
          }),
        ],
      }),
    ],
  });
};
export default BrandKnowledgeForm;
//# sourceMappingURL=BrandKnowledgeForm.js.map
