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
import { jsx as _jsx } from "react/jsx-runtime";
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignContext } from '../../../context/CampaignContext';
import { useAuth } from '../../auth/context/AuthContext';
import handleNavigate from '../../../helpers/handleNavigate';
export default function CampaignReviewButton(_a) {
    var campaign = _a.campaign;
    var setCampaignInfo = useContext(CampaignContext).setCampaignInfo;
    var profile = useAuth().profile;
    var navigate = useNavigate();
    var handleCampaignBrief = function () {
        var _a, _b;
        var data = (_a = campaign === null || campaign === void 0 ? void 0 : campaign.campaign_data) === null || _a === void 0 ? void 0 : _a.campaign_variables;
        setCampaignInfo(function (prev) { return (__assign(__assign({}, prev), { summary: data === null || data === void 0 ? void 0 : data.summary, name: data === null || data === void 0 ? void 0 : data.name, product: data === null || data === void 0 ? void 0 : data.product_service, audienceRace: data === null || data === void 0 ? void 0 : data.audience_ethnicity, audienceEmotion: data === null || data === void 0 ? void 0 : data.emotion, audienceInterests: data === null || data === void 0 ? void 0 : data.audience_interests, productDescription: data === null || data === void 0 ? void 0 : data.product_service_description, purpose: data === null || data === void 0 ? void 0 : data.purpose_topic, locations: data === null || data === void 0 ? void 0 : data.scene, currentStep: 5, product_features: data === null || data === void 0 ? void 0 : data.key_feature, purposeAbout: data === null || data === void 0 ? void 0 : data.purpose, audienceGender: data === null || data === void 0 ? void 0 : data.audience_gender, audienceAgeRange: data === null || data === void 0 ? void 0 : data.audience_age, startDate: data === null || data === void 0 ? void 0 : data.start_date, duration: data === null || data === void 0 ? void 0 : data.duration, durationNum: data === null || data === void 0 ? void 0 : data.durationNum, frequency: data === null || data === void 0 ? void 0 : data.frequency, postingFrequency: data === null || data === void 0 ? void 0 : data.postingFrequency, deliveryDay: data === null || data === void 0 ? void 0 : data.deliveryDay, campaign_id: campaign === null || campaign === void 0 ? void 0 : campaign.campaign_id, campaign_brief: true, created_at: campaign === null || campaign === void 0 ? void 0 : campaign.timestamp })); });
        handleNavigate((_b = profile === null || profile === void 0 ? void 0 : profile.id) !== null && _b !== void 0 ? _b : '', '/campaign', navigate);
    };
    return (_jsx("button", { onClick: handleCampaignBrief, className: "text-[#5145CD] border self-end border-[#5145CD] text-sm px-2 py-1 rounded-md mr-2  h-9", children: "Campaign Brief" }));
}
//# sourceMappingURL=CampaignReviewButton.js.map