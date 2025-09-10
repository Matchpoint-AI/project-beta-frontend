import { createContext } from 'react';
export var CampaignContext = createContext({
  campaignInfo: {},
  setCampaignInfo: function () {},
  campaignId: null,
  setCampaignId: function () {},
});
/*import { createContext, useState } from 'react';

export const CampaignContext = createContext({
  campaignInfo: {},
  setCampaignInfo: () => {},
  campaignId: null, // Add campaignId to the context
  setCampaignId: () => {}, // Add setter for campaignId
});

export const CampaignProvider = ({ children }) => {
  const [campaignInfo, setCampaignInfo] = useState({});
  const [campaignId, setCampaignId] = useState(null); // State to hold campaignId

  const value = { campaignInfo, setCampaignInfo, campaignId, setCampaignId };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};*/
//# sourceMappingURL=CampaignContext.js.map
