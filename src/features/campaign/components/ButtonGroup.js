import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import CampaignStats from "./CampaignStats";
// import CampaignReviewButton from "./CampaignReviewButton";
// import { useAuth } from "../../../features/auth/context/AuthContext";
// import { getServiceURL } from "../../../helpers/getServiceURL";
import InstaConnect from '../../../shared/components/buttons/InstaConnect';
import TabItems from './TabItems';
// import CardStats from "./CardStats";
import NewCardStats from '../dashboard/NewCardStats';
var ButtonGroup = function (_a) {
    var campaign = _a.campaign, currentTab = _a.currentTab, setCurrentTab = _a.setCurrentTab, setApprovePopup = _a.setApprovePopup, stats = _a.stats, onApprove = _a.onApprove;
    // const { profile } = useAuth();
    var id = useParams().id;
    // const endpointUrl = getServiceURL("data");
    // const [weeksData, setWeeksData] = useState([]);
    // const [hidden, setHidden] = useState(true);
    var _b = useState(''), startDate = _b[0], setStartDate = _b[1];
    var _c = useState(0), duration = _c[0], setDuration = _c[1];
    useEffect(function () {
        var _a, _b, _c, _d;
        if (campaign !== undefined) {
            setStartDate(((_b = (_a = campaign === null || campaign === void 0 ? void 0 : campaign.campaign_data) === null || _a === void 0 ? void 0 : _a.campaign_variables) === null || _b === void 0 ? void 0 : _b.start_date) || '');
            setDuration(((_d = (_c = campaign === null || campaign === void 0 ? void 0 : campaign.campaign_data) === null || _c === void 0 ? void 0 : _c.campaign_variables) === null || _d === void 0 ? void 0 : _d.durationNum) || 0);
        }
    }, [campaign]);
    return (_jsxs("div", { className: "flex flex-col gap-7", children: [_jsx(NewCardStats, { id: id, stats: stats }), _jsxs("div", { className: "flex flex-col-reverse md:flex-row gap-4 justify-between w-full items-end md:items-center", children: [_jsx(TabItems, { currentPage: currentTab, onPageChange: setCurrentTab, setApprovePopup: setApprovePopup, onApprove: onApprove }), _jsx(InstaConnect, { publish: true, stats: stats, startDate: startDate, duration: duration })] })] }));
};
export default ButtonGroup;
//# sourceMappingURL=ButtonGroup.js.map