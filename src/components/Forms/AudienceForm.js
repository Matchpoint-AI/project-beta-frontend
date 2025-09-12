var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import { BrandContext } from '../../features/brand/context/BrandContext';
import { CampaignContext } from '../../context/CampaignContext';
import AgeDropdown from '../shared/AgeDropdown';
import Dropdown from '../../shared/components/ui/Dropdown';
// import CustomInput from "../shared/Inputs/CustomInput";
import FormsContainer from '../shared/FormsContainer';
import BackButton from '../../shared/components/buttons/BackButton';
import NextButton from '../../shared/components/buttons/NextButton';
import { getServiceURL } from '../../helpers/getServiceURL';
import AudienceDetails from '../AudienceDetails';
import posthog from '../../helpers/posthog';
import { useAuth } from '../../features/auth/context/AuthContext';
var AudienceForm = function (_a) {
    var _b, _c, _d, _e, _f;
    var handleNext = _a.handleNext, handleBack = _a.handleBack, _g = _a.review, review = _g === void 0 ? false : _g;
    var businessInfo = useContext(BrandContext).businessInfo;
    var _h = useContext(CampaignContext), campaignInfo = _h.campaignInfo, setCampaignInfo = _h.setCampaignInfo;
    var profile = useAuth().profile;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var _j = React.useState((_b = campaignInfo.audienceEmotion) !== null && _b !== void 0 ? _b : []), audienceEmotion = _j[0], setAudienceEmotion = _j[1];
    var _k = React.useState((_c = campaignInfo.audienceInterests) !== null && _c !== void 0 ? _c : []), audienceInterests = _k[0], setAudienceInterests = _k[1];
    var options = ['All Ages', '18-24', '25-34', '35-44', '45-54', '55-64', '18+', '21+', '65+'];
    var _l = useState((_d = campaignInfo.audienceAgeRange) !== null && _d !== void 0 ? _d : []), audienceAgeRange = _l[0], setAudienceAgeRage = _l[1];
    var _m = useState((_e = campaignInfo.audienceGender) !== null && _e !== void 0 ? _e : ''), audienceGender = _m[0], setAudienceGender = _m[1];
    var _o = useState((_f = campaignInfo.audienceRace) !== null && _f !== void 0 ? _f : ''), audienceRace = _o[0], setAudienceRace = _o[1];
    // audienceRace
    var prompt = "For the brand ".concat(businessInfo.name, " and the data we collected from their URL in step 1: ").concat(JSON.stringify({
        name: businessInfo.name,
        industry: businessInfo.industry,
    }), ", please provide the audience emotion and interests to portray in an image that most closely aligns with ").concat(campaignInfo.purpose, " that will result in a best in class social campaign within the ").concat(businessInfo.industry, " industry and ").concat(businessInfo.vertical, " vertical. Provide the answer in the form of two arrays of strings where the first array represents audience emotions and the second array represents audience interests. Answer should be just the arrays and nothing else.");
    useEffect(function () {
        if (campaignInfo.campaign_id !== undefined)
            return;
        if (audienceEmotion.length !== 0 && audienceInterests.length !== 0)
            return;
        var endpointUrl = "".concat(getServiceURL('llm'), "/api/v1/llm/openai");
        fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
            }),
        })
            .then(function (response) { return response.json(); })
            .then(function (_data) {
            var choices = _data.response.choices;
            var content = choices[0].message.content;
            var arrays = content.match(/\[.*?\]/g);
            if (arrays && arrays.length === 2) {
                var array1_1 = JSON.parse(arrays[0]);
                var array2_1 = JSON.parse(arrays[1]);
                setAudienceEmotion(array1_1.slice(0, 3));
                setAudienceInterests(array2_1.slice(0, 3));
                setCampaignInfo(function (prev) { return (__assign(__assign({}, prev), { audienceEmotion: array1_1.slice(0, 3), audienceInterests: array2_1.slice(0, 3) })); });
                // Assuming you have another state or function to handle the second array
            }
        })
            .catch(function (_error) { });
    }, []);
    var handleSubmit = function (e) {
        e.preventDefault();
        setCampaignInfo(function (prev) { return (__assign(__assign({}, prev), { audienceEmotion: audienceEmotion, audienceInterests: audienceInterests })); });
        if (posthog.__loaded) {
            posthog.capture('Campaign Step Completed', {
                distinct_id: profile === null || profile === void 0 ? void 0 : profile.id,
                step: 3,
            });
        }
        handleNext();
    };
    var clickHandler = function () {
        if (campaignInfo.purposeAbout === 'Our business’s brand')
            handleBack(2);
        else
            handleBack();
    };
    useEffect(function () {
        setCampaignInfo(function (prev) { return (__assign(__assign({}, prev), { audienceAgeRange: audienceAgeRange })); });
    }, [audienceAgeRange]);
    useEffect(function () {
        setCampaignInfo(function (prev) { return (__assign(__assign({}, prev), { audienceGender: audienceGender })); });
    }, [audienceGender]);
    useEffect(function () {
        setCampaignInfo(function (prev) { return (__assign(__assign({}, prev), { audienceRace: audienceRace })); });
    }, [audienceRace]);
    return (_jsxs(_Fragment, { children: [_jsx(FormsContainer, { children: _jsxs("form", { id: "audience_form", onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-5", children: [_jsx("label", { title: "email", className: "block mb-2 text-xl font-medium text-gray-900", children: "Audience Gender" }), _jsx("p", { className: "my-2 text-sm text-[#111928]", children: "Select 1" }), _jsx(Dropdown, { currentValue: audienceGender, options: [
                                        'Everyone',
                                        'Female',
                                        'Male',
                                        'Non-binary',
                                        'Genderqueer',
                                        'Genderfluid',
                                        'Agender',
                                        'Bigender',
                                        'Transgender Male',
                                        'Transgender Female',
                                    ], onUpdateContext: function (value) {
                                        setAudienceGender(value);
                                        // setCampaignInfo({ ...campaignInfo, audienceGender: value });
                                    }, className: "w-full" })] }), _jsxs("div", { className: "mb-5", children: [_jsx("label", { title: "email", className: "block mb-2 text-xl font-medium text-gray-900", children: "Audience Race/Ethnicity" }), _jsx("p", { className: "my-2 text-sm text-[#111928]", children: "Select 1" }), _jsx(Dropdown, { currentValue: audienceRace, options: [
                                        'Everyone',
                                        'American Indian or Alaska Native',
                                        'Asian or Asian American',
                                        'Black or African American',
                                        'Hispanic or Latino',
                                        'Indian',
                                        'Middle Eastern or North African',
                                        'Native Hawaiian or Pacific Islander',
                                        'White or European',
                                        'Other',
                                    ], onUpdateContext: function (value) {
                                        setAudienceRace(value);
                                        // setCampaignInfo({ ...campaignInfo, audienceRace: value });
                                    }, className: "w-full" })] }), _jsxs("div", { className: "mb-5", children: [_jsx("div", { className: "flex items-center gap-3", children: _jsx("label", { title: "email", className: "block mb-2 text-xl font-medium text-gray-900", children: "Audience Age Range" }) }), _jsx("p", { className: "text-[#111928] text-sm", children: "Select up to 2" }), _jsx("div", { className: "mt-2 space-x-0 space-y-2 p-0 rounded-md", children: _jsx(AgeDropdown, { currentValues: audienceAgeRange, options: options, onUpdateContext: function (value) {
                                            setAudienceAgeRage(value);
                                        } }) })] }), _jsx(AudienceDetails, { title: "Audience Interests", values: audienceInterests, setValues: setAudienceInterests, genre: "interests" }), _jsx(AudienceDetails, { title: "Audience Emotion", values: audienceEmotion, setValues: setAudienceEmotion, genre: "emotion" })] }) }), !review && (_jsxs("div", { className: "flex justify-between mb-10 w-full", children: [_jsx(BackButton, { onClick: clickHandler }), _jsx(NextButton, { text: "Next", formId: "audience_form" })] }))] }));
};
export default AudienceForm;
//# sourceMappingURL=AudienceForm.js.map