import React, { useState, useEffect } from 'react';
import '../index.css';
import { BrandContext, BusinessInfo } from '../features/brand/context/BrandContext';
import { CampaignContext } from '../features/campaign/context/CampaignContext';
import { AuthProvider } from '../features/auth/context/AuthContext';
import { withErrorBoundary } from 'react-error-boundary';
import { RiErrorWarningLine } from 'react-icons/ri';
import { useAuth } from '../features/auth/context/AuthContext';
import posthog from '../helpers/posthog';

import './App.css';
import BrandDataLoader from '../features/brand/components/BrandDataLoader';
import AppRoutes from './AppRoutes';
import { AppProvider } from '../shared/context/appContext';
import { UsersContextProvider } from '../features/users/context/UsersContext';
import VersionDisplay from '../shared/components/feedback/VersionDisplay';

function Fallback({ error }: { error: Error }) {
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile?.token) return;
    if (posthog.__loaded) {
      posthog.capture('Error Occurred', {
        distinct_id: profile?.id || 'anonymous_user',
        error_message: error.message,
      });
    }
  }, [profile]);

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#F1FDFF] to-[#F5D9FF] min-h-screen">
      <RiErrorWarningLine size={64} color="#F05252" />
      <h1 className="font-medium md:text-[42px] sm:text-[32px] text-[28px] text-center text-[#30175A]">
        Error
      </h1>
      <p className="text-[#30175A] md:text-lg text-base text-center max-w-[600px]">
        Unexpected error, please reload the page if the problem persists try again later!
      </p>
      <button
        className="flex items-center justify-center font-semibold mt-5 bg-[#5145CD] text-white rounded-lg py-3 px-5"
        onClick={() => window.location.reload()}
      >
        Reload
      </button>
    </div>
  );
}

function AppContent() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: '',
    website: '',
    product_features: [],
    product_description: '',
    product_link: '',
    start_date: '',
    durationNum: 0,
  });
  const [campaignInfo, setCampaignInfo] = useState({});
  const [campaignId, setCampaignId] = useState<string | null>(null);

  return (
    <AppProvider>
      <UsersContextProvider>
        <BrandContext.Provider value={{ businessInfo, setBusinessInfo }}>
          <CampaignContext.Provider
            value={{
              campaignInfo,
              setCampaignInfo,
              campaignId,
              setCampaignId,
            }}
          >
            <BrandDataLoader>
              <AppRoutes />
            </BrandDataLoader>
          </CampaignContext.Provider>
        </BrandContext.Provider>
      </UsersContextProvider>
    </AppProvider>
  );
}

const AppWithErrorBoundary = withErrorBoundary(AppContent, {
  FallbackComponent: Fallback,
});

function App() {
  return (
    <AuthProvider>
      <AppWithErrorBoundary />
      <VersionDisplay />
    </AuthProvider>
  );
}

export default App;
