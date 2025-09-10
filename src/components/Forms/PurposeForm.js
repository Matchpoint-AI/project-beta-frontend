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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useContext, useEffect, useRef, useState } from 'react';
import { CampaignContext } from '../../context/CampaignContext';
import FormsContainer from '../shared/FormsContainer';
import NextButton from '../../shared/components/buttons/NextButton';
import WebsiteOwnership from '../WebsiteOwnership';
import CampaignFormInput from '../../shared/components/inputs/CampaignFormInput';
import Dropdown from '../../features/campaign/components/CampaignDropdown';
import LanguageSelector from '../../features/campaign/components/LanguageSelector';
import { BrandContext } from '../../context/BrandContext';
import { useAuth } from '../../features/auth/context/AuthContext';
import posthog from '../../helpers/posthog';
var PurposeForm = function (_a) {
  var _b, _c, _d, _e;
  var handleNext = _a.handleNext,
    _f = _a.review,
    review = _f === void 0 ? false : _f;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var _g = useContext(CampaignContext),
    campaignInfo = _g.campaignInfo,
    setCampaignInfo = _g.setCampaignInfo;
  var businessInfo = useContext(BrandContext).businessInfo;
  var _h = useState(
      (_b = campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.purpose) !==
        null && _b !== void 0
        ? _b
        : 'Make customers aware/excited'
    ),
    purpose = _h[0],
    setPurpose = _h[1];
  var _j = useState(
      (_c =
        campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.purposeAbout) !==
        null && _c !== void 0
        ? _c
        : "Our business's brand"
    ),
    purposeAbout = _j[0],
    setPurposeAbout = _j[1];
  var _k = useState((_d = campaignInfo.name) !== null && _d !== void 0 ? _d : ''),
    name = _k[0],
    setName = _k[1];
  var _l = useState((_e = campaignInfo.language) !== null && _e !== void 0 ? _e : 'en'),
    selectedLanguage = _l[0],
    setSelectedLanguage = _l[1];
  var _m = useState(null),
    error = _m[0],
    setError = _m[1];
  var _o = useState(false),
    openPurpose = _o[0],
    setOpenPurpose = _o[1];
  var _p = useState(false),
    openAbout = _p[0],
    setOpenAbout = _p[1];
  var profile = useAuth().profile;
  var handleSubmit = function (e) {
    e.preventDefault();
    if (!campaignInfo.name || campaignInfo.name === '') {
      setError(true);
      return;
    }
    // Save the selected language to campaign info
    setCampaignInfo(function (prev) {
      return __assign(__assign({}, prev), { language: selectedLanguage });
    });
    if (purposeAbout === "Our business's brand") {
      setCampaignInfo(function (prev) {
        return __assign(__assign({}, prev), {
          product: businessInfo.name,
          language: selectedLanguage,
        });
      });
      handleNext === null || handleNext === void 0 ? void 0 : handleNext(2);
    } else handleNext === null || handleNext === void 0 ? void 0 : handleNext();
    if (posthog.__loaded) {
      posthog.capture('Campaign Step Completed', {
        distinct_id: profile === null || profile === void 0 ? void 0 : profile.id,
        step: 1, // Replace with actual step number
      });
    }
  };
  var handleOpenDropdown = function (target) {
    if (target === 'purpose') {
      setOpenPurpose(!openPurpose);
      setOpenAbout(false);
    }
    if (target === 'about') {
      setOpenAbout(!openAbout);
      setOpenPurpose(false);
    }
  };
  useEffect(
    function () {
      setCampaignInfo(function (prev) {
        return __assign(__assign({}, prev), { purpose: purpose });
      });
      setPurposeAbout(purposeOptions[0]);
    },
    [purpose]
  );
  useEffect(
    function () {
      setCampaignInfo(function (prev) {
        return __assign(__assign({}, prev), { purposeAbout: purposeAbout });
      });
    },
    [purposeAbout]
  );
  useEffect(
    function () {
      if (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.name)
        setName(campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.name);
      if (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.purpose)
        setPurpose(
          campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.purpose
        );
      if (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.purposeAbout)
        setPurposeAbout(
          campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.purposeAbout
        );
    },
    [campaignInfo]
  );
  var campaignPurpose = useRef([
    'Make customers aware/excited',
    'Drive customers to convert/use',
  ]).current;
  var purposeOptions = useRef([
    "Our business's brand",
    "Our business's services or products",
  ]).current;
  return _jsxs(_Fragment, {
    children: [
      _jsx(FormsContainer, {
        children: _jsxs('form', {
          id: 'purpose_form',
          onSubmit: handleSubmit,
          children: [
            _jsxs('div', {
              className: 'mb-5',
              children: [
                _jsx('h2', {
                  className: 'mb-2 text-lg md:text-xl font-medium text-gray-900',
                  children: 'What do you want to name your campaign?',
                }),
                _jsx(CampaignFormInput, {
                  name: name,
                  setName: setName,
                  error: error,
                  setError: setError,
                }),
              ],
            }),
            _jsxs('div', {
              className: 'mb-5',
              children: [
                _jsx('h2', {
                  className: 'mb-2 text-lg md:text-xl font-medium text-gray-900',
                  children: "What is your campaign's purpose?",
                }),
                _jsx('p', {
                  className: 'my-2 text-sm text-[#111928]',
                  children: 'What do you want customers to know or do after seeing your campaign?',
                }),
                _jsx(Dropdown, {
                  open: openPurpose,
                  setOpen: function () {
                    return handleOpenDropdown('purpose');
                  },
                  currentValue: purpose,
                  options: campaignPurpose,
                  onUpdateContext: function (value) {
                    setCampaignInfo(function (prev) {
                      return __assign(__assign({}, prev), { purpose: value });
                    });
                    setPurpose(value);
                  },
                  className: 'w-full',
                }),
              ],
            }),
            _jsxs('div', {
              className: 'mb-5',
              children: [
                _jsx('h2', {
                  className: 'mb-2 text-lg md:text-xl font-medium text-gray-900',
                  children: purpose.includes('Make') ? ''.concat(purpose, ' About') : purpose,
                }),
                _jsx(Dropdown, {
                  open: openAbout,
                  setOpen: function () {
                    return handleOpenDropdown('about');
                  },
                  currentValue: purposeAbout,
                  options: purposeOptions,
                  onUpdateContext: function (value) {
                    setCampaignInfo(function (prev) {
                      return __assign(__assign({}, prev), { purposeAbout: value });
                    });
                    setPurposeAbout(value);
                  },
                  className: 'w-full',
                }),
              ],
            }),
            _jsxs('div', {
              className: 'mb-5',
              children: [
                _jsx('h2', {
                  className: 'mb-2 text-lg md:text-xl font-medium text-gray-900',
                  children: 'Content Language',
                }),
                _jsx('p', {
                  className: 'mb-2 text-sm text-[#111928]',
                  children: 'Select the primary language for your campaign content',
                }),
                _jsx(LanguageSelector, {
                  selectedLanguage: selectedLanguage,
                  onLanguageChange: function (languageCode) {
                    setSelectedLanguage(languageCode);
                    setCampaignInfo(function (prev) {
                      return __assign(__assign({}, prev), { language: languageCode });
                    });
                  },
                  className: 'w-full',
                }),
              ],
            }),
          ],
        }),
      }),
      _jsx(WebsiteOwnership, {}),
      !review &&
        _jsx('div', {
          className: 'flex justify-between mb-10 w-full',
          children: _jsx(NextButton, { text: 'Next', formId: 'purpose_form' }),
        }),
    ],
  });
};
export default PurposeForm;
//# sourceMappingURL=PurposeForm.js.map
