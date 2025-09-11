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
import { CampaignContext } from '../../context/CampaignContext';
import Dropdown from '../../shared/components/ui/Dropdown';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FormsContainer from '../shared/FormsContainer';
import BackButton from '../../shared/components/buttons/BackButton';
import NextButton from '../../shared/components/buttons/NextButton';
import posthog from '../../helpers/posthog';
import { useAuth } from '../../features/auth/context/AuthContext';
var TimingForm = function (_a) {
    var _b, _c, _d;
    var handleNext = _a.handleNext, handleBack = _a.handleBack, setTiming = _a.setTiming, _e = _a.review, review = _e === void 0 ? false : _e;
    var _f = useContext(CampaignContext), campaignInfo = _f.campaignInfo, setCampaignInfo = _f.setCampaignInfo;
    var _g = React.useState(null), value = _g[0], setValue = _g[1];
    // const [open, setOpen] = React.useState<boolean>(false);
    var profile = useAuth().profile;
    var _h = useState((_b = campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.duration) !== null && _b !== void 0 ? _b : '1 Week'), duration = _h[0], setDuration = _h[1];
    var _j = useState((_c = campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.postingFrequency) !== null && _c !== void 0 ? _c : '3 posts per day'), postingFrequency = _j[0], setPostingFrequency = _j[1];
    var _k = useState((_d = campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.deliveryDay) !== null && _d !== void 0 ? _d : 'Monday'), deliveryDay = _k[0], setDeliveryDay = _k[1];
    var convertToNumber = function (str) {
        // Extract the number from the beginning of the string
        var numberMatch = str.match(/^\d+/);
        // If a number is found, return it as a number type
        if (numberMatch) {
            return parseInt(numberMatch[0], 10);
        }
        // If no number is found, return 0 or handle it as needed
        return 0;
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        if (posthog.__loaded) {
            posthog.capture('Campaign Step Completed', {
                distinct_id: profile === null || profile === void 0 ? void 0 : profile.id,
                step: 4,
            });
        }
        handleNext();
    };
    var calculateWeekNumber = function (startDate, durationWeeks) {
        var now = new Date();
        var endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + durationWeeks * 7);
        // Calculate the difference in milliseconds
        var daysBetween = Math.ceil((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
        // Calculate the week number
        return Math.ceil(daysBetween / 7);
    };
    var formatMonthDayYear = function (date) {
        var options = {
            // month: "short",
            day: 'numeric',
        };
        return date.toLocaleDateString('en-US', options);
    };
    var formatMonth = function (date) {
        var options = {
            month: 'short',
        };
        return date.toLocaleDateString('en-US', options);
    };
    var formatFullDate = function (date) {
        var options = { year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };
    var displayPeriod = function (startDate, duration) {
        // if (status === "DRAFT") return "";
        var _a = startDate.split('/').map(Number), month = _a[0], day = _a[1], year = _a[2];
        var start = new Date(year, month - 1, day);
        // Parse the duration
        var durationParts = duration.split(' ');
        var durationValue = Number(durationParts[0]);
        var durationUnit = durationParts[1].toLowerCase(); // e.g., "weeks"
        // Calculate the end date
        var end;
        if (durationUnit === 'weeks' || durationUnit === 'week') {
            end = new Date(start);
            end.setDate(start.getDate() + durationValue * 7); // Add duration in days
        }
        else {
            throw new Error("Unsupported duration unit: ".concat(durationUnit));
        }
        var now = new Date();
        // Calculate week number
        var isCompleted = now >= end;
        var weekNumber = isCompleted ? durationValue : calculateWeekNumber(start, durationValue);
        // const weekNumber = Math.ceil((start.getDate() - 1 + durationValue * 7) / 7);
        var startMonth = formatMonth(start);
        var startDayMonth = formatMonthDayYear(start);
        var endDayMonth = formatMonthDayYear(end);
        var startYear = formatFullDate(start);
        var endYear = formatFullDate(end);
        // Format date range
        var dateRange;
        if (startYear === endYear) {
            if (start.getMonth() === end.getMonth()) {
                dateRange = "".concat(startMonth, " ").concat(startDayMonth, " - ").concat(endDayMonth, ", ").concat(startYear);
            }
            else {
                dateRange = "".concat(startMonth, " ").concat(startDayMonth, " - ").concat(endDayMonth, ", ").concat(startYear);
            }
        }
        else {
            dateRange = "".concat(startMonth, " ").concat(startDayMonth, ", ").concat(startYear, " - ").concat(endDayMonth, ", ").concat(endYear);
        }
        if (isCompleted || weekNumber <= 0) {
            return "".concat(duration, ", ").concat(dateRange);
        }
        else {
            return "Week ".concat(weekNumber, " of ").concat(durationValue, ", ").concat(dateRange);
        }
    };
    useEffect(function () {
        var date = value === null || value === void 0 ? void 0 : value.format('MM/DD/YYYY');
        if (date === undefined)
            return;
        setCampaignInfo(function (prev) { return (__assign(__assign({}, prev), { startDate: date })); });
        if (setTiming) {
            var info = displayPeriod(date, duration);
            setTiming(info);
        }
    }, [value]);
    useEffect(function () {
        var durationNum = convertToNumber(duration);
        setCampaignInfo(function (prev) { return (__assign(__assign({}, prev), { duration: duration, durationNum: durationNum })); });
        if (setTiming) {
            var date = value === null || value === void 0 ? void 0 : value.format('MM/DD/YYYY');
            if (date === undefined)
                return;
            var info = displayPeriod(date, duration);
            setTiming(info);
        }
    }, [duration]);
    useEffect(function () {
        var frequency = convertToNumber(postingFrequency);
        setCampaignInfo(function (prev) { return (__assign(__assign({}, prev), { postingFrequency: postingFrequency, frequency: frequency })); });
    }, [postingFrequency]);
    useEffect(function () {
        setCampaignInfo(function (prev) { return (__assign(__assign({}, prev), { deliveryDay: deliveryDay })); });
    }, [deliveryDay]);
    useEffect(function () {
        if (campaignInfo.startDate === undefined)
            return;
        var oldDate = dayjs(campaignInfo.startDate);
        setValue(oldDate);
    }, []);
    var handleDatePicker = function (e) {
        e.stopPropagation();
    };
    return (_jsxs(_Fragment, { children: [_jsx(FormsContainer, { children: _jsxs("form", { id: "timing_form", onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-5", children: [_jsx("label", { title: "email", className: "block mb-2 text-xl font-medium text-gray-900", children: "Campaign Start Date" }), _jsx("div", { className: "relative", onClick: handleDatePicker, children: _jsx(LocalizationProvider, { dateAdapter: AdapterDayjs, children: _jsx(DatePicker, { sx: {
                                                '.MuiOutlinedInput-root': {
                                                    height: '41px',
                                                    margin: 0,
                                                    borderRadius: '8px',
                                                },
                                            }, 
                                            // open={open}
                                            className: "w-full", value: value, onChange: function (newValue) { return setValue(newValue); }, shouldDisableDate: function (date) {
                                                // Disable dates before today
                                                return dayjs(date).isBefore(dayjs().add(1, 'day'), 'day');
                                            } }) }) })] }), _jsxs("div", { className: "mb-5", children: [_jsx("label", { title: "email", className: "block mb-2 text-xl font-medium text-gray-900", children: "Campaign Duration" }), _jsx(Dropdown, { currentValue: duration, options: ['1 Week', '2 Weeks', '3 Weeks', '4 Weeks', '5 Weeks', '6 Weeks'], onUpdateContext: function (value) { return setDuration(value); }, className: "w-full" }), _jsxs("div", { className: "flex items-center gap-4 bg-[#EBF5FF] py-1 px-1 rounded-md my-2", children: [_jsx("img", { src: "/sparkles.svg", alt: "location", className: "w-5 h-5" }), _jsx("p", { className: "text-sm text-[#1C64F2]", children: "Recommendation: min 3 weeks" })] })] }), _jsxs("div", { className: "mb-5", children: [_jsx("label", { title: "email", className: "block mb-2 text-xl font-medium text-gray-900", children: "Date Posting Frequency" }), _jsx(Dropdown, { currentValue: postingFrequency, options: [
                                        '1 post per day',
                                        '2 posts per day',
                                        '3 posts per day',
                                        '4 posts per day',
                                        '5 posts per day',
                                        '6 posts per day',
                                    ], onUpdateContext: function (value) { return setPostingFrequency(value); }, className: "w-full" }), _jsxs("div", { className: "flex items-center gap-4 bg-[#EBF5FF] py-1 px-1 rounded-md my-2", children: [_jsx("img", { src: "/sparkles.svg", alt: "location", className: "w-5 h-5" }), _jsx("p", { className: "text-sm text-[#1C64F2]", children: "Recommendation: min 3 posts per day" })] })] }), _jsxs("div", { className: "mb-5", children: [_jsx("label", { title: "email", className: "block mb-2 text-xl font-medium text-gray-900", children: "Content Delivery Day" }), _jsx("p", { className: "my-2 text-sm text-[#111928]", children: "We deliver content in weekly batches" }), _jsx(Dropdown, { currentValue: deliveryDay, options: [
                                        'Monday',
                                        'Tuesday',
                                        'Wednesday',
                                        'Thursday',
                                        'Friday',
                                        'Saturday',
                                        'Sunday',
                                    ], onUpdateContext: function (value) { return setDeliveryDay(value); }, className: "w-full" })] })] }) }), !review && (_jsxs("div", { className: "flex justify-between mb-10 w-full", children: [_jsx(BackButton, { onClick: function () { return handleBack(); } }), _jsx(NextButton, { text: "Next", formId: "timing_form" })] }))] }));
};
export default TimingForm;
//# sourceMappingURL=TimingForm.js.map