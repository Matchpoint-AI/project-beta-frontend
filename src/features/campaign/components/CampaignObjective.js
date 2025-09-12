import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext } from 'react';
import { CampaignContext } from '../context/CampaignContext';
var CampaignObjective = function (_a) {
    var title = _a.title, objective = _a.objective, onEdit = _a.onEdit;
    var campaignInfo = useContext(CampaignContext).campaignInfo;
    return (_jsxs("div", { className: "flex items-center gap-4 mb-2 p-4 bg-gray-100 rounded-md", children: [_jsx("div", { className: "flex items-center mb-2", children: _jsx("span", { className: "mr-2 text-purple-600 bg-white w-10 h-10 rounded-full flex justify-center items-center", children: _jsx("img", { src: "/bulb.svg", alt: "sparkles", className: "w-5 h-5" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold", children: title }), _jsx("p", { className: "mb-2 text-xs", children: objective })] }), _jsx("button", { onClick: onEdit, className: "w-12 h-5 text-white bg-[#5145CD] text-xs p-2 flex justify-center items-center rounded-sm hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-[#5145CD] focus:ring-opacity-50", children: campaignInfo.campaign_brief !== true ? 'EDIT' : 'VIEW' })] }));
};
export default CampaignObjective;
//# sourceMappingURL=CampaignObjective.js.map