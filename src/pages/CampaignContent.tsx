import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../components/shared/Sidebar';
import { useAuth } from '../features/auth/context/AuthContext';
import { getServiceURL } from '../helpers/getServiceURL';
import { useNavigate, useParams } from 'react-router-dom';
import { displayDuration, getPostingSchedule } from '../helpers/calculateTiming';
import CampaignHeader from '../components/campaign/CampaignHeader';
import { capitalizeFirstLetterOfEachWord } from '../helpers/formatters';
import ButtonGroup from '../components/campaign/ButtonGroup';
import ApprovePopup from '../components/campaign/ApprovePopup';
import TabWrapper from '../components/campaign/TabWrapper';
import { trackContentReview, trackCampaignPublish } from '../helpers/analytics';
import { CampaignContext, CampaignInfoType } from '../context/CampaignContext';
import type { Campaign } from '../components/campaign/TabWrapper';
import CampaignReviewButton from '../components/dashboard/CampaignReviewButton';
import { Button } from '@mui/material';
import handleNavigate from '../helpers/handleNavigate';

const CampaignContent = () => {
  const [currentTab, setCurrentTab] = React.useState(1);
  const [campaignContent, setCampaign] = useState<CampaignInfoType | undefined>();
  const [title, setTitle] = useState('');
  const [service, setService] = useState('');
  const [timeFrame, setTimeFrame] = useState('');
  const [postingSchedule, setPostingSchedule] = useState('');
  const { id } = useParams();
  const { profile, isAuthenticated, isLoading: authLoading } = useAuth();
  const { setCampaignInfo } = useContext(CampaignContext);

  const navigate = useNavigate();
  const [approvePopup, setApprovePopup] = useState(false);
  const [stats, setStats] = useState<{
    total_content: number;
    approved: number;
    ready_for_review: number;
    generating: number;
    published: number;
    total_posts: number;
    exported: number;
  }>({
    total_content: 0,
    approved: 0,
    ready_for_review: 0,
    generating: 0,
    published: 0,
    total_posts: 0,
    exported: 0,
  });
  const [reviewStartTime, setReviewStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const endpointUrl = getServiceURL('data');

  // Wait for authentication to be ready
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Separate effect for data fetching
  useEffect(() => {
    if (authLoading || !isAuthenticated || !profile?.token || !id) {
      return;
    }

    let pollInterval: NodeJS.Timeout | null = null;
    let isUnmounted = false;

    const fetchData = async () => {
      if (isUnmounted) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch campaign data
        const campaignParams = new URLSearchParams({
          query_kind: 'campaign',
          id,
        });

        const campaignResponse = await fetch(
          `${endpointUrl}/api/v1/data/get/complex?${campaignParams.toString()}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${profile.token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (campaignResponse.status === 401) {
          navigate('/login');
          return;
        }

        if (!campaignResponse.ok) {
          throw new Error(`Failed to fetch campaign: ${campaignResponse.statusText}`);
        }

        const campaignData = await campaignResponse.json();

        if (!campaignData.length) {
          setError('Campaign not found. Please check if the campaign exists or try again.');
          setLoading(false);
          return;
        }
        const campaign = campaignData[0];
        setCampaign(campaign);
        setTitle(
          capitalizeFirstLetterOfEachWord(campaign.campaign_data?.campaign_variables?.name || '')
        );
        setService(campaign.campaign_data?.campaign_variables?.product_service || 'not selected');
        setPostingSchedule(
          getPostingSchedule(campaign.campaign_data?.campaign_variables?.frequency || '')
        );
        setTimeFrame(
          displayDuration(
            campaign.campaign_data?.campaign_variables?.start_date || '',
            campaign.campaign_data?.campaign_variables?.durationNum || 0
          )
        );

        // Fetch content data
        const contentParams = new URLSearchParams({
          query_kind: 'generated_content',
          id: id,
        });

        const contentResponse = await fetch(
          `${endpointUrl}/api/v1/data/get/complex?${contentParams.toString()}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${profile.token}`,
            },
          }
        );

        if (!contentResponse.ok) {
          throw new Error(`Failed to fetch content: ${contentResponse.statusText}`);
        }

        const contentData = await contentResponse.json();
        if (contentData.length > 0) {
          const {
            total_content,
            approved,
            ready_for_review,
            generating,
            published,
            total_posts,
            exported,
          } = contentData[0];

          setStats({
            total_content: total_content || 0,
            approved: approved || 0,
            ready_for_review: ready_for_review || 0,
            generating: generating && generating > 0 ? generating : 0,
            published: published || 0,
            total_posts: total_posts || total_content || 0,
            exported: exported || 0,
          });

          if (approved > 0) {
            const timeSpent = Date.now() - reviewStartTime;
            trackContentReview(id, 'image', timeSpent, 'approve');
            setReviewStartTime(Date.now());
          }
        }

        setLoading(false);

        // If campaign content is loaded, clear polling
        if (!isUnmounted && campaign && campaign.campaign_data) {
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load campaign data');
        setLoading(false);
      }
    };

    fetchData(); // Initial fetch

    // Only set up polling if we don't have campaign content yet
    if (!campaignContent?.campaign_data) {
      pollInterval = setInterval(fetchData, 10000);
    }

    // return () => {
    //   isUnmounted = true;
    //   if (pollInterval) {
    //     clearInterval(pollInterval);
    //   }
    // };
  }, [id, profile?.token, isAuthenticated, authLoading, navigate, endpointUrl, retryTrigger]);

  const handleApprove = () => {
    if (id && campaignContent && campaignContent.campaign_data) {
      trackCampaignPublish(
        id,
        campaignContent.campaign_data.campaign_variables.durationNum,
        stats?.total_content
      );
    }
  };

  if (authLoading) {
    return (
      <div className="flex w-full bg-custom-gradient min-h-screen">
        <div className="flex justify-center items-center w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5145CD]"></div>
        </div>
      </div>
    );
  }

  if (!profile?.token) {
    return null;
  }

  const navigateToCampaignView = () => {
    const data = campaignContent?.campaign_data?.campaign_variables;
    if (data) {
      setCampaignInfo((prev) => ({
        ...prev,
        summary: data?.summary,
        name: data?.name,
        product: data?.product_service,
        audienceRace: data?.audience_ethnicity,
        audienceEmotion: data?.emotion,
        audienceInterests: data?.audience_interests,
        productDescription: data?.product_service_description,
        purpose: data?.purpose_topic,
        locations: data?.scene,
        currentStep: 5,
        product_features: data?.key_feature,
        purposeAbout: data?.purpose,
        audienceGender: data?.audience_gender,
        audienceAgeRange: data?.audience_age,
        startDate: data?.start_date,
        duration: data?.duration,
        durationNum: data?.durationNum,
        frequency: data?.frequency,
        postingFrequency: data?.postingFrequency,
        deliveryDay: data?.deliveryDay,
        campaign_id: campaignContent?.campaign_id,
        campaign_brief: true,
        created_at: campaignContent?.timestamp,
      }));
      handleNavigate(profile?.id ?? '', '/campaign', navigate);
    }
  };
  return (
    <div className="flex w-full bg-custom-gradient min-h-screen">
      <Sidebar currentStep={0} />
      <div className={`flex flex-col ml-0 md:ml-20 flex-grow`}>
        <div className="text-[#747474] flex flex-col gap-5">
          <div className="flex flex-col gap-10 w-full pl-2 md:pl-14 pt-24 md:pt-10 pr-2 md:pr-10 pb-5 bg-white">
            <CampaignHeader
              title={title}
              service={service}
              timeFrame={timeFrame}
              postingSchdule={postingSchedule}
              currentTab={currentTab}
              handleNavigate={navigateToCampaignView}
            />

            <ButtonGroup
              campaign={campaignContent as CampaignInfoType}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              setApprovePopup={setApprovePopup}
              stats={stats}
              onApprove={handleApprove}
            />
          </div>
          <div className="flex flex-col pl-2 md:pl-3 lg:pl-5 pt-20 pr-2 md:pr-7">
            {loading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5145CD]"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">
                {error}
                <button
                  onClick={() => {
                    setError(null);
                    setRetryTrigger((prev) => prev + 1);
                  }}
                  className="ml-2 text-[#5145CD] underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              campaignContent &&
              campaignContent.campaign_data && (
                <TabWrapper
                  currentTab={currentTab.toString()}
                  campaign={{
                    campaign_id: id as string,
                    status: 'active',
                    timestamp: new Date().toISOString(),
                    campaign_data: campaignContent.campaign_data as Campaign['campaign_data'],
                  }}
                  setStats={
                    setStats as React.Dispatch<
                      React.SetStateAction<{
                        [key: string]: unknown;
                        approved: number;
                        ready_for_review: number;
                      }>
                    >
                  }
                />
              )
            )}
          </div>
        </div>
      </div>
      {approvePopup && <ApprovePopup onClose={() => setApprovePopup(false)} />}
    </div>
  );
};

export default CampaignContent;
