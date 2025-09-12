import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import { Link } from "react-router-dom";
import { MdCalendarToday } from 'react-icons/md';
import { GoClock } from 'react-icons/go';
import { FaRegBuilding } from 'react-icons/fa6';
// import CampaignReviewButton from '../dashboard/CampaignReviewButton';
import { FaExternalLinkAlt } from 'react-icons/fa';
var CampaignHeader = function (_a) {
    var title = _a.title, service = _a.service, timeFrame = _a.timeFrame, postingSchdule = _a.postingSchdule, handleNavigate = _a.handleNavigate;
    var Description = [
        '',
        'Your campaign content is here!  Quickly review thumbnails for each day below or click on a day to review, edit or approve all posts.',
        '',
        'Let’s get your campaign content out to your audience. Select the range to download and click export below.',
    ];
    return (_jsx("div", { className: "flex flex-col lg:flex-row justify-between", children: _jsxs("div", { className: "flex flex-col justify-between gap-3", children: [_jsxs("h1", { className: "flex items-center gap-2  hover:cursor-pointer\n            text-purple-700 text-2xl font-semibold leading-9 underline", onClick: handleNavigate, children: [title, ' ', _jsx("span", { children: _jsx(FaExternalLinkAlt, { className: "w-4" }) })] }), _jsx("p", { className: "text-sm my-1", children: Description[1] }), _jsxs("div", { children: [_jsxs("div", { className: "flex flex-row gap-2 items-center", children: [_jsx(MdCalendarToday, {}), _jsxs("span", { className: "text-sm my-1 font-normal text-purple-700 underline", children: ["Campaign Date: ", timeFrame] })] }), _jsxs("div", { className: "flex flex-row gap-2 items-center", children: [_jsx(GoClock, {}), _jsxs("span", { className: "text-sm my-1 font-normal", children: ["Posting Schedule: ", postingSchdule] })] }), _jsxs("div", { className: "flex flex-row gap-2 items-center", children: [_jsx(FaRegBuilding, {}), _jsxs("span", { className: "text-sm my-1 font-normal", children: ["Service: ", service] })] })] })] }) }));
};
export default CampaignHeader;
//# sourceMappingURL=CampaignHeader.js.map