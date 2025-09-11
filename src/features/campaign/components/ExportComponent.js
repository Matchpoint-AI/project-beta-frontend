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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { useParams } from 'react-router-dom';
import { getServiceURL } from '../../../helpers/getServiceURL';
import LoadingModal from '../ExportLoading';
import { createImageThumbnailsPDF, createWordDocument, fetchAndCreatePDF, organizeAndSavePosts, } from '../../../helpers/exportUtils';
import WeekSelector from './WeekSelector';
import ExportButton from './ExportButton';
import ErrorDisplay from '../../../shared/components/feedback/ErrorDisplay';
// import ApproveButton from '../ApproveButton';
import ErrorToast from '../../../shared/components/feedback/ErrorToast';
import ExportPopup from './ExportPopup';
import { capitalizeFirstLetterOfEachWord, structureData } from '../../../helpers/formatters';
import posthog from '../../../helpers/posthog';
var ExportComponent = function (_a) {
    var _b, _c;
    var campaign = _a.campaign;
    var _d = useState([]), currentValues = _d[0], setCurrentValues = _d[1];
    var _e = useState([]), options = _e[0], setOptions = _e[1];
    // const [weeksData, setWeeksData] = useState([]);
    var _f = useState(''), error = _f[0], setError = _f[1];
    var _g = useState(false), double = _g[0], setDouble = _g[1];
    var _h = useState(false), _loading = _h[0], _setLoading = _h[1];
    var _j = useState(false), errorSaving = _j[0], setErrorSaving = _j[1];
    var _k = useState(''), errorText = _k[0], setErrorText = _k[1];
    // const [contentId, setContentId] = useState("");
    var _l = useState(false), success = _l[0], setSuccess = _l[1];
    var _m = useState(false), loadingModalOpen = _m[0], setLoadingModalOpen = _m[1];
    var _o = useState(false), showPopup = _o[0], setShowPopup = _o[1]; // State for popup
    var _p = useState([
        {
            label: 'Campaign Brief/Brand Profile PDF',
            loading: true,
            complete: false,
        },
        { label: 'Image Thumbnail PDF', loading: false, complete: false },
        { label: 'Copy Word Document', loading: false, complete: false },
        { label: 'Content Folder', loading: false, complete: false },
    ]), steps = _p[0], setSteps = _p[1];
    var profile = useAuth().profile;
    var id = useParams().id;
    var endpointUrl = getServiceURL('content-gen');
    useEffect(function () {
        if (!campaign)
            return;
        var calculateWeeks = function () {
            var _a, _b;
            var numberOfWeeks = (_a = campaign === null || campaign === void 0 ? void 0 : campaign.campaign_data) === null || _a === void 0 ? void 0 : _a.campaign_variables.durationNum;
            var startDate = new Date(((_b = campaign === null || campaign === void 0 ? void 0 : campaign.campaign_data) === null || _b === void 0 ? void 0 : _b.campaign_variables.start_date) || ''); // Assuming start_date is in a valid date format
            var today = new Date();
            var daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)); // Convert time difference to days
            var options = [];
            if (daysSinceStart < 0) {
                // If the current date is earlier than the start date, show only Week 1
                options = ['Week 1'];
            }
            else {
                var currentWeek_1 = Math.floor(daysSinceStart / 7) + 1;
                options = Array.from({ length: numberOfWeeks !== null && numberOfWeeks !== void 0 ? numberOfWeeks : 0 }, function (_, i) {
                    var weekNumber = i + 1;
                    // Include only past weeks and the next upcoming week with one day left
                    if (weekNumber <= currentWeek_1 ||
                        (weekNumber === currentWeek_1 + 1 && daysSinceStart % 7 >= 6)) {
                        return "Week ".concat(weekNumber);
                    }
                    return null;
                }).filter(function (option) { return option !== null; }); // Remove null values
            }
            setOptions(options);
        };
        calculateWeeks();
    }, [campaign]);
    var updateStep = function (index, status) {
        setSteps(function (prev) { return prev.map(function (step, i) { return (i === index ? __assign(__assign({}, step), status) : step); }); });
    };
    var emptyLoading = function () {
        setSteps(function (prevSteps) {
            return prevSteps.map(function (step) { return (__assign(__assign({}, step), { loading: false, complete: false })); });
        });
    };
    var fetchWeeksData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var params, response, data, data2, _error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    params = new URLSearchParams({
                        campaign_id: id,
                    });
                    return [4 /*yield*/, fetch("".concat(endpointUrl, "/api/v1/get-content?").concat(params.toString()), {
                            method: 'GET',
                            headers: {
                                Authorization: "Bearer ".concat(profile === null || profile === void 0 ? void 0 : profile.token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error('Failed to fetch data');
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (data.length === 0 || data.arr[0].length === 0)
                        return [2 /*return*/];
                    data2 = structureData(data.arr);
                    return [2 /*return*/, { weeks: data2, contentId: data.id }];
                case 3:
                    _error_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var generateZip = function () { return __awaiter(void 0, void 0, void 0, function () {
        var zip, bigFolder, fetchedData, weeksData, contentId, data, brandProfilePDF, imageThumbnailsPDF, wordDoc, content, endpointUrl_1, response, _error_2, _error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    zip = new JSZip();
                    bigFolder = zip.folder("Campaign_data");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 12, , 13]);
                    return [4 /*yield*/, fetchWeeksData()];
                case 2:
                    fetchedData = _a.sent();
                    if (!fetchedData) {
                        throw new Error('No data fetched');
                    }
                    weeksData = fetchedData.weeks, contentId = fetchedData.contentId;
                    data = weeksData
                        .filter(function (_, weekIndex) { return currentValues.includes("Week ".concat(weekIndex + 1)); })
                        .map(function (week) {
                        // Map through each day in the week
                        return week
                            .map(function (day) {
                            // Filter posts within the day that are approved
                            var approvedPosts = day.posts.filter(function (post) { return post.approved === true; });
                            // Only include the day if it has approved posts
                            if (approvedPosts.length > 0) {
                                return __assign(__assign({}, day), { posts: approvedPosts });
                            }
                            return null; // Mark day for exclusion if no posts are approved
                        })
                            .filter(function (day) { return day !== null; }); // Remove days with no approved posts
                    })
                        .filter(function (week) { return week.length > 0; });
                    if (data.length === 0)
                        throw new Error('Failed to fetch data');
                    updateStep(0, { loading: true });
                    return [4 /*yield*/, fetchAndCreatePDF(id, getServiceURL('data'), (profile === null || profile === void 0 ? void 0 : profile.token) || '')];
                case 3:
                    brandProfilePDF = _a.sent();
                    if (brandProfilePDF)
                        bigFolder === null || bigFolder === void 0 ? void 0 : bigFolder.file('BrandProfile_CampaignBrief.pdf', brandProfilePDF);
                    updateStep(0, { loading: false, complete: true });
                    updateStep(1, { loading: true });
                    return [4 /*yield*/, createImageThumbnailsPDF(data, currentValues)];
                case 4:
                    imageThumbnailsPDF = _a.sent();
                    bigFolder === null || bigFolder === void 0 ? void 0 : bigFolder.file('ImageThumbnails.pdf', imageThumbnailsPDF);
                    updateStep(1, { loading: false, complete: true });
                    updateStep(2, { loading: true });
                    return [4 /*yield*/, createWordDocument(data, currentValues)];
                case 5:
                    wordDoc = _a.sent();
                    bigFolder === null || bigFolder === void 0 ? void 0 : bigFolder.file('CopyContent.docx', wordDoc);
                    updateStep(2, { loading: false, complete: true });
                    updateStep(3, { loading: true });
                    return [4 /*yield*/, organizeAndSavePosts(data, bigFolder, currentValues)];
                case 6:
                    _a.sent();
                    updateStep(3, { loading: false, complete: true });
                    return [4 /*yield*/, zip.generateAsync({ type: 'blob' })];
                case 7:
                    content = _a.sent();
                    saveAs(content, 'exported_content.zip');
                    emptyLoading();
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    endpointUrl_1 = getServiceURL('content-gen');
                    return [4 /*yield*/, fetch("".concat(endpointUrl_1, "/api/v1/contentgen/track-export"), {
                            method: 'POST',
                            headers: {
                                Authorization: "Bearer ".concat(profile === null || profile === void 0 ? void 0 : profile.token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                campaign_id: id,
                            }),
                        })];
                case 9:
                    response = _a.sent();
                    if (!response.ok) {
                        // Error handled silently
                    }
                    return [3 /*break*/, 11];
                case 10:
                    _error_2 = _a.sent();
                    return [3 /*break*/, 11];
                case 11:
                    if (posthog.__loaded) {
                        posthog.capture('Content Exported', {
                            distinct_id: (profile === null || profile === void 0 ? void 0 : profile.id) || '',
                            content_id: contentId,
                        });
                    }
                    setShowPopup(true); // Show the popup after successful export
                    return [3 /*break*/, 13];
                case 12:
                    _error_3 = _a.sent();
                    setError('An error occurred during export.');
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    }); };
    var handleExport = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setError('');
                    if (currentValues.length === 0) {
                        setError('Specify Week Content To Be Exported');
                        return [2 /*return*/];
                    }
                    // const result = await checkApproved();
                    // if (result === true) return;
                    setDouble(true);
                    setLoadingModalOpen(true);
                    return [4 /*yield*/, generateZip()];
                case 1:
                    _a.sent();
                    setDouble(false);
                    setLoadingModalOpen(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var _handleApproveAll = function () { return __awaiter(void 0, void 0, void 0, function () {
        var transformedWeeks, endpointUrl, response, _data, _error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setError('');
                    if (currentValues.length === 0) {
                        setError('Specify Week Content To Be Approved');
                        return [2 /*return*/];
                    }
                    transformedWeeks = currentValues.map(function (week) { return week.toLowerCase().replace(' ', '_'); });
                    setLoading(true);
                    endpointUrl = getServiceURL('data');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("".concat(endpointUrl, "/api/v1/approve-all"), {
                            method: 'POST',
                            headers: {
                                Authorization: "Bearer ".concat(profile === null || profile === void 0 ? void 0 : profile.token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                campaign_id: id,
                                weeks: transformedWeeks, // Send weeks to approve
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Failed to approve all posts.');
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    _data = _a.sent();
                    setSuccess(true);
                    setErrorText('You Can Export The Specified Week');
                    setErrorSaving(true); // Display error toast
                    return [3 /*break*/, 6];
                case 4:
                    _error_4 = _a.sent();
                    setSuccess(false);
                    setErrorSaving(true); // Display error toast
                    setErrorText('An Error Occurred, Try Again Later!!');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx("div", { className: "flex flex-col justify-center w-full items-center my-32 gap-6", children: _jsxs(_Fragment, { children: [_jsx("div", { className: "flex justify-center", children: _jsxs("div", { className: "w-[393px] p-[30px] bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-5 inline-flex", children: [_jsx("h1", { className: "self-stretch text-center text-gray-900 text-xl font-semibold", children: "Export Content" }), _jsx(WeekSelector, { options: options, currentValues: currentValues, setCurrentValues: setCurrentValues }), _jsx("div", { className: "w-full flex flex-row justify-evenly items-center", children: _jsx(ExportButton, { double: double, handleExport: handleExport }) }), _jsx(ErrorDisplay, { error: error })] }) }), _jsx(LoadingModal, { steps: steps, isOpen: loadingModalOpen }), _jsx(ErrorToast, { message: errorText, open: errorSaving, success: success, onClose: function () { return setErrorSaving(false); } }), showPopup && (_jsx(ExportPopup, { campaignName: capitalizeFirstLetterOfEachWord(((_c = (_b = campaign === null || campaign === void 0 ? void 0 : campaign.campaign_data) === null || _b === void 0 ? void 0 : _b.campaign_variables) === null || _c === void 0 ? void 0 : _c.name) || ''), onClose: function () { return setShowPopup(false); } }))] }) }));
};
export default ExportComponent;
//# sourceMappingURL=ExportComponent.js.map