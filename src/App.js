import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import './index.css';
import { BrandContext } from './context/BrandContext';
import { CampaignContext } from './context/CampaignContext';
import { AuthProvider } from './features/auth/context/AuthContext';
import { withErrorBoundary } from 'react-error-boundary';
import { RiErrorWarningLine } from 'react-icons/ri';
import { useAuth } from './features/auth/context/AuthContext';
import posthog from './helpers/posthog';
import './App.css';
import BrandDataLoader from './components/BrandDataLoader';
import AppRoutes from './AppRoutes';
import { AppProvider } from './context/appContext';
import { UsersContextProvider } from './context/UsersContext';
import VersionDisplay from './components/shared/VersionDisplay';
function Fallback(_a) {
  var error = _a.error;
  var profile = useAuth().profile;
  useEffect(
    function () {
      if (!(profile === null || profile === void 0 ? void 0 : profile.token)) return;
      if (posthog.__loaded) {
        posthog.capture('Error Occurred', {
          distinct_id:
            (profile === null || profile === void 0 ? void 0 : profile.id) || 'anonymous_user',
          error_message: error.message,
        });
      }
    },
    [profile]
  );
  return _jsxs('div', {
    className:
      'flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#F1FDFF] to-[#F5D9FF] min-h-screen',
    children: [
      _jsx(RiErrorWarningLine, { size: 64, color: '#F05252' }),
      _jsx('h1', {
        className:
          'font-medium md:text-[42px] sm:text-[32px] text-[28px] text-center text-[#30175A]',
        children: 'Error',
      }),
      _jsx('p', {
        className: 'text-[#30175A] md:text-lg text-base text-center max-w-[600px]',
        children:
          'Unexpected error, please reload the page if the problem persists try again later!',
      }),
      _jsx('button', {
        className:
          'flex items-center justify-center font-semibold mt-5 bg-[#5145CD] text-white rounded-lg py-3 px-5',
        onClick: function () {
          return window.location.reload();
        },
        children: 'Reload',
      }),
    ],
  });
}
function AppContent() {
  var _a = useState({
      name: '',
      website: '',
      product_features: [],
      product_description: '',
      product_link: '',
      start_date: '',
      durationNum: 0,
    }),
    businessInfo = _a[0],
    setBusinessInfo = _a[1];
  var _b = useState({}),
    campaignInfo = _b[0],
    setCampaignInfo = _b[1];
  var _c = useState(null),
    campaignId = _c[0],
    setCampaignId = _c[1];
  return _jsx(AppProvider, {
    children: _jsx(UsersContextProvider, {
      children: _jsx(BrandContext.Provider, {
        value: { businessInfo: businessInfo, setBusinessInfo: setBusinessInfo },
        children: _jsx(CampaignContext.Provider, {
          value: {
            campaignInfo: campaignInfo,
            setCampaignInfo: setCampaignInfo,
            campaignId: campaignId,
            setCampaignId: setCampaignId,
          },
          children: _jsx(BrandDataLoader, { children: _jsx(AppRoutes, {}) }),
        }),
      }),
    }),
  });
}
var AppWithErrorBoundary = withErrorBoundary(AppContent, {
  FallbackComponent: Fallback,
});
function App() {
  return _jsxs(AuthProvider, {
    children: [_jsx(AppWithErrorBoundary, {}), _jsx(VersionDisplay, {})],
  });
}
export default App;
//# sourceMappingURL=App.js.map
