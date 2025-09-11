import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useContext, useEffect, useState } from 'react';
import FormsContainer from '../shared/FormsContainer';
import { BrandContext } from '../../features/brand/context/BrandContext';
import WebsiteOwnership from '../WebsiteOwnership';
import NextButton from '../../shared/components/buttons/NextButton';
import IndustryVertical from '../onboard/IndustryVertical';
import WebsiteScrapingForm from '../onboard/WebsiteScrapingForm';
import BrandDetails from '../../features/brand/components/BrandDetails';
// import { ConnectInstagram } from "../ConnectToInstagram";
import InstaConnect from '../../shared/components/buttons/InstaConnect';
export default function BusinessForm(_a) {
  var handleNext = _a.handleNext;
  var businessInfo = useContext(BrandContext).businessInfo;
  var _b = useState(true),
    disableNext = _b[0],
    setDisableNext = _b[1];
  var checkValidity = function () {
    var _a, _b, _c;
    if (
      !(businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.industry) ||
      !(businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.website) ||
      !(businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.name)
    )
      return false;
    var values = (
      (_a = businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.values) !==
        null && _a !== void 0
        ? _a
        : []
    ).filter(function (c) {
      return c.selected;
    });
    var persona = (
      (_b = businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.persona) !==
        null && _b !== void 0
        ? _b
        : []
    ).filter(function (c) {
      return c.selected;
    });
    var toneAndVoice = (
      (_c =
        businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.toneAndVoice) !==
        null && _c !== void 0
        ? _c
        : []
    ).filter(function (c) {
      return c.selected;
    });
    if (
      (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.industry) &&
      (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.vertical) &&
      (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.mission) &&
      values.length > 0 &&
      persona.length > 0 &&
      toneAndVoice.length > 0
    )
      return true;
    return false;
  };
  var handleSubmit = function (e) {
    e.preventDefault();
    if (checkValidity()) handleNext();
  };
  useEffect(
    function () {
      setDisableNext(!checkValidity());
    },
    [businessInfo]
  );
  return _jsxs(_Fragment, {
    children: [
      _jsx(FormsContainer, {
        children: _jsxs('form', {
          id: 'business_form',
          onSubmit: handleSubmit,
          children: [
            _jsx(WebsiteScrapingForm, {}),
            _jsx(InstaConnect, {
              stats: { approved: 0, ready_for_review: 0 },
              startDate:
                (businessInfo === null || businessInfo === void 0
                  ? void 0
                  : businessInfo.start_date) || '',
              duration:
                (businessInfo === null || businessInfo === void 0
                  ? void 0
                  : businessInfo.durationNum) || 0,
            }),
            businessInfo.industry && businessInfo.vertical && _jsx(IndustryVertical, {}),
            businessInfo.mission && _jsx(BrandDetails, {}),
          ],
        }),
      }),
      _jsx(WebsiteOwnership, {}),
      _jsx('div', {
        className: 'flex justify-between mb-10 w-full',
        children: _jsx(NextButton, {
          text: 'Next',
          formId: 'business_form',
          disabled: disableNext,
        }),
      }),
    ],
  });
}
//# sourceMappingURL=BusinessForm.js.map
