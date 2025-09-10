/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowForward } from 'react-icons/io5';
import Dialog from '@mui/material/Dialog';

import { useAuth } from '../../../features/auth/context/AuthContext';
import { BrandContext } from '../../brand/context/BrandContext';
import { CampaignContext } from '../../../context/CampaignContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
import handleNavigate from '../../../helpers/handleNavigate';
import posthog from '../../../helpers/posthog';
import { plannerApi, policyApi } from '../../../api/contentGenerationApi';

interface Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  open: boolean;
}

const CampaignSetupCompleteDialog: React.FC<Props> = ({ setCurrentStep, open }) => {
  const { campaignInfo, setCampaignInfo }: any = useContext(CampaignContext);
  const { businessInfo }: any = useContext(BrandContext);
  const { profile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  // const [progress, setProgress] = useState(0);

  // Endpoint URL
  const endpointUrl = getServiceURL('data');
  const navigate = useNavigate();

  const updateStatus = (startDate: any) => {
    if (!startDate) {
      // If no start date provided, default to Inactive
      return 'Inactive';
    }
    const [month, day, year] = startDate.split('/').map(Number);
    const inputDate = new Date(year, month - 1, day); // JavaScript Date months are 0-based

    // Get the current date
    const currentDate = new Date();
    const status = inputDate >= currentDate ? 'Inactive' : 'Active';
    return status;
  };

  useEffect(() => {
    let campaignId;
    let apiEndpoint = '/api/v1/data';
    if (campaignInfo?.campaign_id !== undefined) {
      campaignId = campaignInfo?.campaign_id;
      apiEndpoint = '/api/v1/update';
    } else campaignId = crypto.randomUUID();
    const payload = {
      brand_variables: {
        TOV: businessInfo?.toneAndVoice,
        values: businessInfo?.values,
        Persona: businessInfo?.persona,
        Colors: businessInfo?.brandColors,
        mission: businessInfo?.mission,
        brand_visual_style: businessInfo?.style,
        scenes: businessInfo?.scenes,
        themes: businessInfo?.themes,
      },
      campaign_variables: {
        id: campaignId,
        name: campaignInfo?.name || 'Untitled Campaign',
        product_service: campaignInfo?.product || '',
        audience_ethnicity: campaignInfo?.audienceRace || [],
        audience_interests: campaignInfo?.audienceInterests || [],
        product_service_description: campaignInfo?.productDescription || '',
        purpose_topic: campaignInfo?.purpose || 'Make customers aware/excited',
        emotion: campaignInfo?.audienceEmotion || [],
        scene: businessInfo?.locations || [],
        lighting: 'bright',
        key_feature: campaignInfo?.product_features || [],
        purpose: campaignInfo?.purposeAbout || '',
        camera_position: 'normal',
        audience_gender: campaignInfo?.audienceGender || [],
        mood: ['electric', ' fun', ' chic'],
        audience_age: campaignInfo?.audienceAgeRange || [],
        start_date: campaignInfo?.startDate || new Date().toLocaleDateString('en-US'),
        duration: campaignInfo?.duration || '2 weeks',
        postingFrequency: campaignInfo?.postingFrequency || 'Daily',
        deliveryDay: campaignInfo?.deliveryDay || 'Monday',
        durationNum: campaignInfo?.durationNum || 2,
        frequency: campaignInfo?.frequency || 3,
        summary: campaignInfo?.summary || '',
      },
      biz_variables: {
        industry: businessInfo?.industry,
        brand_name: businessInfo?.name,
        vertical: businessInfo?.vertical,
      },
    };

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`;

    const status = updateStatus(campaignInfo.startDate);
    fetch(endpointUrl + apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${profile?.token}`,
      },
      body: JSON.stringify({
        entity_name: 'campaign',
        entity_data: {
          campaign_id: campaignId,
          status: status,
          timestamp: formattedDateTime,
          user_id: profile?.id,
          campaign_data: payload,
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((_err) => {
            throw new Error(err.detail || 'Failed to create campaign');
          });
        }
        return response.json();
      })
      .then((_data) => {
        if (posthog.__loaded) {
          posthog.capture('Campaign Created', {
            distinct_id: profile?.id,
            campaign_id: campaignId, // Replace with actual campaign ID
          });
        }
        startCampaignContentGeneration();
      })
      .catch((_error) => {
        setError('Failed to create campaign. Please check your campaign details and try again.');
      });

    const startCampaignContentGeneration = async () => {
      // Wait for campaign to propagate (increased to prevent 404 errors)
      await new Promise((resolve) => setTimeout(resolve, 8000));

      try {
        // Step 1: Create Scene Mix Policy for the campaign

        // Map purpose to intent
        const purposeToIntent: Record<
          string,
          'awareness' | 'conversion' | 'engagement' | 'education'
        > = {
          'Make customers aware/excited': 'awareness',
          'Get customers to buy': 'conversion',
          'Build community': 'engagement',
          'Educate audience': 'education',
        };

        // Map industry/vertical to backend industry enum
        const getIndustry = (
          industry: string,
          vertical: string
        ):
          | 'consumable'
          | 'wearable'
          | 'device'
          | 'service'
          | 'venue'
          | 'food_beverage'
          | 'cosmetic'
          | 'supplement'
          | 'saas' => {
          const mapping: Record<
            string,
            | 'consumable'
            | 'wearable'
            | 'device'
            | 'service'
            | 'venue'
            | 'food_beverage'
            | 'cosmetic'
            | 'supplement'
            | 'saas'
          > = {
            food: 'food_beverage',
            beverage: 'food_beverage',
            food_beverage: 'food_beverage',
            cosmetics: 'cosmetic',
            cosmetic: 'cosmetic',
            supplement: 'supplement',
            supplements: 'supplement',
            clothing: 'wearable',
            apparel: 'wearable',
            fashion: 'wearable',
            technology: 'device',
            electronics: 'device',
            software: 'saas',
            saas: 'saas',
            service: 'service',
            venue: 'venue',
            restaurant: 'venue',
            retail: 'venue',
          };

          const industryLower = (industry || '').toLowerCase();
          const verticalLower = (vertical || '').toLowerCase();

          return mapping[industryLower] || mapping[verticalLower] || 'service';
        };

        const policyData = await policyApi.createPolicy(
          campaignId,
          {
            campaign_id: campaignId,
            intent: purposeToIntent[campaignInfo?.purpose] || 'awareness',
            industry: getIndustry(businessInfo?.industry, businessInfo?.vertical),
            brand_tier: 'standard', // Default to standard, could be derived from business info
            target_audience: {
              age_range: campaignInfo?.audienceAgeRange || [],
              gender: campaignInfo?.audienceGender || [],
              interests: campaignInfo?.audienceInterests || [],
              ethnicity: campaignInfo?.audienceRace || [],
            },
            brand_personality: campaignInfo?.audienceEmotion || [],
            product_features: campaignInfo?.product_features || [],
            seasonal_context: campaignInfo?.startDate,
            has_ingredients: false,
            visual_restrictions: [],
            force_regenerate: false,
          },
          profile?.token || ''
        );

        // Step 2: Create content plan using Scene Mix Planner

        // Map campaign purpose to campaign type
        const purposeToCampaignType: Record<
          string,
          'product_launch' | 'brand_awareness' | 'seasonal' | 'engagement'
        > = {
          'Make customers aware/excited': 'brand_awareness',
          'Get customers to buy': 'product_launch',
          'Build community': 'engagement',
          'Educate audience': 'brand_awareness',
        };

        const planData = await plannerApi.createPlan(
          campaignId,
          {
            campaign_name: campaignInfo?.name || 'Untitled Campaign',
            campaign_type: purposeToCampaignType[campaignInfo?.purpose] || 'brand_awareness',
            duration_weeks: campaignInfo.durationNum || 2,
            target_audience: (() => {
              const audience = [
                ...(campaignInfo?.audienceInterests || []),
                ...(campaignInfo?.audienceGender || []),
                ...(campaignInfo?.audienceAgeRange || []),
              ].filter(Boolean);
              // Ensure at least one target audience item (backend requires min_items=1)
              return audience.length > 0 ? audience : ['general'];
            })(),
            content_types: ['post', 'story', 'reel'],
            weekly_post_count: campaignInfo.frequency || 3,
            themes: ['brand_awareness', 'product_showcase', 'user_stories', 'educational'],
            brand_values: businessInfo?.values || [],
          },
          profile?.token || ''
        );

        // Step 3: Trigger content generation with Scene Mix plan
        const baseParams = {
          campaign_id: campaignId,
          use_scene_mix: 'true', // Flag to use new Scene Mix generation
          plan_id: planData.plan_id,
        };

        // Only add policy_id if it exists and is not undefined
        if (policyData?.id && policyData.id !== 'undefined') {
          baseParams.policy_id = policyData.id;
        }

        const params = new URLSearchParams(baseParams);
        const generateUrl = `${getServiceURL('content-gen')}/api/v1/contentgen/generate?${params.toString()}`;

        // Always include auth headers for content-gen service
        const response = await fetch(generateUrl, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${profile?.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to start content generation: ${response.status} - ${errorText || response.statusText}`
          );
        }

        const _responseData = await response.json();
        return;
      } catch (_error) {
        // Don't fall back to legacy - we want Scene Mix to work properly
        // This ensures we fix Scene Mix issues rather than masking them
        setError(
          `Scene Mix generation failed: ${error.message || error}. Please try again or contact support.`
        );
        throw new Error(`Scene Mix generation failed: ${error.message || error}`);
      }
    };
  }, []);

  const onStartNewCampaign = () => {
    setCurrentStep(1);
    setCampaignInfo({});
    handleNavigate(profile?.id || '', '/campaign', navigate);
  };

  return (
    <Dialog
      open={open}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            backdropFilter: 'blur(8px)',
          },
        },
      }}
    >
      <div className=" bg-white p-8 rounded-lg text-center max-w-[608px] sm:w-auto w-[95%]">
        <h2 className="bg-gradient-to-r bg-clip-text text-transparent from-[#681DBA] to-[#FF43E1] text-2xl font-semibold mb-4">
          Campaign Setup Complete!
        </h2>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <p className="mb-4 font-medium sm:text-2xl text-lg">
          We're creating your content now and will email you when it's ready. And if you're ready
          for more campaigns, just hit the start button below
        </p>
        {/* <p className="mb-6 sm:text-xl text-base text-gray-900 font-light">
          If you would prefer not to wait, feel free to close this window and we
          will email you a link to the review page when it is available.
        </p> */}

        {/* Image can be replaced with actual path */}
        <div className="flex items-center justify-center my-10">
          <img src="/campaignCompleted.png" className="max-w-[450px] h-auto w-full" />
        </div>
        {/* <ProgressComponent progress={progress} /> */}
        <div className="flex flex-col-reverse sm:flex-row justify-center gap-4">
          <button
            onClick={onStartNewCampaign}
            className="bg-[#5145CD] text-white py-2 px-4 rounded flex items-center justify-center"
          >
            Start a New Campaign
            <div className="inline-block ml-2">
              <IoArrowForward />
            </div>
          </button>
          <button
            onClick={() => handleNavigate(profile?.id || '', '/dashboard', navigate)}
            className="border border-[#E5E7EB] text-black py-2 px-4 rounded font-medium"
          >
            Go to my dashboard
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default CampaignSetupCompleteDialog;
