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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
// SocialMediaPost.tsx
import { useEffect, useRef, useState } from 'react';
import PaginationImage from './PaginationImage';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { CircularProgress, Dialog, DialogContent, Menu, MenuItem } from '@mui/material';
import ErrorToast from '../../../shared/components/feedback/ErrorToast';
import moment from 'moment-timezone';
import { FaCheck } from 'react-icons/fa';
import { IoMdCheckmark, IoMdRefresh } from 'react-icons/io';
import posthog from '../../../helpers/posthog';
import { MdClose, MdModeEdit, MdOutlineClose, MdOutlinePublishedWithChanges } from 'react-icons/md';
import { MdCancel } from 'react-icons/md';
import ModifyPrompt from './ModifyPrompt';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { TiArrowMaximise } from 'react-icons/ti';
import PurpleButton from '../../../shared/components/buttons/PurpleButton';
import { IoClose } from 'react-icons/io5';
import { captionApi } from '../../../api/contentGenerationApi';
import QualityScoreIndicator from './QualityScoreIndicator';
var SocialMediaPost = function (props) {
  var _a, _b, _c, _d;
  var day = props.day,
    setOpen = props.setOpen,
    content = props.content,
    id = props.id,
    week = props.week,
    postIndex = props.postIndex,
    brandName = props.brandName,
    onApprovalUpdate = props.onApprovalUpdate,
    selectedImages = props.selectedImages,
    setSelectedImages = props.setSelectedImages,
    postingTime = props.postingTime,
    updataImage = props.updataImage;
  var _e = useState(false),
    loading = _e[0],
    setLoading = _e[1]; // Loading state
  var _f = useState(false),
    loadingRegen = _f[0],
    setLoadingRegen = _f[1]; // Loading state
  var pRef = useRef(null);
  var profile = useAuth().profile;
  var endpointUrl = getServiceURL('content-gen');
  var _g = useState(true),
    imageLoading = _g[0],
    setImageLoading = _g[1]; // Track loading state
  var _h = useState(false),
    errorSaving = _h[0],
    setErrorSaving = _h[1]; // Track loading state
  var _j = useState(''),
    errorText = _j[0],
    setErrorText = _j[1]; // Track loading state
  var _k = useState(false),
    edit = _k[0],
    setEdit = _k[1];
  var textareaRef = useRef(null);
  var _l = useState(
      ((_a = content === null || content === void 0 ? void 0 : content[postIndex - 1]) === null ||
      _a === void 0
        ? void 0
        : _a.text) || ''
    ),
    text = _l[0],
    setText = _l[1];
  var _m = useState(false),
    isLoadingText = _m[0],
    setIsLoadingText = _m[1];
  var _o = useState(false),
    hovering = _o[0],
    setHovering = _o[1];
  var _p = useState(false),
    openModifyPrompt = _p[0],
    setOpenModifyPrompt = _p[1];
  var _q = useState(false),
    expandImage = _q[0],
    setExpandImage = _q[1];
  var _r = useState(2),
    remainingGenerations = _r[0],
    setRemainingGenerations = _r[1];
  var _s = useState(0),
    totalAllowed = _s[0],
    setTotalAllowed = _s[1];
  var _t = useState(false),
    limitReached = _t[0],
    setLimitReached = _t[1];
  var _u = useState(null),
    captionMenuAnchor = _u[0],
    setCaptionMenuAnchor = _u[1];
  var captionMenuOpen = Boolean(captionMenuAnchor);
  var _v = useState(0),
    currentQualityScore = _v[0],
    setCurrentQualityScore = _v[1];
  var _w = useState(false),
    showQualityScore = _w[0],
    setShowQualityScore = _w[1];
  var showCancelUI = hovering || loading;
  var validateTimezone = function (timezone) {
    return moment.tz.zone(timezone) !== null;
  };
  var handleApprove = function (state) {
    return __awaiter(void 0, void 0, void 0, function () {
      var userTimezone,
        validTimezone,
        currentPost,
        payload,
        response,
        errorData,
        error_1,
        errorMessage;
      var _a;
      var _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            validTimezone = validateTimezone(userTimezone) ? userTimezone : 'UTC';
            setLoading(true);
            setErrorSaving(false);
            currentPost = Array.isArray(content) ? content[postIndex - 1] : content;
            if (!currentPost) {
              setErrorText('Post data not found');
              setErrorSaving(true);
              setLoading(false);
              return [2 /*return*/];
            }
            payload = {
              campaign_content_id: id,
              week: week,
              day: day + 1,
              approved: state,
              timezone: validTimezone,
              posts:
                ((_a = {}),
                (_a['post_'.concat(postIndex)] = {
                  selected_image:
                    ((_b = currentPost.image_url) === null || _b === void 0
                      ? void 0
                      : _b[selectedImages[postIndex - 1] - 1]) || '',
                  text: currentPost.text || '',
                }),
                _a),
            };
            _c.label = 1;
          case 1:
            _c.trys.push([1, 5, 6, 7]);
            return [
              4 /*yield*/,
              fetch(endpointUrl + '/api/v1/contentgen/approve', {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer '.concat(
                    profile === null || profile === void 0 ? void 0 : profile.token
                  ),
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              }),
            ];
          case 2:
            response = _c.sent();
            if (response.ok) return [3 /*break*/, 4];
            return [4 /*yield*/, response.json()];
          case 3:
            errorData = _c.sent();
            throw new Error(errorData.detail || 'Failed to fetch data');
          case 4:
            onApprovalUpdate(day, state);
            if (posthog.__loaded) {
              posthog.capture('Content Approved', {
                distinct_id: profile === null || profile === void 0 ? void 0 : profile.id,
                content_id:
                  payload === null || payload === void 0 ? void 0 : payload.campaign_content_id,
              });
            }
            return [3 /*break*/, 7];
          case 5:
            error_1 = _c.sent();
            console.error('Error fetching data:', JSON.stringify(error_1));
            errorMessage = 'An unknown error occurred';
            if (error_1 instanceof Error) {
              errorMessage = error_1.message;
            } else if (typeof error_1 === 'object' && error_1 !== null) {
              errorMessage = JSON.stringify(error_1);
            }
            setErrorText(errorMessage);
            setErrorSaving(true);
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
  var handleImageLoad = function () {
    setImageLoading(false);
  };
  var handleImageError = function () {
    setImageLoading(false);
  };
  var DisplayOptions = function () {
    var _a;
    var currentPost = Array.isArray(content) ? content[postIndex - 1] : content;
    if (
      !currentPost ||
      (currentPost === null || currentPost === void 0 ? void 0 : currentPost.image_url) ===
        undefined
    )
      return false;
    if (
      ((_a = currentPost === null || currentPost === void 0 ? void 0 : currentPost.image_url) ===
        null || _a === void 0
        ? void 0
        : _a.length) === 1
    )
      return false;
    return true;
  };
  var fetchRemainingGenerations = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var endpointUrl_1, params, response, data, error_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 4, , 5]);
            endpointUrl_1 = getServiceURL('content-gen');
            params = new URLSearchParams();
            params.append('week_num', week.toString());
            params.append('day_num', (day + 1).toString());
            params.append('post_num', postIndex.toString());
            params.append('content_id', id);
            return [
              4 /*yield*/,
              fetch(
                ''
                  .concat(endpointUrl_1, '/api/v1/contentgen/remaining_generations?')
                  .concat(params.toString()),
                {
                  headers: {
                    Authorization: 'Bearer '.concat(
                      profile === null || profile === void 0 ? void 0 : profile.token
                    ),
                  },
                }
              ),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) return [3 /*break*/, 3];
            return [4 /*yield*/, response.json()];
          case 2:
            data = _a.sent();
            setRemainingGenerations(data.remaining);
            setTotalAllowed(data.total_allowed);
            _a.label = 3;
          case 3:
            return [3 /*break*/, 5];
          case 4:
            error_2 = _a.sent();
            console.error('Error fetching remaining generations:', error_2);
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  useEffect(function () {
    fetchRemainingGenerations();
  }, []);
  // Change regenerateImage to accept a prompt argument
  var regenerateImage = function (promptOverride) {
    return __awaiter(void 0, void 0, void 0, function () {
      var currentPost,
        endpointUrl_2,
        promptToUse,
        response,
        _a,
        url,
        newText,
        newSelectedImages,
        e_1;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            currentPost = Array.isArray(content) ? content[postIndex - 1] : content;
            if (!currentPost) {
              console.error('Cannot regenerate image: Post data not found');
              return [2 /*return*/];
            }
            _b.label = 1;
          case 1:
            _b.trys.push([1, 4, 5, 6]);
            setLoadingRegen(true);
            endpointUrl_2 = getServiceURL('content-gen');
            promptToUse =
              promptOverride !== null && promptOverride !== void 0
                ? promptOverride
                : currentPost.image_prompt;
            return [
              4 /*yield*/,
              fetch(''.concat(endpointUrl_2, '/api/v1/contentgen/regenerate'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '.concat(
                    profile === null || profile === void 0 ? void 0 : profile.token
                  ),
                },
                body: JSON.stringify({
                  content_id: id,
                  week_num: week,
                  day_num: day + 1,
                  post_num: postIndex,
                  prompt: promptToUse,
                }),
              }),
            ];
          case 2:
            response = _b.sent();
            return [4 /*yield*/, response.json()];
          case 3:
            ((_a = _b.sent()), (url = _a.url), (newText = _a.newText));
            if (!response.ok) {
              throw new Error('Failed to regenerate image');
            }
            updataImage(week - 1, day, postIndex - 1, 0, url, newText);
            newSelectedImages = __spreadArray([], selectedImages, true);
            newSelectedImages[postIndex - 1]++;
            setSelectedImages(newSelectedImages);
            return [3 /*break*/, 6];
          case 4:
            e_1 = _b.sent();
            console.error('Error regenerating image:', e_1.message);
            return [3 /*break*/, 6];
          case 5:
            setLoadingRegen(false);
            return [7 /*endfinally*/];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  // Handler for the refresh button to always use the latest prompt from the backend
  var handleRegenerateClick = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var endpointUrl, params, response, prompt_1, e_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            endpointUrl = getServiceURL('content-gen');
            params = new URLSearchParams();
            params.append('week_num', week.toString());
            params.append('day_num', (day + 1).toString());
            params.append('post_num', postIndex.toString());
            params.append('content_id', id);
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [
              4 /*yield*/,
              fetch(''.concat(endpointUrl, '/api/v1/image_prompt?').concat(params.toString()), {
                headers: {
                  Authorization: 'Bearer '.concat(
                    profile === null || profile === void 0 ? void 0 : profile.token
                  ),
                },
              }),
            ];
          case 2:
            response = _a.sent();
            if (!response.ok) throw new Error('Failed to fetch prompt');
            return [4 /*yield*/, response.json()];
          case 3:
            prompt_1 = _a.sent().prompt;
            return [4 /*yield*/, regenerateImage(prompt_1)];
          case 4:
            _a.sent();
            return [3 /*break*/, 6];
          case 5:
            e_2 = _a.sent();
            console.error('Error fetching prompt for regeneration:', e_2);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  var handleEdit = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var currentPost, endpointUrl_3, selectedImageIndex, updatedTextVersions, response, error_3;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            currentPost = Array.isArray(content) ? content[postIndex - 1] : content;
            if (!currentPost) {
              console.error('Cannot edit text: Post data not found');
              return [2 /*return*/];
            }
            if (!edit) return [3 /*break*/, 6];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, 4, 5]);
            setIsLoadingText(true);
            endpointUrl_3 = getServiceURL('content-gen');
            selectedImageIndex = selectedImages[postIndex - 1] - 1;
            updatedTextVersions = __spreadArray([], currentPost.text_versions || [], true);
            updatedTextVersions[selectedImageIndex] = text;
            return [
              4 /*yield*/,
              fetch(''.concat(endpointUrl_3, '/api/v1/contentgen/update-text-versions'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '.concat(
                    profile === null || profile === void 0 ? void 0 : profile.token
                  ),
                },
                body: JSON.stringify({
                  content_id: id,
                  week_num: week,
                  day_num: day + 1,
                  post_num: postIndex,
                  text: text,
                  text_versions: updatedTextVersions,
                  selected_image_index: selectedImageIndex,
                }),
              }),
            ];
          case 2:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Failed to update text versions');
            }
            // Update local state after successful backend update
            currentPost.text = text;
            currentPost.text_versions = updatedTextVersions;
            setEdit(false);
            return [3 /*break*/, 5];
          case 3:
            error_3 = _a.sent();
            console.error('Error updating text versions:', error_3);
            setErrorText('Failed to update text versions');
            setErrorSaving(true);
            return [3 /*break*/, 5];
          case 4:
            setIsLoadingText(false);
            return [7 /*endfinally*/];
          case 5:
            return [3 /*break*/, 7];
          case 6:
            // When starting to edit
            setText(currentPost.text || '');
            setEdit(true);
            _a.label = 7;
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  var handleReselectText = function (index) {
    return __awaiter(void 0, void 0, void 0, function () {
      var endpointUrl_4, response, selectedText, e_3;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 3, 4, 5]);
            setIsLoadingText(true);
            endpointUrl_4 = getServiceURL('content-gen');
            return [
              4 /*yield*/,
              fetch(''.concat(endpointUrl_4, '/api/v1/contentgen/reselect-text'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '.concat(
                    profile === null || profile === void 0 ? void 0 : profile.token
                  ),
                },
                body: JSON.stringify({
                  content_id: id,
                  week_num: week,
                  day_num: day + 1,
                  post_num: postIndex,
                  index: index,
                }),
              }),
            ];
          case 1:
            response = _a.sent();
            return [4 /*yield*/, response.json()];
          case 2:
            selectedText = _a.sent().selectedText;
            if (!response.ok) {
              throw new Error('Failed to selext text');
            }
            updataImage(week - 1, day, postIndex - 1, 0, null, selectedText);
            return [3 /*break*/, 5];
          case 3:
            e_3 = _a.sent();
            console.log(e_3);
            return [3 /*break*/, 5];
          case 4:
            setIsLoadingText(false);
            return [7 /*endfinally*/];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  function truncateText(text, limit) {
    if (limit === void 0) {
      limit = 300;
    }
    var newText = text.length > limit ? text.slice(0, limit) + '...' : text;
    return newText;
  }
  // New function to generate captions using Caption Generator API
  var generateCaptionWithAI = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var currentPost,
        sceneType,
        captionData,
        bestCaption,
        endpointUrl_5,
        selectedImageIndex,
        updatedTextVersions,
        error_4;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            currentPost = Array.isArray(content) ? content[postIndex - 1] : content;
            if (!currentPost || !(profile === null || profile === void 0 ? void 0 : profile.token))
              return [2 /*return*/];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, 6, 7]);
            setIsLoadingText(true);
            sceneType = currentPost.scene_type || 'lifestyle';
            return [
              4 /*yield*/,
              captionApi.generateCaptions(
                id, // content ID
                {
                  image_description: currentPost.image_prompt || '',
                  scene_type: sceneType,
                  brand_voice: brandName,
                  target_audience: currentPost.target_audience,
                  hashtags: currentPost.hashtags || [],
                  max_length: 2200, // Instagram max
                  include_cta: true,
                  tone: currentPost.tone || 'casual',
                },
                profile.token
              ),
            ];
          case 2:
            captionData = _a.sent();
            if (!(captionData.captions && captionData.captions.length > 0)) return [3 /*break*/, 4];
            bestCaption = captionData.captions[0];
            // Update text and save to backend
            setText(bestCaption.text);
            endpointUrl_5 = getServiceURL('content-gen');
            selectedImageIndex = selectedImages[postIndex - 1] - 1;
            updatedTextVersions = __spreadArray([], currentPost.text_versions || [], true);
            updatedTextVersions[selectedImageIndex] = bestCaption.text;
            return [
              4 /*yield*/,
              fetch(''.concat(endpointUrl_5, '/api/v1/contentgen/update-text-versions'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '.concat(profile.token),
                },
                body: JSON.stringify({
                  content_id: id,
                  week_num: week,
                  day_num: day + 1,
                  post_num: postIndex,
                  text: bestCaption.text,
                  text_versions: updatedTextVersions,
                  selected_image_index: selectedImageIndex,
                }),
              }),
            ];
          case 3:
            _a.sent();
            // Update local state
            currentPost.text = bestCaption.text;
            currentPost.text_versions = updatedTextVersions;
            currentPost.caption_id = captionData.caption_id; // Store for regeneration
            _a.label = 4;
          case 4:
            return [3 /*break*/, 7];
          case 5:
            error_4 = _a.sent();
            console.error('Error generating caption:', error_4);
            setErrorText('Failed to generate caption');
            setErrorSaving(true);
            return [3 /*break*/, 7];
          case 6:
            setIsLoadingText(false);
            return [7 /*endfinally*/];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  // Function to regenerate caption with modifications
  var regenerateCaptionWithStyle = function (style) {
    return __awaiter(void 0, void 0, void 0, function () {
      var currentPost, captionId, captionData, error_5;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            currentPost = Array.isArray(content) ? content[postIndex - 1] : content;
            if (!currentPost || !(profile === null || profile === void 0 ? void 0 : profile.token))
              return [2 /*return*/];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, 4, 5]);
            setIsLoadingText(true);
            captionId = currentPost.caption_id || 'temp-' + Date.now();
            return [
              4 /*yield*/,
              captionApi.regenerateCaption(
                id,
                captionId,
                {
                  style: style,
                  preserve_hashtags: true,
                  custom_instruction: openModifyPrompt ? 'User requested modifications' : undefined,
                },
                profile.token
              ),
            ];
          case 2:
            captionData = _a.sent();
            // Update text with regenerated caption
            if (captionData.caption) {
              setText(captionData.caption.text);
              handleEdit(); // Apply the regenerated caption
            }
            return [3 /*break*/, 5];
          case 3:
            error_5 = _a.sent();
            console.error('Error regenerating caption:', error_5);
            setErrorText('Failed to regenerate caption');
            setErrorSaving(true);
            return [3 /*break*/, 5];
          case 4:
            setIsLoadingText(false);
            return [7 /*endfinally*/];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  var currentPost = Array.isArray(content) ? content[postIndex - 1] : content;
  return _jsxs('div', {
    className: 'border-[1px] border-[#E5E7EB] bg-white rounded-lg p-4 flex flex-col gap-2   h-full',
    children: [
      _jsx('div', {
        className: 'flex items-center',
        children: _jsxs('p', {
          className: 'text-[#6B7280] font-bold text-sm flex flex-row gap-3',
          children: [
            'Post ',
            postIndex,
            ' ',
            _jsx('span', {
              className: 'font-normal text-sm text-[#6B7280]',
              children: postingTime,
            }),
          ],
        }),
      }),
      _jsxs('div', {
        className: 'bg-white p-0 rounded-m flex flex-col items-start gap-2 lg:gap-8 xl:gap-9',
        children: [
          _jsxs('div', {
            className:
              'border-[1px] border-[#E5E7EB] rounded-md w-full h-full lg:min-h-[220px] lg:min-w-[220px] xl:min-h-[300px] xl:min-w-[300px] 2xl:min-h-[524px] 2xl:min-w-[524px]',
            children: [
              (!currentPost ||
                (currentPost === null || currentPost === void 0
                  ? void 0
                  : currentPost.image_url) === undefined ||
                imageLoading) &&
                _jsx('div', {
                  className: 'flex items-center w-full aspect-square justify-center',
                  children: _jsx(CircularProgress, {}),
                }),
              currentPost &&
                (currentPost === null || currentPost === void 0
                  ? void 0
                  : currentPost.image_url) !== undefined &&
                _jsxs('div', {
                  className: 'w-full relative',
                  children: [
                    _jsx('img', {
                      src:
                        (_b =
                          currentPost === null || currentPost === void 0
                            ? void 0
                            : currentPost.image_url) === null || _b === void 0
                          ? void 0
                          : _b[
                              (selectedImages === null || selectedImages === void 0
                                ? void 0
                                : selectedImages[postIndex - 1]) - 1
                            ],
                      alt: 'Post '.concat(postIndex),
                      className: 'w-full object-cover rounded-md aspect-square  '.concat(
                        imageLoading ? 'hidden' : 'block'
                      ),
                      onLoad: handleImageLoad,
                      onError: handleImageError,
                    }),
                    (currentPost === null || currentPost === void 0
                      ? void 0
                      : currentPost.approved) !== true &&
                      _jsx('div', {
                        className:
                          'absolute bottom-2 right-2 py-2 px-2 gap-4 \n                      hover:cursor-pointer bg-white flex justify-center items-center rounded-sm',
                        children: loadingRegen
                          ? _jsx(CircularProgress, {
                              sx: { color: '#6C2BD9' },
                              size: 24,
                              thickness: 5,
                            })
                          : _jsxs(_Fragment, {
                              children: [
                                _jsx('button', {
                                  className: '',
                                  onClick: function () {
                                    return setExpandImage(true);
                                  },
                                  children: _jsx(TiArrowMaximise, {
                                    color: '#6C2BD9',
                                    size: '30px',
                                  }),
                                }),
                                _jsx('button', {
                                  onClick: function () {
                                    return remainingGenerations
                                      ? setOpenModifyPrompt(true)
                                      : setLimitReached(true);
                                  },
                                  children: _jsx(AutoAwesomeOutlinedIcon, {
                                    sx: {
                                      color: '#6C2BD9',
                                      fontSize: '30px',
                                    },
                                  }),
                                }),
                                _jsx('button', {
                                  onClick: function () {
                                    return remainingGenerations
                                      ? handleRegenerateClick()
                                      : setLimitReached(true);
                                  },
                                  children: _jsx(IoMdRefresh, { color: '#6C2BD9', size: 24 }),
                                }),
                              ],
                            }),
                      }),
                  ],
                }),
            ],
          }),
          _jsxs('div', {
            className:
              'relative border-[1px] border-[#E4E4E4] rounded-md p-2 w-full min-h-36 h-full ',
            children: [
              edit === true
                ? _jsx(_Fragment, {
                    children: _jsx('textarea', {
                      ref: textareaRef,
                      className:
                        'w-full font-[350] resize-none h-[100px]  2xl:h-[100px] focus:outline-none text-xs border-[0.5px] border-[#AAAAAA] text-black',
                      value: text,
                      onChange: function (e) {
                        setText(e.target.value);
                        setShowQualityScore(true);
                      },
                      onFocus: function () {
                        return setShowQualityScore(true);
                      },
                    }),
                  })
                : _jsx(_Fragment, {
                    children:
                      isLoadingText || loadingRegen
                        ? _jsxs('div', {
                            role: 'status',
                            className: 'animate-pulse pt-2',
                            children: [
                              _jsx('div', { className: 'h-2 bg-gray-300 rounded-full mb-2.5' }),
                              _jsx('div', { className: 'h-2 bg-gray-300 rounded-full mb-2.5' }),
                              _jsx('div', { className: 'h-2 bg-gray-300 rounded-full mb-2.5' }),
                              _jsx('div', { className: 'h-2 bg-gray-300 rounded-full mb-2.5' }),
                              _jsx('div', {
                                className: 'h-2 bg-gray-300 rounded-full max-w-[70%] mb-2.5',
                              }),
                            ],
                          })
                        : _jsx('p', {
                            ref: pRef,
                            className:
                              'text-xs font-normal text-black overflow-hidden text-ellipsis whitespace-normal break-words',
                            children:
                              (currentPost === null || currentPost === void 0
                                ? void 0
                                : currentPost.text) || '',
                          }),
                  }),
              _jsxs('div', {
                className:
                  'absolute bottom-2 right-2 flex flex-row gap-2 items-center justify-center',
                children: [
                  (currentPost === null || currentPost === void 0
                    ? void 0
                    : currentPost.approved) !== true &&
                    _jsxs(_Fragment, {
                      children: [
                        !edit &&
                          _jsxs(_Fragment, {
                            children: [
                              _jsx('div', {
                                onClick: function (e) {
                                  if (isLoadingText) return; // Prevent clicks while loading
                                  if (
                                    currentPost === null || currentPost === void 0
                                      ? void 0
                                      : currentPost.caption_id
                                  ) {
                                    // If we have a caption, show dropdown for variations
                                    setCaptionMenuAnchor(e.currentTarget);
                                  } else {
                                    // First time, generate new caption
                                    generateCaptionWithAI();
                                  }
                                },
                                className:
                                  'border-[1px] border-[#E4E4E4] py-2 px-2 hover:cursor-pointer bg-white flex justify-center items-center rounded-sm transition-colors '.concat(
                                    isLoadingText ? 'opacity-50 cursor-wait' : 'hover:bg-purple-50'
                                  ),
                                title: isLoadingText
                                  ? 'Generating...'
                                  : (
                                        currentPost === null || currentPost === void 0
                                          ? void 0
                                          : currentPost.caption_id
                                      )
                                    ? 'Caption Variations'
                                    : 'Generate AI Caption',
                                children: isLoadingText
                                  ? _jsx(CircularProgress, { size: 20, sx: { color: '#6C2BD9' } })
                                  : _jsxs(_Fragment, {
                                      children: [
                                        _jsx(AutoAwesomeOutlinedIcon, {
                                          sx: { color: '#6C2BD9', fontSize: 24 },
                                        }),
                                        (currentPost === null || currentPost === void 0
                                          ? void 0
                                          : currentPost.caption_id) &&
                                          _jsx(ArrowDropDownIcon, {
                                            sx: {
                                              color: '#6C2BD9',
                                              fontSize: 18,
                                              marginLeft: -0.5,
                                            },
                                          }),
                                      ],
                                    }),
                              }),
                              _jsxs(Menu, {
                                anchorEl: captionMenuAnchor,
                                open: captionMenuOpen,
                                onClose: function () {
                                  return setCaptionMenuAnchor(null);
                                },
                                anchorOrigin: {
                                  vertical: 'top',
                                  horizontal: 'left',
                                },
                                transformOrigin: {
                                  vertical: 'bottom',
                                  horizontal: 'left',
                                },
                                children: [
                                  _jsx(MenuItem, {
                                    disabled: isLoadingText,
                                    onClick: function () {
                                      setCaptionMenuAnchor(null);
                                      generateCaptionWithAI();
                                    },
                                    children: 'Generate New',
                                  }),
                                  _jsx(MenuItem, {
                                    disabled: isLoadingText,
                                    onClick: function () {
                                      setCaptionMenuAnchor(null);
                                      regenerateCaptionWithStyle('similar');
                                    },
                                    children: 'Similar Style',
                                  }),
                                  _jsx(MenuItem, {
                                    disabled: isLoadingText,
                                    onClick: function () {
                                      setCaptionMenuAnchor(null);
                                      regenerateCaptionWithStyle('different');
                                    },
                                    children: 'Different Style',
                                  }),
                                  _jsx(MenuItem, {
                                    disabled: isLoadingText,
                                    onClick: function () {
                                      setCaptionMenuAnchor(null);
                                      regenerateCaptionWithStyle('shorter');
                                    },
                                    children: 'Make Shorter',
                                  }),
                                  _jsx(MenuItem, {
                                    disabled: isLoadingText,
                                    onClick: function () {
                                      setCaptionMenuAnchor(null);
                                      regenerateCaptionWithStyle('longer');
                                    },
                                    children: 'Make Longer',
                                  }),
                                ],
                              }),
                            ],
                          }),
                        _jsx('div', {
                          onClick: handleEdit,
                          className: ''.concat(
                            edit === true ? 'opacity-15 hover:opacity-100' : '',
                            ' border-[1px] border-[#E4E4E4] py-2 px-2 hover:cursor-pointer bg-white flex justify-center items-center rounded-sm'
                          ),
                          children:
                            edit === true
                              ? _jsx(FaCheck, { color: '#6C2BD9', size: 24 })
                              : _jsx(MdModeEdit, { color: '#6C2BD9', size: 24 }),
                        }),
                      ],
                    }),
                  edit === true &&
                    _jsx('div', {
                      onClick: function () {
                        return setEdit(false);
                      },
                      className:
                        'border-[1px] border-[#E4E4E4] py-2 px-2 hover:cursor-pointer bg-white flex justify-center items-center rounded-sm opacity-15 hover:opacity-100',
                      children: _jsx(MdCancel, { color: '#6C2BD9', size: 24 }),
                    }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsxs('div', {
        className: 'flex-col-reverse flex mt-0 gap-2 justify-end h-full ',
        children: [
          DisplayOptions() &&
            currentPost &&
            _jsx('div', {
              className: 'self-center',
              children: _jsx(PaginationImage, {
                images: currentPost.image_url,
                currentPage: selectedImages[postIndex - 1],
                approved: currentPost.approved,
                onPageChange: function (currentStep) {
                  var newSelectedImages = __spreadArray([], selectedImages, true);
                  newSelectedImages[postIndex - 1] = currentStep;
                  setSelectedImages(newSelectedImages);
                  handleReselectText(currentStep - 1);
                },
              }),
            }),
          _jsx('div', {
            className: 'self-end',
            children: (currentPost === null || currentPost === void 0 ? void 0 : currentPost.posted)
              ? _jsxs('button', {
                  className:
                    'bg-green-500 font-medium text-white w-24 rounded-md flex flex-row justify-center items-center text-base gap-2 px-2 py-2',
                  disabled: true,
                  children: [_jsx(FaCheck, { size: '12px' }), 'Posted'],
                })
              : !(currentPost === null || currentPost === void 0 ? void 0 : currentPost.approved)
                ? _jsx('button', {
                    onClick: function () {
                      return handleApprove(true);
                    },
                    className:
                      'bg-[#FDF6B2] border-[1px] border-[#8E4B10] font-semibold text-[#8E4B10] rounded-md px-2 py-2 text-base flex justify-center items-center',
                    disabled: loading,
                    children: loading
                      ? _jsx(CircularProgress, { sx: { color: '#000000' }, size: 25, thickness: 5 })
                      : _jsxs('span', {
                          className: 'flex items-center gap-2',
                          children: [
                            _jsx(IoMdCheckmark, {}),
                            _jsx('span', { children: 'Approve Post' }),
                          ],
                        }),
                  })
                : _jsx('div', {
                    className: 'relative',
                    onMouseEnter: function () {
                      return setHovering(true);
                    },
                    onMouseLeave: function () {
                      return setHovering(false);
                    },
                    children: showCancelUI
                      ? _jsx('button', {
                          onClick: function () {
                            return handleApprove(false);
                          },
                          disabled: loading,
                          className:
                            'w-fit border-[1px] border-red-600 font-semibold text-red-800 rounded-md px-2 py-2 text-base flex justify-center items-center gap-2 '.concat(
                              loading
                                ? 'cursor-not-allowed bg-red-200'
                                : 'bg-red-100 hover:bg-red-200'
                            ),
                          children: loading
                            ? _jsx(CircularProgress, {
                                sx: { color: '#000000' },
                                size: 25,
                                thickness: 5,
                              })
                            : _jsxs('span', {
                                className: 'flex gap-2 items-center',
                                children: [
                                  _jsx(IoClose, {}),
                                  _jsx('span', { children: 'Cancel approved' }),
                                ],
                              }),
                        })
                      : _jsxs('div', {
                          className:
                            'bg-[#DEF7EC] border-[1px] border-[#046C4E] font-semibold text-[#356751] rounded-md px-2 py-2 text-base flex justify-center items-center gap-2',
                          children: [_jsx(MdOutlinePublishedWithChanges, {}), 'Ready to Publish'],
                        }),
                  }),
          }),
        ],
      }),
      _jsx(ErrorToast, {
        message: errorText,
        open: errorSaving,
        onClose: function () {
          return setErrorSaving(false);
        },
      }),
      _jsx(ModifyPrompt, {
        open: openModifyPrompt,
        setOpen: setOpenModifyPrompt,
        image:
          (_c = currentPost === null || currentPost === void 0 ? void 0 : currentPost.image_url) ===
            null || _c === void 0
            ? void 0
            : _c[
                (selectedImages === null || selectedImages === void 0
                  ? void 0
                  : selectedImages[postIndex - 1]) - 1
              ],
        week: week,
        day: day + 1,
        post: postIndex - 1,
        content_id: id,
        regenerate: regenerateImage,
        totalAllowed: totalAllowed,
      }),
      expandImage &&
        _jsxs('div', {
          className: 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4',
          children: [
            _jsxs('div', {
              className: 'relative max-h-full max-w-full',
              children: [
                _jsx('button', {
                  className:
                    ' flex justify-center items-center absolute right-0 text-white w-8 h-8 hover:bg-white/20 rounded-tr-lg',
                  onClick: function () {
                    return setExpandImage(false);
                  },
                  children: _jsx(MdOutlineClose, { size: 20 }),
                }),
                _jsx('img', {
                  src:
                    ((_d = currentPost.image_url) === null || _d === void 0
                      ? void 0
                      : _d[selectedImages[postIndex - 1] - 1]) || '/placeholder.svg',
                  className: 'max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl',
                }),
              ],
            }),
            _jsx('div', {
              className: 'absolute inset-0 -z-10',
              onClick: function () {
                return setExpandImage(false);
              },
            }),
          ],
        }),
      _jsx(Dialog, {
        open: limitReached,
        onClose: function () {
          return setLimitReached(false);
        },
        maxWidth: 'sm',
        fullWidth: true,
        children: _jsxs(DialogContent, {
          className: 'relative',
          children: [
            _jsx('button', {
              className: 'absolute z-50 right-4 text-gray-500 hover:text-gray-700',
              onClick: function () {
                return setLimitReached(false);
              },
              'aria-label': 'Close',
              children: _jsx(MdClose, { size: 20 }),
            }),
            _jsxs('div', {
              className: 'text-center',
              children: [
                _jsx('h2', {
                  className: 'text-xl font-bold text-purple-600 mb-4',
                  children: 'Regeneration Limit Reached',
                }),
                _jsx('p', {
                  className: 'text-gray-700 mb-6',
                  children:
                    "You've hit your regeneration limit for this content. We'll keep you posted when Matchpoint Unlimited\u2014with more regenerations\u2014is ready for you.",
                }),
                _jsx('div', {
                  className: 'flex flex-col gap-3',
                  children: _jsx(PurpleButton, {
                    onClick: function () {
                      setLimitReached(false);
                    },
                    children: 'Keep Current Image',
                  }),
                }),
              ],
            }),
          ],
        }),
      }),
      edit &&
        showQualityScore &&
        text &&
        _jsx('div', {
          className: 'mt-4',
          children: _jsx(QualityScoreIndicator, {
            content: text,
            contentType: 'caption',
            brandContext: {
              brandId: brandName,
              campaignId: id,
            },
            onScoreChange: function (score) {
              setCurrentQualityScore(score);
            },
            showDetails: true,
            position: 'inline',
          }),
        }),
    ],
  });
};
export default SocialMediaPost;
//# sourceMappingURL=SocialMediaPost.js.map
