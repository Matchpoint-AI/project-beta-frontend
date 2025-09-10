var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useContext, useEffect, useState } from 'react';
import EmptyDashboard from './EmptyDashboard';
import Dropdown from '../../../shared/components/ui/Dropdown';
import PromotionComponent from '../../../components/PromotionComponent';
import { useNavigate } from 'react-router-dom';
import { CampaignContext } from '../../../context/CampaignContext';
import { BrandContext } from '../../../context/BrandContext';
import handleNavigate from '../../../helpers/handleNavigate';
import { useAuth } from '../../auth/context/AuthContext';
export default function CampaignsList(_a) {
  var campaigns = _a.campaigns,
    campaignType = _a.campaignType,
    setCampaignType = _a.setCampaignType;
  var setCampaignInfo = useContext(CampaignContext).setCampaignInfo;
  var profile = useAuth().profile;
  var navigate = useNavigate();
  var businessInfo = useContext(BrandContext).businessInfo;
  var _b = useState({}),
    campaignStatuses = _b[0],
    setCampaignStatuses = _b[1];
  var handleNewCampaign = function () {
    var _a;
    setCampaignInfo({});
    handleNavigate(
      (_a = profile === null || profile === void 0 ? void 0 : profile.id) !== null && _a !== void 0
        ? _a
        : '',
      '/campaign',
      navigate
    );
  };
  // Precompute all campaign statuses
  useEffect(
    function () {
      var computeStatuses = function () {
        var statuses = {};
        // Filter out duplicate campaigns, keeping only the most recent one
        var uniqueCampaigns = campaigns.reduce(function (acc, campaign) {
          var existing = acc.find(function (c) {
            return c.campaign_id === campaign.campaign_id;
          });
          if (
            !existing ||
            new Date(campaign.timestamp || '') > new Date(existing.timestamp || '')
          ) {
            // Remove existing if present
            acc = acc.filter(function (c) {
              return c.campaign_id !== campaign.campaign_id;
            });
            acc.push(campaign);
          }
          return acc;
        }, []);
        uniqueCampaigns.forEach(function (campaign) {
          var status = campaign.status,
            campaign_data = campaign.campaign_data;
          if (status === 'DRAFT') {
            statuses[campaign.campaign_id] = 'Draft';
          } else {
            var _a = campaign_data.campaign_variables,
              start_date = _a.start_date,
              durationNum = _a.durationNum;
            var startDate = new Date(start_date);
            var durationInMilliseconds = durationNum * 7 * 24 * 60 * 60 * 1000; // Convert weeks to milliseconds
            var endDate = new Date(startDate.getTime() + durationInMilliseconds);
            var today = new Date();
            if (today < startDate) {
              // Campaign has not started yet
              statuses[campaign.campaign_id] = 'Upcoming';
            } else if (today >= startDate && today <= endDate) {
              statuses[campaign.campaign_id] = 'Current';
            } else if (today > endDate) {
              statuses[campaign.campaign_id] = 'Past';
            } else {
              statuses[campaign.campaign_id] = 'Draft';
            }
          }
        });
        setCampaignStatuses(statuses);
      };
      computeStatuses();
    },
    [campaigns]
  );
  var filteredCampaigns = campaigns.filter(function (campaign) {
    var calculatedStatus = campaignStatuses[campaign.campaign_id];
    if (!calculatedStatus) return false;
    if (campaignType === 'All') return true;
    return calculatedStatus === campaignType;
  });
  // Sort by most recent timestamp and remove duplicates
  var sortedCampaigns = __spreadArray([], filteredCampaigns, true)
    .sort(function (a, b) {
      return new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime();
    })
    .reduce(function (acc, campaign) {
      if (
        !acc.find(function (c) {
          return c.campaign_id === campaign.campaign_id;
        })
      ) {
        acc.push(campaign);
      }
      return acc;
    }, []);
  return _jsx(_Fragment, {
    children:
      campaigns.length === 0
        ? _jsx(EmptyDashboard, {})
        : _jsxs('div', {
            className: 'md:ml-[80px] flex-grow flex flex-col p-8 md:mt-8 mt-[80px] ',
            children: [
              _jsxs('div', {
                className: 'flex sm:flex-row flex-col justify-between mb-5',
                children: [
                  _jsxs('div', {
                    className: 'flex-col gap-4',
                    children: [
                      _jsxs('div', {
                        className: 'flex gap-4',
                        children: [
                          _jsxs('h1', {
                            className: 'text-[#5145CD] text-2xl font-semibold',
                            children: [businessInfo.name, ' Campaigns'],
                          }),
                          _jsx(Dropdown, {
                            currentValue: campaignType,
                            // type="options"
                            options: ['All', 'Current', 'Upcoming', 'Draft', 'Past'],
                            onUpdateContext: function (value) {
                              return setCampaignType(value);
                            },
                            className: 'w-fit',
                            dynamic: true,
                          }),
                        ],
                      }),
                      _jsx('p', {
                        className: 'my-2 text-base text-black',
                        children:
                          "Check out the campaigns you've created with Matchpoint below. Click any one of them to see your content.",
                      }),
                    ],
                  }),
                  _jsxs('button', {
                    className:
                      'bg-[#5145CD] h-[50px] text-white px-4 py-2 whitespace-nowrap rounded-md text-sm flex items-center gap-2 w-fit sm:mt-0 mt-5',
                    onClick: handleNewCampaign,
                    children: [
                      'New Campaign',
                      _jsx('img', { src: '/plus_icon.svg', alt: 'plus icon' }),
                    ],
                  }),
                ],
              }),
              _jsx('div', {
                className: 'flex flex-col gap-3 mb-2',
                children: sortedCampaigns.map(function (campaign) {
                  return _jsx(
                    PromotionComponent,
                    { campaign: campaign, status: campaignStatuses[campaign.campaign_id] },
                    ''.concat(campaign.campaign_id, '-').concat(campaign.timestamp)
                  );
                }),
              }),
            ],
          }),
  });
}
//# sourceMappingURL=CampaignsList.js.map
