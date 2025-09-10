import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRightLong } from 'react-icons/fa6';
import { CampaignContext } from '../../../context/CampaignContext';
import handleNavigate from '../../../helpers/handleNavigate';
import { useAuth } from '../../../features/auth/context/AuthContext';
var ExportPopup = function (_a) {
  var campaignName = _a.campaignName,
    onClose = _a.onClose;
  var navigate = useNavigate();
  var profile = useAuth().profile;
  var setCampaignInfo = useContext(CampaignContext).setCampaignInfo;
  var redirectToSurvey = function () {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSeZWjG3pXklI-Znl1yV69q4yVlPNfdqyy-SeLcquAB9czbYRA/viewform?usp=sf_link',
      '_blank'
    ); // Opens the survey in a new tab
    onClose();
  };
  var handleNewCampaign = function () {
    setCampaignInfo({});
    handleNavigate(
      (profile === null || profile === void 0 ? void 0 : profile.id) || '',
      '/campaign',
      navigate
    );
  };
  return _jsx('div', {
    className: 'fixed inset-0 flex items-center  justify-center z-50 bg-black bg-opacity-50',
    children: _jsxs('div', {
      className:
        'bg-white rounded-lg shadow-lg p-6 text-center flex flex-col justify-center items-center gap-3 w-[750px] h-[580px]',
      children: [
        _jsx('div', {
          className: 'w-[400px] h-[220px] flex justify-center items-center ',
          children: _jsx('img', { src: '/popup.png', alt: 'Congrats', className: 'object-fill' }),
        }),
        _jsxs('div', {
          className: 'flex flex-col justify-center items-center gap-0',
          children: [
            _jsxs('div', {
              className: 'flex flex-col justify-center items-center gap-4',
              children: [
                _jsx('h2', {
                  className: 'text-4xl font-bold text-gray-900',
                  children: 'Congrats!',
                }),
                _jsxs('p', {
                  className: 'text-xl leading-8 font-normal text-gray-900',
                  children: [
                    'You just exported your first set of Matchpoint AI-generated social media content for your ',
                    campaignName,
                    ' campaign. Let\u2019s keep it up!',
                  ],
                }),
                _jsxs('div', {
                  className: 'flex justify-center gap-4',
                  children: [
                    _jsxs('button', {
                      className:
                        'bg-indigo-600 text-white flex flex-row justify-between items-center gap-2 py-3 px-4 rounded-lg hover:bg-indigo-700',
                      onClick: handleNewCampaign,
                      children: ['Start New Campaign', _jsx(FaArrowRightLong, {})],
                    }),
                    _jsx('button', {
                      className:
                        'border border-gray-200 text-gray-800 flex flex-row justify-between items-center gap-2 py-3 px-4 rounded-lg font-medium text-lg leading-6 hover:bg-gray-100',
                      onClick: redirectToSurvey,
                      children: 'Give Product Feedback',
                    }),
                  ],
                }),
              ],
            }),
            _jsx('button', {
              className:
                'text-gray-500 px-4 py-2 rounded underline text-sm font-normal leading-[21px] text-center decoration-solid decoration-underline [text-underline-position:from-font] [text-decoration-skip-ink:none] font-inter',
              onClick: function () {
                return handleNavigate(
                  (profile === null || profile === void 0 ? void 0 : profile.id) || '',
                  '/dashboard',
                  navigate
                );
              },
              children: 'Go to my dashboard',
            }),
          ],
        }),
      ],
    }),
  });
};
export default ExportPopup;
//# sourceMappingURL=ExportPopup.js.map
