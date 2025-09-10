import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignContext } from '../../../context/CampaignContext';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { useAuth } from '../../auth/context/AuthContext';
import handleNavigate from '../../../helpers/handleNavigate';
var EmptyDashboard = function () {
  var navigate = useNavigate();
  var profile = useAuth().profile;
  var setCampaignInfo = useContext(CampaignContext).setCampaignInfo;
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
  return _jsx('div', {
    className: 'w-full min-h-screen flex flex-row justify-center items-center',
    children: _jsxs('div', {
      className: 'w-fit h-fit flex flex-col gap-16 justify-center items-center',
      children: [
        _jsx('h1', {
          className: 'text-2xl font-semibold leading-9 text-gradient',
          children: 'Ready to start your new campaign?',
        }),
        _jsxs('div', {
          className: 'flex flex-col justify-center items-center gap-4',
          children: [
            _jsx('img', { src: 'createCampaign.png' }),
            _jsx('div', {
              className: 'flex flex-col gap-0 justify-center items-center',
              children: _jsxs('h2', {
                className: 'text-gray-900 text-xl font-normal text-center leading-8',
                children: [
                  'Super easy. Let\u2019s create your next campaign brief ',
                  _jsx('br', {}),
                  ' and your content will be on its way.',
                  ' ',
                ],
              }),
            }),
            _jsxs('button', {
              className:
                'bg-[#5145CD] text-white py-4 px-2 rounded-lg flex flex-row justify-center items-center gap-2 text-base font-medium leading-4',
              onClick: handleNewCampaign,
              children: [
                'Start my next campaign',
                _jsx(AiOutlineArrowRight, { className: 'w-6 h-6' }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
};
export default EmptyDashboard;
//# sourceMappingURL=EmptyDashboard.js.map
