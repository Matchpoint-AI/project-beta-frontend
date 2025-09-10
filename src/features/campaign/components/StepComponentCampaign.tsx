import React, { useContext, useState } from 'react';
import { CampaignContext, CampaignInfoType } from '../context/CampaignContext';
import { BrandContext } from '../features/brand/context/BrandContext';
import { useNavigate } from 'react-router-dom';
// import { getAuth } from "firebase/auth";
// import { useAuthentication } from "../firebase";
import { useAuth } from '../features/auth/context/AuthContext';
import { getServiceURL } from '../helpers/getServiceURL';
import { CircularProgress } from '@mui/material';
import handleNavigate from '../helpers/handleNavigate';
import scrapeProduct from './onboard/scrapeProduct';

interface StepCampaignProps {
  title?: string;
  name: string;
  description?: string;
  isActive: boolean;
  currentStep: number;
  globalStep: number;
}

// Extend CampaignInfoType for local use
interface ExtendedCampaignInfoType extends CampaignInfoType {
  campaign_id?: string;
  productDescription?: string;
  productLink?: string;
  startDate?: string;
  locations?: string[];
  postingFrequency?: number;
  deliveryDay?: string;
  summary?: string;
  duration?: number;
}

// Add Product type for products array
interface Product {
  name: string;
  description?: string;
  product_link?: string;
  link?: string;
}

function isProduct(obj: unknown): obj is Product {
  return (
    typeof obj === 'object' && obj !== null && typeof (obj as { name?: unknown }).name === 'string'
  );
}

const StepCampaignComponent: React.FC<StepCampaignProps> = ({
  name,
  // title, // Remove unused
  // description, // Remove unused
  isActive,
  currentStep,
  globalStep,
}) => {
  const isBeforeCurrentStep = currentStep >= globalStep;
  const { campaignInfo, setCampaignInfo } = useContext(CampaignContext);
  const { businessInfo } = useContext(BrandContext);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { profile } = useAuth();

  const endpointUrl = getServiceURL('data');
  // const endpointUrl = "http://localhost:5000";

  const handleSave = async () => {
    setSaving(true);
    const info = campaignInfo as ExtendedCampaignInfoType;
    let campaignId;
    let apiEndpoint = '/api/v1/data';
    if (info.campaign_id !== undefined) {
      campaignId = info.campaign_id;
      apiEndpoint = '/api/v1/update';
    } else campaignId = crypto.randomUUID();

    // --- LLM product feature generation ---
    let features = info.product_features || [];
    let productLinkToUse = info.product_link;
    let selectedProduct: Product | undefined = undefined;
    let products: Product[] = [];
    if (
      Array.isArray(businessInfo.products) &&
      businessInfo.products.length > 0 &&
      businessInfo.products.every((item) => typeof item === 'object' && item !== null)
    ) {
      products = businessInfo.products.filter(isProduct);
    }
    if ((!productLinkToUse || productLinkToUse === '') && products && info.product) {
      selectedProduct = products.find((p) => p.name === info.product);
      if (selectedProduct) {
        productLinkToUse = selectedProduct.product_link || selectedProduct.link || '';
      }
    }
    if (!features || features.length === 0) {
      try {
        let scraped;
        if (productLinkToUse) {
          scraped = await scrapeProduct(productLinkToUse);
        } else if (info.product || (selectedProduct && selectedProduct.description)) {
          scraped = await scrapeProduct(
            undefined,
            info.product || selectedProduct?.name,
            info.product_description || selectedProduct?.description
          );
        }
        if (scraped) {
          features = scraped.product_features;
          setCampaignInfo((prev: ExtendedCampaignInfoType) => ({
            ...prev,
            product_features: features,
          }));
        }
      } catch (_err) {
        // Error handled silently
      }
    }
    // --- End LLM product feature generation ---

    const payload = {
      brand_variables: {
        TOV: businessInfo.toneAndVoice,
        values: businessInfo.values,
        Persona: businessInfo.persona,
        Colors: businessInfo.brandColors,
        mission: businessInfo.mission,
        brand_visual_style: businessInfo.style,
      },
      campaign_variables: {
        id: campaignId,
        name: info.name,
        product_service: info.product,
        audience_ethnicity: info.audienceRace,
        audience_interests: info.audienceInterests,
        product_service_description: info.product_description,
        product_link: info.product_link,
        purpose_topic: info.purpose,
        emotion: info.audienceEmotion,
        scene: businessInfo.physical_locations,
        lighting: 'bright',
        currentStep: globalStep,
        key_feature: features,
        purpose: info.purposeAbout,
        camera_position: 'normal',
        audience_gender: info.audienceGender,
        mood: ['electric', ' fun', ' chic'],
        audience_age: info.audienceAgeRange,
        start_date: info.start_date,
        duration: info.duration,
        postingFrequency: info.postingFrequency,
        deliveryDay: info.deliveryDay,
        durationNum: info.durationNum,
        frequency: info.frequency,
        summary: info.summary,
      },
      biz_variables: {
        industry: businessInfo.industry,
        brand_name: businessInfo.name,
        vertical: businessInfo.vertical,
      },
    };

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
    const hours = String(date.getHours()).padStart(2, '0'); // Add leading zero for single-digit hours
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Add leading zero for single-digit minutes
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Add leading zero for single-digit seconds

    const formattedDateTime = `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`;
    // const status = updateStatus(campaignInfo.startDate);
    const status = 'Draft';
    if (!profile) {
      setSaving(false);
      return;
    }
    fetch(endpointUrl + apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${profile.token}`,
      },
      body: JSON.stringify({
        entity_name: 'campaign',
        entity_data: {
          campaign_id: campaignId,
          status: status,
          timestamp: formattedDateTime,
          campaign_data: payload,
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to post data');
        }
        return response.json();
      })
      .then((_data) => {
        setCampaignInfo({});
        setTimeout(() => {
          // setMessage(newMessage);
          setSaving(false);
          handleNavigate(profile.id, '/dashboard', navigate);
        }, 3000);
      })
      .catch((_error) => {});
  };
  return (
    <div className="flex flex-col justify-center">
      <div className="flex items-center gap-2">
        {isBeforeCurrentStep ? (
          <div className={`w-4 h-4 ${isActive ? 'bg-[#5145CD]' : 'bg-[#6B7280]'} rounded-full`} />
        ) : (
          <div className={`w-4 h-4 bg-[#5145CD] rounded-full items-center flex justify-center`}>
            <img src="/thumbs_up.svg" alt="step_inactive" width={10} height={10} />
          </div>
        )}
        {/* Step Title */}
        <p
          className={`text-lg font-semibold ${
            isActive
              ? 'text-[#5145CD]'
              : `${!isBeforeCurrentStep ? 'text-[#5145CD]' : 'text-[#6B7280]'}`
          }`}
        >
          {name}
        </p>
      </div>
      {/* {isActive && (
        <div className="flex my-4">
          <div className="w-[3px] h-24 bg-[#5145CD] rounded-full mx-4" />
          <div>
            <p className="text-lg font-semibold text-gray-900">{title}</p>
            <p className="text-lg">{description}</p>
          </div>
        </div>
      )} */}
      {globalStep !== 1 && campaignInfo.campaign_brief !== true && (
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`${
            currentStep !== 5 ? 'hidden' : ''
          } h-[41px] w-[142.5px] my-5 p-2 text-sm font-medium border border-[#6B7280] text-[#6B7280] bg-white hover:bg-blue-200 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center`}
        >
          {saving ? (
            <CircularProgress sx={{ color: 'gray' }} size={25} thickness={5} />
          ) : (
            'Save For Later'
          )}
        </button>
      )}
    </div>
  );
};

export default StepCampaignComponent;
