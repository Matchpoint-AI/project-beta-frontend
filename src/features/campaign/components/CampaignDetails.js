import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useContext, useEffect, useState } from 'react';
import { CampaignContext } from '../../../context/CampaignContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { CircularProgress } from '@mui/material';
import CampaignDetailsBlock from './CampaignDetailsBlock';
export default function CampaignDetails() {
  var _a = useState(null),
    specs = _a[0],
    setSpecs = _a[1];
  var campaignInfo = useContext(CampaignContext).campaignInfo;
  var _b = useState(true),
    loading = _b[0],
    setLoading = _b[1];
  var _c = useState(false),
    error = _c[0],
    setError = _c[1];
  var profile = useAuth().profile;
  useEffect(function () {
    var prompt =
      '\nGenerate a JSON response based on the provided information to describe the key features, target audience, and purpose of a product campaign. The JSON should follow this format:\n\n{\n    "key_features": "A concise description of the product\u2019s benefits, based on the product_features array.",\n    "audience": "A description of the target audience, including age range, gender, interests, and relevant emotional goals, based on provided audience details.",\n    "purpose": "A description explaining the goal of the campaign, mentioning the purpose and its focus."\n}\n\nHere\u2019s the information to use for generating this response:\n\n{\n    "purpose": '
        .concat(campaignInfo.purpose, ',\n    "purposeAbout": ')
        .concat(campaignInfo.purposeAbout, ',\n    "name": ')
        .concat(campaignInfo.name, ',\n    "product_features": ')
        .concat(campaignInfo.product_features, ',\n    "product": ')
        .concat(campaignInfo.product, ',\n    "audienceAgeRange": ')
        .concat(campaignInfo.audienceAgeRange, ',\n    "audienceInterests": ')
        .concat(campaignInfo.audienceInterests, ',\n    "audienceGender": ')
        .concat(campaignInfo.audienceGender, ',\n    "audienceRace": ')
        .concat(
          campaignInfo.audienceRace,
          ',\n}\n\nUse the information above to generate an accurate JSON response that includes concise descriptions for each property.\n'
        );
    var endpointUrl = ''.concat(getServiceURL('llm'), '/api/v1/llm/openai');
    fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: (profile === null || profile === void 0 ? void 0 : profile.token) || '',
      },
      body: JSON.stringify({
        prompt: prompt,
        json_mode: true,
      }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (_data) {
        setSpecs(JSON.parse(data.response.choices[0].message.content));
      })
      .catch(function () {
        setError(true);
      })
      .finally(function () {
        return setLoading(false);
      });
  }, []);
  return _jsxs(_Fragment, {
    children: [
      error &&
        _jsx('div', {
          className: 'p-5 mb-[14px] bg-[#fff5f5] border border-[#F05252] rounded-md',
          children: _jsx('p', {
            className: 'text-[#F05252] font-medium',
            children: 'Error loading campaign details',
          }),
        }),
      loading &&
        _jsxs('div', {
          className: 'p-5 mb-[14px] flex items-center justify-center flex-col gap-1',
          children: [
            _jsx(CircularProgress, { sx: { color: '#42389D' }, size: 25, thickness: 5 }),
            _jsx('p', {
              className: 'text-[13px] capitalize text-[#6B7280]',
              children: 'loading campaign details',
            }),
          ],
        }),
      specs &&
        _jsxs(_Fragment, {
          children: [
            specs.key_features &&
              _jsx(CampaignDetailsBlock, {
                title: 'Key Competitive Features:',
                text: specs.key_features,
                review: campaignInfo.campaign_brief,
              }),
            specs.audience &&
              _jsx(CampaignDetailsBlock, {
                title: 'Target Audience & Interest:',
                text: specs.audience,
                review: campaignInfo.campaign_brief,
              }),
            specs.purpose &&
              _jsx(CampaignDetailsBlock, {
                title: 'Purpose:',
                text: specs.purpose,
                review: campaignInfo.campaign_brief,
              }),
          ],
        }),
    ],
  });
}
//# sourceMappingURL=CampaignDetails.js.map
