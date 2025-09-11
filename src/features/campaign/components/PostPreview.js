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
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from 'react/jsx-runtime';
import { useContext, useEffect, useRef, useState } from 'react';
import PaginationImage from './PaginationImage';
import { BsThreeDots } from 'react-icons/bs';
import InstagramIcons from '../InstagramIcons';
import Options from '../../../components/shared/Options';
import { BrandContext } from '../../brand/context/BrandContext';
import ModifyPromptForm from './ModifyPromptForm';
import { TiArrowMaximise } from 'react-icons/ti';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { CircularProgress, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';
import { FaInstagram, FaTwitter, FaFacebook, FaLinkedin, FaTiktok } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';
var PostPreview = function (_a) {
  var week = _a.week,
    day = _a.day,
    index = _a.index,
    content = _a.content,
    brandName = _a.brandName,
    imageIndex = _a.imageIndex,
    campaign_content_id = _a.campaign_content_id,
    updataImage = _a.updataImage;
  var businessInfo = useContext(BrandContext).businessInfo;
  var _b = useState(1),
    currentImage = _b[0],
    setCurrentImage = _b[1];
  var _c = useState(false),
    edit = _c[0],
    setEdit = _c[1];
  var textareaRef = useRef(null);
  var _d = useState(content.text),
    text = _d[0],
    setText = _d[1];
  var _e = useState({ width: 192, height: 119 }),
    dimensions = _e[0],
    setDimensions = _e[1];
  var _f = useState(false),
    openPrompt = _f[0],
    setOpenPrompt = _f[1];
  var _g = useState(false),
    expandImage = _g[0],
    setExpandImage = _g[1];
  var profile = useAuth().profile;
  // DEMO-3 Enhanced Preview Features
  var _h = useState('instagram'),
    selectedPlatform = _h[0],
    setSelectedPlatform = _h[1];
  var _j = useState('mobile'),
    deviceType = _j[0],
    setDeviceType = _j[1];
  var pRef = useRef(null);
  var handleImageChange = function (val) {
    imageIndex[index] = val;
    setCurrentImage(val);
  };
  var formatText = function (text, containerWidth, containerHeight) {
    var truncatedText = text;
    var ellipsis = '...';
    var testElement = document.createElement('p');
    testElement.style.visibility = 'hidden';
    testElement.style.position = 'absolute';
    testElement.style.width = ''.concat(containerWidth, 'px');
    testElement.style.height = ''.concat(containerHeight, 'px');
    testElement.style.fontSize = '0.75rem'; // Match your Tailwind font-size
    testElement.style.lineHeight = '1rem'; // Adjust based on your text size
    testElement.style.whiteSpace = 'pre-wrap'; // Preserve new lines and white space
    testElement.style.wordBreak = 'break-word'; // Ensure long words break properly
    testElement.innerText = truncatedText;
    var count = 0;
    document.body.appendChild(testElement);
    while (testElement.scrollHeight > containerHeight && truncatedText.length > 0) {
      count++;
      truncatedText = truncatedText.slice(0, -1);
      testElement.innerText = truncatedText + ellipsis;
    }
    document.body.removeChild(testElement);
    if (count === 0) return truncatedText;
    return truncatedText + ellipsis;
  };
  var regenerateImage = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var endpointUrl, response, data, _a, url, newText, e_1;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 5, , 6]);
            endpointUrl = getServiceURL('content-gen');
            return [
              4 /*yield*/,
              fetch(''.concat(endpointUrl, '/api/v1/contentgen/regenerate'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '.concat(
                    profile === null || profile === void 0 ? void 0 : profile.token
                  ),
                },
                body: JSON.stringify({
                  content_id: campaign_content_id,
                  week_num: week,
                  day_num: day,
                  post_num: index + 1,
                }),
              }),
            ];
          case 1:
            response = _b.sent();
            if (!!response.ok) return [3 /*break*/, 3];
            return [4 /*yield*/, response.json()];
          case 2:
            data = _b.sent();
            throw new Error(data.detail);
          case 3:
            return [4 /*yield*/, response.json()];
          case 4:
            ((_a = _b.sent()), (url = _a.url), (newText = _a.newText));
            updataImage(week - 1, day - 1, index, imageIndex[index], url, newText);
            return [3 /*break*/, 6];
          case 5:
            e_1 = _b.sent();
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  useEffect(
    function () {
      if (pRef.current) {
        var _a = pRef.current,
          offsetWidth = _a.offsetWidth,
          offsetHeight = _a.offsetHeight;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    },
    [content]
  );
  useEffect(
    function () {
      setText(content.text);
    },
    [content]
  );
  useEffect(
    function () {
      if (edit === 'save') {
        content.text = text;
        setEdit(false);
      } else if (edit === false) {
        setText(content.text);
      }
    },
    [edit]
  );
  var DisplayOptions = function () {
    if (content.image_url === undefined) return false;
    if (content.image_url.length === 1) return false;
    return true;
  };
  // Platform configurations for DEMO-3
  var platformConfigs = {
    instagram: {
      icon: FaInstagram,
      color: '#E4405F',
      aspectRatio: 'aspect-square',
      name: 'Instagram',
    },
    twitter: {
      icon: FaTwitter,
      color: '#1DA1F2',
      aspectRatio: 'aspect-[16/9]',
      name: 'Twitter',
    },
    facebook: {
      icon: FaFacebook,
      color: '#1877F2',
      aspectRatio: 'aspect-[16/9]',
      name: 'Facebook',
    },
    linkedin: {
      icon: FaLinkedin,
      color: '#0A66C2',
      aspectRatio: 'aspect-[16/9]',
      name: 'LinkedIn',
    },
    tiktok: {
      icon: FaTiktok,
      color: '#000000',
      aspectRatio: 'aspect-[9/16]',
      name: 'TikTok',
    },
  };
  var currentPlatform = platformConfigs[selectedPlatform];
  var PlatformIcon = currentPlatform.icon;
  return _jsxs('div', {
    className: 'flex flex-col gap-2 my-6 sm:my-0',
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between',
        children: [
          _jsxs('h1', {
            className: 'font-bold text-sm text-gray-900',
            children: ['Post ', index + 1],
          }),
          _jsx('div', {
            className: 'flex items-center gap-2',
            children: _jsx(Chip, {
              icon: _jsx(PlatformIcon, {}),
              label: currentPlatform.name,
              size: 'small',
              sx: {
                backgroundColor: currentPlatform.color,
                color: 'white',
                '& .MuiChip-icon': { color: 'white' },
              },
            }),
          }),
        ],
      }),
      _jsxs('div', {
        className: 'flex gap-2 mb-2',
        children: [
          _jsxs(FormControl, {
            size: 'small',
            sx: { minWidth: 120 },
            children: [
              _jsx(InputLabel, { children: 'Platform' }),
              _jsx(Select, {
                value: selectedPlatform,
                label: 'Platform',
                onChange: function (e) {
                  return setSelectedPlatform(e.target.value);
                },
                children: Object.entries(platformConfigs).map(function (_a) {
                  var key = _a[0],
                    config = _a[1];
                  var Icon = config.icon;
                  return _jsx(
                    MenuItem,
                    {
                      value: key,
                      children: _jsxs('div', {
                        className: 'flex items-center gap-2',
                        children: [_jsx(Icon, { size: 16, color: config.color }), config.name],
                      }),
                    },
                    key
                  );
                }),
              }),
            ],
          }),
          _jsxs(FormControl, {
            size: 'small',
            sx: { minWidth: 100 },
            children: [
              _jsx(InputLabel, { children: 'Device' }),
              _jsxs(Select, {
                value: deviceType,
                label: 'Device',
                onChange: function (e) {
                  return setDeviceType(e.target.value);
                },
                children: [
                  _jsx(MenuItem, { value: 'mobile', children: 'Mobile' }),
                  _jsx(MenuItem, { value: 'desktop', children: 'Desktop' }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsxs('div', {
        className: 'flex flex-col bg-white rounded-lg border '
          .concat(deviceType === 'mobile' ? 'w-full sm:w-[320px]' : 'w-full max-w-[500px]', ' ')
          .concat(deviceType === 'mobile' ? 'aspect-[64/129]' : 'aspect-[3/2]'),
        children: [
          selectedPlatform === 'instagram' &&
            _jsxs('div', {
              className: 'flex flex-row justify-between items-center px-2 w-full h-[60px]',
              children: [
                _jsxs('div', {
                  className: 'flex flex-row gap-2',
                  children: [
                    businessInfo.logo !== '' &&
                      _jsx('div', {
                        style: {
                          backgroundImage:
                            "url('https://storage.googleapis.com/matchpoint-brands-logos/".concat(
                              businessInfo.logo,
                              "')"
                            ),
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                        },
                        className: 'w-[32px] h-[32px] rounded-full',
                      }),
                    _jsxs('div', {
                      className: 'flex flex-col gap-[1px] text-black',
                      children: [
                        _jsx('h1', {
                          className: 'font-[556] text-xs capitalize',
                          children: brandName,
                        }),
                        _jsx('p', {
                          className: 'font-[457] text-[10px] capitalize',
                          children: brandName,
                        }),
                      ],
                    }),
                  ],
                }),
                _jsx(BsThreeDots, { color: '#4F4F4F', size: '20px' }),
              ],
            }),
          (content === null || content === void 0 ? void 0 : content.image_url) === undefined
            ? _jsx('div', {
                className: 'flex items-center w-full justify-center '.concat(
                  currentPlatform.aspectRatio
                ),
                children: _jsx(CircularProgress, {}),
              })
            : _jsx('div', {
                style: {
                  backgroundImage: "url('".concat(
                    content === null || content === void 0
                      ? void 0
                      : content.image_url[currentImage - 1],
                    "')"
                  ),
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                },
                className: 'w-full '.concat(currentPlatform.aspectRatio, ' relative'),
                children: _jsxs('div', {
                  className:
                    'w-full h-full hover:bg-[#00000099] flex items-center justify-center group gap-4 ',
                  children: [
                    (profile === null || profile === void 0 ? void 0 : profile.is_admin) &&
                      _jsx('button', {
                        className: 'group-hover:block hidden',
                        onClick: function () {
                          return setOpenPrompt(true);
                        },
                        children: _jsx(AutoAwesomeOutlinedIcon, {
                          sx: { color: 'white', fontSize: '30px' },
                        }),
                      }),
                    _jsx('button', {
                      className: 'group-hover:block hidden',
                      onClick: function () {
                        return setExpandImage(true);
                      },
                      children: _jsx(TiArrowMaximise, { color: 'white', size: '30px' }),
                    }),
                  ],
                }),
              }),
          _jsxs('div', {
            className: 'px-2 flex flex-col gap-[6px] flex-grow',
            children: [
              selectedPlatform === 'instagram' &&
                _jsxs(_Fragment, {
                  children: [
                    _jsx(InstagramIcons, {}),
                    _jsx('p', { className: 'font-[457] text-xs', children: '2,563 likes' }),
                  ],
                }),
              selectedPlatform === 'twitter' &&
                _jsx('div', {
                  className: 'flex items-center gap-2 py-2',
                  children: _jsx('div', {
                    className: 'flex flex-col gap-[1px] text-black',
                    children: _jsxs('h1', {
                      className: 'font-[556] text-sm',
                      children: ['@', brandName.toLowerCase().replace(/\s+/g, '')],
                    }),
                  }),
                }),
              selectedPlatform === 'facebook' &&
                _jsx('div', {
                  className: 'flex items-center gap-2 py-2 border-b',
                  children: _jsxs('div', {
                    className: 'flex flex-col gap-[1px] text-black',
                    children: [
                      _jsx('h1', { className: 'font-[556] text-sm', children: brandName }),
                      _jsx('p', {
                        className: 'font-[400] text-xs text-gray-500',
                        children: 'Sponsored',
                      }),
                    ],
                  }),
                }),
              selectedPlatform === 'linkedin' &&
                _jsx('div', {
                  className: 'flex items-center gap-2 py-2 border-b',
                  children: _jsxs('div', {
                    className: 'flex flex-col gap-[1px] text-black',
                    children: [
                      _jsx('h1', { className: 'font-[556] text-sm', children: brandName }),
                      _jsx('p', {
                        className: 'font-[400] text-xs text-gray-500',
                        children: 'Company \u2022 Promoted',
                      }),
                    ],
                  }),
                }),
              edit === true
                ? _jsx('textarea', {
                    ref: textareaRef,
                    className:
                      'flex-grow font-[350] resize-none focus:outline-none text-xs border-[0.5px] border-[#AAAAAA] text-black',
                    value: text,
                    onChange: function (e) {
                      return setText(e.target.value);
                    },
                  })
                : _jsxs('p', {
                    ref: pRef,
                    className:
                      'flex-grow font-[350] text-xs text-black overflow-y-auto text-ellipsis whitespace-normal break-words',
                    children: [
                      selectedPlatform === 'instagram' &&
                        _jsx('span', {
                          className: 'font-[556] text-xs capitalize',
                          children: ''.concat(brandName, ' '),
                        }),
                      formatText(text, dimensions.width, dimensions.height),
                    ],
                  }),
              content.approved !== true &&
                content.posted !== true &&
                _jsx(Options, { edit: edit, setEdit: setEdit, regenerateImage: regenerateImage }),
              content.posted === true &&
                _jsxs('button', {
                  className:
                    'bg-green-500 mb-[13px] self-end font-medium p-1 text-white w-24 rounded-lg flex flex-row justify-center items-center text-sm gap-2',
                  disabled: true,
                  children: [_jsx(FaCheck, { size: 16 }), 'Posted'],
                }),
            ],
          }),
        ],
      }),
      DisplayOptions() &&
        _jsxs('div', {
          className: 'w-full flex flex-row gap-2 items-center',
          children: [
            _jsx('h1', { className: 'font-medium text-sm text-black', children: 'Image Options:' }),
            _jsx(PaginationImage, {
              totalPages:
                (content === null || content === void 0 ? void 0 : content.image_url) !== undefined
                  ? content === null || content === void 0
                    ? void 0
                    : content.image_url.length
                  : 0,
              approved: content === null || content === void 0 ? void 0 : content.approved,
              currentPage: currentImage,
              onPageChange: handleImageChange,
            }),
          ],
        }),
      _jsx(ModifyPromptForm, {
        open: openPrompt,
        setOpen: setOpenPrompt,
        week: week,
        day: day,
        post: index,
        content_id: campaign_content_id,
      }),
      expandImage &&
        _jsx('div', {
          className:
            'fixed top-0 left-0 h-screen w-screen bg-[#00000080] px-3 flex items-center justify-center backdrop:blur-lg',
          onClick: function () {
            return setExpandImage(false);
          },
          children: _jsx('div', {
            style: {
              backgroundImage: "url('".concat(content.image_url[currentImage - 1], "')"),
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            },
            className: 'w-full max-w-[600px] aspect-square',
          }),
        }),
    ],
  });
};
export default PostPreview;
//# sourceMappingURL=PostPreview.js.map
