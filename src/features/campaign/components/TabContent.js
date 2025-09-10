import { jsx as _jsx } from 'react/jsx-runtime';
// import TabItems from "./TabItems";
import TabWrapper from './TabWrapper';
var TabContent = function (_a) {
  var currentTab = _a.currentTab,
    campaign = _a.campaign,
    setStats = _a.setStats;
  return _jsx('div', {
    className: 'flex flex-col gap-2',
    children: _jsx(TabWrapper, {
      currentTab: currentTab.toString(),
      campaign: campaign,
      setStats: setStats,
    }),
  });
};
export default TabContent;
//# sourceMappingURL=TabContent.js.map
