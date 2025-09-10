import { jsx as _jsx } from 'react/jsx-runtime';
import ContentLibrary from './ContentLibrary';
import ExportComponent from './ExportComponent';
import CalendarCampaign from './CalendarCampaign';
import SceneMixPlanner from './SceneMixPlanner';
var TabWrapper = function (_a) {
  var currentTab = _a.currentTab,
    campaign = _a.campaign,
    setStats = _a.setStats;
  if (currentTab === '1') {
    return _jsx(ContentLibrary, { campaign: campaign, setStats: setStats });
  } else if (currentTab === '2') {
    return _jsx(CalendarCampaign, { campaign: campaign });
  } else if (currentTab === '3') {
    return _jsx(ExportComponent, { campaign: campaign });
  } else if (currentTab === '4') {
    // Scene Mix Planner tab
    return _jsx(SceneMixPlanner, {
      campaignId: campaign.campaign_id,
      campaignName: campaign.campaign_data.campaign_variables.name,
      weeks: campaign.campaign_data.campaign_variables.durationNum,
      postsPerWeek: campaign.campaign_data.campaign_variables.frequency * 7,
    });
  } else {
    return _jsx('div', { children: _jsx('h1', { children: 'Invalid Tab' }) });
  }
};
export default TabWrapper;
//# sourceMappingURL=TabWrapper.js.map
