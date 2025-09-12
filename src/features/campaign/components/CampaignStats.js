import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
var CampaignStats = function (_a) {
    var weeksData = _a.weeksData;
    // const { profile } = useAuth();
    var _b = useState(0), totalContent = _b[0], setTotalContent = _b[1];
    var _c = useState(0), approved = _c[0], setApproved = _c[1];
    var _d = useState(0), readyForReview = _d[0], setReadyForReview = _d[1];
    // const [generating, setGenerating] = useState(0);
    // const { id } = useParams();
    // const endpointUrl = getServiceURL("data");
    // const { campaignInfo }: any = useContext(CampaignContext);
    var _e = useState(0), weekIndex = _e[0], setWeekIndex = _e[1]; // Track the current week
    // const [weeksData, setWeeksData] = useState([]);
    // const [hidden, setHidden] = useState(false);
    var calculateWeekStats = function (weekData) {
        var totalPosts = 0;
        var approvedPosts = 0;
        weekData[weekIndex].posts.forEach(function (post) {
            totalPosts++;
            if (post.approved)
                approvedPosts++;
        });
        var readyForReviewPosts = totalPosts - approvedPosts;
        setTotalContent(totalPosts);
        setApproved(approvedPosts);
        setReadyForReview(readyForReviewPosts);
    };
    useEffect(function () {
        if (weeksData !== undefined && weeksData.length > 0) {
            calculateWeekStats(weeksData[weekIndex]);
        }
    }, [weekIndex]);
    return (_jsxs("div", { className: "flex self-start flex-col gap-1 mt-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("select", { id: "week-selector", className: "border rounded px-2 py-1 text-base font-medium bg-white text-gray-700", value: weekIndex, onChange: function (e) { return setWeekIndex(parseInt(e.target.value)); }, children: weeksData.map(function (_, index) { return (_jsxs("option", { value: index, children: ["Week ", index + 1] }, index)); }) }), "Content Status"] }), _jsxs("ul", { className: "list-disc list-inside text-gray-700", children: [_jsxs("li", { children: ["Ready for Review: ", readyForReview, " out of ", totalContent] }), _jsxs("li", { children: ["Approved: ", approved, " out of ", totalContent] })] })] }));
};
export default CampaignStats;
//# sourceMappingURL=CampaignStats.js.map