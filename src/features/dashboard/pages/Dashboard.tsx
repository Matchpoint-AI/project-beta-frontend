import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../../../components/shared/Sidebar';
import { useAuth } from '../../auth/context/AuthContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { BrandContext } from '../../brand/context/BrandContext';
import { CircularProgress } from '@mui/material';
import { RiErrorWarningLine } from 'react-icons/ri';
import CampaignsList from '../components/CampaignsList';
import { useNavigate } from 'react-router-dom';
import handleNavigate from '../../../helpers/handleNavigate';
import PerformancePredictionDashboard from '../../../components/performance/PerformancePredictionDashboard';
import { FaFlask, FaExternalLinkAlt } from 'react-icons/fa';

const Dashboard = () => {
  const [campaignType, setCampaignType] = useState('All');
  const [activeTab, setActiveTab] = useState('campaigns');
  const { businessInfo, setBusinessInfo } = useContext(BrandContext);
  const [campaigns, setCampaigns] = useState(businessInfo?.campaigns ?? []);
  const [loading, setLoading] = useState(!businessInfo?.campaigns);
  const [error, setError] = useState(false);
  const { profile, isAuthenticated } = useAuth();
  const endpointUrl = getServiceURL('data');

  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    if (!profile?.token) {
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);
    const params = new URLSearchParams({
      query_kind: 'campaign',
      status: campaignType,
    });

    try {
      const response = await fetch(`${endpointUrl}/api/v1/data/get/complex?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${profile.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setCampaigns(_data);
      setBusinessInfo({ ...businessInfo, campaigns: data });
    } catch (_error) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!profile?.token) return;

    if (!businessInfo.campaigns) {
      fetchCampaigns();
    } else setCampaigns(businessInfo.campaigns);
  }, [profile?.token, businessInfo.campaigns, isAuthenticated]);

  // Removed automatic redirect that was causing navigation issues
  // Users should manually click on campaigns to navigate to them

  if (!profile) {
    return (
      <div className="w-full h-full">
        <div className="flex w-full lg:flex-row flex-col bg-gradient-to-b min-h-screen from-[#F1FDFF] to-[#F5D9FF]">
          <Sidebar />
          <div className="w-full min-h-screen flex flex-col gap-5 justify-center items-center">
            <CircularProgress sx={{ color: '#42389D' }} size={80} thickness={5} />
            <h1 className="text-2xl font-semibold leading-9 text-gradient">
              Loading your profile...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex w-full lg:flex-row flex-col bg-gradient-to-b min-h-screen from-[#F1FDFF] to-[#F5D9FF]">
        <Sidebar />
        {loading && !error && (
          <div className="w-full min-h-screen flex flex-col gap-5 justify-center items-center">
            <CircularProgress sx={{ color: '#42389D' }} size={80} thickness={5} />
            <h1 className="text-2xl font-semibold leading-9 text-gradient">
              We are loading your campaigns
            </h1>
          </div>
        )}
        {!loading && error && (
          <div className="w-full min-h-screen flex flex-col gap-5 justify-center items-center">
            <RiErrorWarningLine size={64} color="#F05252" />
            <h1 className="font-medium md:text-[42px] sm:text-[32px] text-[28px] text-center text-[#30175A]">
              Unexpected Error
            </h1>
            <p className="text-[#30175A] md:text-lg text-base text-center max-w-[600px]">
              Sorry, unexpected error happend while fetching your campaigns
              <br />
              Please retry.
            </p>
            <button
              className="flex items-center justify-center font-semibold mt-5 bg-[#5145CD] text-white rounded-lg py-3 px-5"
              onClick={fetchCampaigns}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="w-full">
            {/* Tab Navigation */}
            <div className="flex gap-4 mb-6 px-8 pt-6">
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'campaigns'
                    ? 'bg-[#5145CD] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                My Campaigns
              </button>
              <button
                onClick={() => setActiveTab('predictions')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'predictions'
                    ? 'bg-[#5145CD] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                AI Predictions
              </button>
              <button
                onClick={() => setActiveTab('demo')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'demo'
                    ? 'bg-[#5145CD] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <FaFlask className="w-5 h-5" />
                Demo Features
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'campaigns' ? (
              <CampaignsList
                campaigns={campaigns}
                campaignType={campaignType}
                setCampaignType={setCampaignType}
              />
            ) : activeTab === 'predictions' ? (
              <div className="px-8">
                <PerformancePredictionDashboard />
              </div>
            ) : (
              <div className="px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-[#30175A] mb-4 flex items-center gap-2">
                    <FaFlask className="text-[#5145CD]" />
                    Demo Features
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Explore the latest A/B testing and content optimization features.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <FaFlask className="text-blue-600 text-xl mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">A/B Test Variants</h3>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">
                        Compare different content versions side-by-side with performance metrics and
                        statistical confidence.
                      </p>
                      <button
                        onClick={() => handleNavigate(navigate, '/demo/abtest')}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Demo
                        <FaExternalLinkAlt />
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 hover:shadow-md transition-shadow opacity-60">
                      <div className="flex items-center mb-4">
                        <FaFlask className="text-green-600 text-xl mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Smart Scheduling</h3>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">
                        AI-powered content scheduling based on audience behavior patterns.
                      </p>
                      <button
                        disabled
                        className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed text-sm"
                      >
                        Coming Soon
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-6 hover:shadow-md transition-shadow opacity-60">
                      <div className="flex items-center mb-4">
                        <FaFlask className="text-purple-600 text-xl mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Multi-Language</h3>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">
                        Automatic content translation and localization for global campaigns.
                      </p>
                      <button
                        disabled
                        className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed text-sm"
                      >
                        Coming Soon
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tip</h4>
                    <p className="text-blue-700 text-sm">
                      A/B testing helps you understand what content resonates best with your
                      audience. Try testing different caption styles, emoji usage, or call-to-action
                      approaches to optimize engagement.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
