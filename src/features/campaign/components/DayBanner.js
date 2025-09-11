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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CircularProgress } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import SocialMediaPost from './SocialMediaPost';
import { getServiceURL } from '../../../helpers/getServiceURL';
import moment from 'moment-timezone';
import { getPostingScheduleArray } from '../../../helpers/calculateTiming';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
var DayBanner = function (_a) {
    // Remove debugging logs
    var index = _a.index, startDate = _a.startDate, currentPage = _a.currentPage, content = _a.content, generatedContentId = _a.generatedContentId, handleApprovalUpdate = _a.handleApprovalUpdate, setOpen = _a.setOpen, brandName = _a.brandName, updataImage = _a.updataImage;
    var postingTimes = getPostingScheduleArray(content.posts.length);
    var _b = useState(false), fullLoading = _b[0], setFullLoading = _b[1];
    var profile = useAuth().profile;
    var _c = useState(0), startIndex = _c[0], setStartIndex = _c[1];
    var scrollContainerRef = useRef(null);
    var _d = useState(content.posts.map(function (post) {
        return post.text_versions ? post.text_versions.findIndex(function (text) { return text === post.text; }) + 1 : 1;
    })), selectedImages = _d[0], setSelectedImages = _d[1];
    var _e = useState(1), maxVisiblePosts = _e[0], setMaxVisiblePosts = _e[1];
    var showNavigation = content.posts.length > maxVisiblePosts;
    var canScrollLeft = startIndex > 0;
    var canScrollRight = startIndex + maxVisiblePosts < content.posts.length;
    // 2) On mount and on resize, recalculate maxVisiblePosts
    useEffect(function () {
        function handleResize() {
            var width = window.innerWidth;
            if (width < 768) {
                // sm breakpoint
                setMaxVisiblePosts(1);
            }
            else if (width < 1024) {
                // md breakpoint
                setMaxVisiblePosts(2);
            }
            else {
                // lg and above
                setMaxVisiblePosts(3);
            }
        }
        window.addEventListener('resize', handleResize);
        handleResize(); // Call once on mount
        return function () { return window.removeEventListener('resize', handleResize); };
    }, []);
    // Move to the next post set
    var handleNext = function () {
        if (startIndex + maxVisiblePosts < content.posts.length) {
            setStartIndex(startIndex + 1);
        }
    };
    // Move to the previous post set
    var handlePrev = function () {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };
    var formatDate = function (startDate, daysToAdd) {
        if (startDate === '')
            return '';
        var _a = startDate.split('/').map(Number), month = _a[0], day = _a[1], year = _a[2];
        var date = new Date(year, month - 1, day + daysToAdd);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };
    // Scroll to the current visible posts when startIndex changes
    useEffect(function () {
        var _a;
        if (scrollContainerRef === null || scrollContainerRef === void 0 ? void 0 : scrollContainerRef.current) {
            var postWidth = scrollContainerRef.current.scrollWidth / content.posts.length;
            (_a = scrollContainerRef.current) === null || _a === void 0 ? void 0 : _a.scrollTo({
                left: startIndex * postWidth,
                behavior: 'smooth',
            });
        }
    }, [startIndex, content.posts.length]);
    var validateTimezone = function (timezone) {
        return moment.tz.zone(timezone) !== null;
    };
    var handleApprove = function (week, day, content) { return __awaiter(void 0, void 0, void 0, function () {
        var endpointUrl, userTimezone, validTimezone, payload, response, errorData, _error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpointUrl = getServiceURL('content-gen');
                    userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    validTimezone = validateTimezone(userTimezone) ? userTimezone : 'UTC';
                    setFullLoading(true);
                    payload = {
                        campaign_content_id: generatedContentId,
                        week: week,
                        day: day + 1,
                        approved: true,
                        timezone: validTimezone,
                        posts: content.posts.reduce(function (acc, item, index) {
                            var postKey = "post_".concat(index + 1);
                            var selectedIndex = (selectedImages[index] || 1) - 1;
                            acc[postKey] = {
                                selected_image: item.image_url[selectedIndex],
                                text: item.text,
                            };
                            return acc;
                        }, {}),
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, fetch(endpointUrl + "/api/v1/contentgen/approve", {
                            method: 'POST',
                            headers: {
                                Authorization: "Bearer ".concat(profile === null || profile === void 0 ? void 0 : profile.token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(payload),
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    errorData = _a.sent();
                    throw new Error(errorData.detail || 'Failed to fetch data');
                case 4:
                    // setIsApproved(true); // Mark as approved
                    // onApprovalUpdate();
                    handleApprovalUpdate(currentPage - 1, day, null, true);
                    return [3 /*break*/, 7];
                case 5:
                    _error_1 = _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    setFullLoading(false); // Stop loading spinner
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { 
        // key={index}
        className: "bg-[#FFFFFF] border border-[#E5E7EB] flex flex-col gap-3 shadow-md p-6 w-full rounded-md mt-0 ", children: [_jsxs("div", { className: "flex flex-row justify-between items-center", children: [_jsxs("p", { className: "text-[#1F2937] font-semibold text-lg", children: ["Day ", index + 1, " |", ' ', _jsx("span", { className: "text-[#1F2937] font-medium text-lg", children: formatDate(startDate, index) })] }), content.approved === true ? (_jsx("button", { 
                        // onClick={() => handleApprove(currentPage, index, content)}
                        disabled: true, className: " text-[#356751] font-semibold text-base text-center border-[1px] border-[#046C4E] bg-[#DEF7EC] px-2 py-2 rounded-md", children: "Approved" })) : (_jsx("button", { onClick: function () { return handleApprove(currentPage, index, content); }, 
                        // disabled={true}
                        className: "text-[#8E4B10] font-semibold text-base text-center border-[1px]  border-[#8E4B10] bg-[#FDF6B2] hover:bg-[#fdf49f]  md:px-2 md:py-2 rounded-md", children: fullLoading ? (_jsx(CircularProgress, { sx: { color: '#6C2BD9' }, size: 25, thickness: 5 })) : ('Approve Full Day') }))] }), _jsxs("div", { className: "relative", children: [showNavigation && (_jsx("button", { onClick: handlePrev, disabled: !canScrollLeft, className: "left-0 top-1/2 -translate-y-1/2 z-10 bg-white absolute rounded-full shadow-md p-2 ".concat(canScrollLeft
                            ? 'text-[#6C2BD9] hover:bg-gray-100'
                            : 'text-gray-300 cursor-not-allowed'), style: { transform: 'translate(-50%, -50%)' }, children: _jsx(FaArrowLeft, { size: "20px" }) })), _jsx("div", { ref: scrollContainerRef, className: "overflow-x-auto hide-scrollbar mx-auto w-[310px] md:w-[580px] lg:w-[860px] xl:w-[1100px] 2xl:w-[1710px]", style: { scrollbarWidth: 'none', msOverflowStyle: 'none' }, children: _jsx("div", { className: "w-full h-full flex flex-row gap-0 md:gap-4 lg:gap-2 xl:gap-4 ", children: content.posts.map(function (post, postIndex) {
                                var postTime = postingTimes[postIndex] || 'Unscheduled';
                                return (_jsx("div", { className: "w-full md:w-[calc(33.333%-1rem)] min-w-[280px] mx-auto flex-shrink-0", children: _jsx(SocialMediaPost, { day: index, postIndex: postIndex + 1, setOpen: setOpen, content: post, brandName: brandName, id: generatedContentId, week: currentPage, postingTime: postTime, updataImage: updataImage, selectedImages: selectedImages, setSelectedImages: setSelectedImages, onApprovalUpdate: function (postIndexx, isApproved) {
                                            return handleApprovalUpdate(currentPage - 1, index, postIndex, isApproved);
                                        } }, postIndex) }, postIndex));
                            }) }) }), showNavigation && (_jsx("button", { onClick: handleNext, disabled: !canScrollRight, className: "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 ".concat(canScrollRight
                            ? 'text-[#6C2BD9] hover:bg-gray-100'
                            : 'text-gray-300 cursor-not-allowed'), style: { transform: 'translate(50%, -50%)' }, children: _jsx(FaArrowRight, { size: "20px" }) }))] })] }));
};
export default DayBanner;
//# sourceMappingURL=DayBanner.js.map