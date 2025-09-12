import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CampaignStepsBar from '../components/CampaignStepsBar';
import CustomComponent from '../components/CustomComponent';
import ErrorToast from '../../../shared/components/feedback/ErrorToast';
import AudienceForm from '../../../components/Forms/AudienceForm';
import CampaignBriefForm from '../../../components/Forms/CampaignBriefForm';
import PurposeForm from '../../../components/Forms/PurposeForm';
import ServiceForm from '../../../components/onboard/ServiceForm';
import TimingForm from '../../../components/Forms/TimingForm';
import Sidebar from '../../../components/shared/Sidebar';
import { useAuth } from '../../auth/context/AuthContext';
import { BrandContext } from '../../brand/context/BrandContext';
import { CampaignContext } from '../../../context/CampaignContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { displayPeriod } from '../../../helpers/calculateTiming';
import handleNavigate from '../../../helpers/handleNavigate';
import { trackCampaignBriefCreation, trackFeatureUsage } from '../../../helpers/analytics';

interface CampaignInfo {
  currentStep?: number;
  brandLogo?: string;
  campaignType?: 'awareness' | 'conversion';
  duration?: number;
  startDate?: string;
  product?: string;
}

interface BusinessInfo {
  products?: string[];
  name?: string;
  website?: string;
  industry?: string;
  vertical?: string;
  physical_locations?: string[];
  locations_fetched?: boolean;
  checkZip?: boolean;
  brandColors?: string[];
  values?: string[];
  toneAndVoice?: string;
  mission?: string;
  persona?: string;
  summary?: string;
  isSaved?: boolean;
  logo?: string;
}

const Campaign = () => {
  const { campaignInfo, setCampaignInfo } = useContext(CampaignContext) as {
    campaignInfo: CampaignInfo;
    setCampaignInfo: React.Dispatch<React.SetStateAction<CampaignInfo>>;
  };
  const [currentStep, setCurrentStep] = useState(1);
  const { setBusinessInfo } = useContext(BrandContext) as unknown as {
    setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>;
  };
  const [timing, setTiming] = useState('Timing not selected');
  const [service, setService] = useState(' not selected');
  const { profile } = useAuth();
  const endpointUrl = getServiceURL('data');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [stepStartTime, setStepStartTime] = useState(Date.now());

  useEffect(() => {
    setCurrentStep(1);
  }, [location]);

  useEffect(() => {
    if (profile?.token === '') return;
    const fetchBrandData = async () => {
      const response = await fetch(endpointUrl + '/api/v1/data/get/complex?query_kind=brand_data', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${profile?.token}`,
        },
      });
      const data = await response.json();
      if (data.length > 0) {
        setCampaignInfo((prev) => ({
          ...prev,
          brandLogo: data[0].logo !== undefined ? data[0].logo.file : undefined,
        }));
        setBusinessInfo({
          products: data[0].brand_variables.products,
          name: data[0].biz_variables.brand_name,
          website: data[0].biz_variables.brand_website,
          industry: data[0].biz_variables.industry,
          vertical: data[0].biz_variables.vertical,
          physical_locations: data[0].brand_variables.locations,
          locations_fetched: data[0].brand_variables.isFetched,
          checkZip: data[0].brand_variables.checkZip,
          brandColors: data[0].brand_variables.colors,
          values: data[0].brand_variables.values,
          toneAndVoice: data[0].brand_variables.tov,
          mission: data[0].brand_variables.mission,
          persona: data[0].brand_variables.persona,
          summary: data[0].brand_variables.summary,
          isSaved: true,
          logo: data[0].biz_variables.brand_logo,
        });
      } else {
        setError(true);
        setTimeout(() => {
          handleNavigate(profile?.id || '', '/onboard', navigate);
        }, 1000);
      }
    };

    fetchBrandData();
  }, [profile]);

  const handleBack = (step = 1) => {
    if (currentStep > 1) {
      setCampaignInfo((prev) => ({
        ...prev,
        currentStep: currentStep - step,
      }));
      setCurrentStep(currentStep - step);
      setStepStartTime(Date.now());
    }
  };

  const handleNext = (step = 1) => {
    const timeSpent = Date.now() - stepStartTime;
    trackFeatureUsage('Campaign Creation', `Step ${currentStep} Completed`, timeSpent);

    if (currentStep < 6) {
      setCampaignInfo((prev) => ({
        ...prev,
        currentStep: currentStep + step,
      }));
      setCurrentStep(currentStep + step);
      setStepStartTime(Date.now());
    }

    if (currentStep === 5) {
      trackCampaignBriefCreation(
        campaignInfo.campaignType || 'awareness',
        campaignInfo.duration || 4,
        timeSpent
      );
    }
  };

  const customComponentData = [
    {
      title: "Let's create a brief for your campaign.",
      subtitle:
        'The below info will allow us to express your business with targeted messaging to the right audience',
    },
    {
      title: "Let's select the focus of your campaign.",
      subtitle: "We'll show this in your campaign with pictures and captions.",
    },
    {
      title: "Let's define who your campaign is for.",
      subtitle:
        'The inputs below will decide how people look in your campaign to help your audience connect with your business.',
    },
    {
      title: "Let's set timing for your campaign",
      subtitle: 'Select your start date and campaign length',
    },
    {
      title: 'Review your Campaign Brief',
      subtitle:
        "We made this brief to guide your campaign creation. You can edit or approve it, and we'll start creating your content.",
    },
    {
      title: 'Campaign Brief Review',
      subtitle: 'Select your start date and campaign length',
    },
  ];

  useEffect(() => {
    if (campaignInfo.currentStep !== undefined) setCurrentStep(campaignInfo.currentStep);
    const info = displayPeriod(
      campaignInfo.startDate || new Date().toISOString(),
      `${campaignInfo.duration || 4} weeks`
    );
    setTiming(info);
    const tmp = campaignInfo.product;
    if (tmp !== undefined && tmp !== '') setService(tmp);
    else setService('not selected');
  }, [campaignInfo]);

  return (
    <div className="h-full w-full">
      <div className="flex lg:flex-row flex-col gap-2 min-h-screen bg-gradient-to-b from-[#F1FDFF] to-[#F5D9FF] items-center lg:items-start md:pl-[100px] lg:pl-[100px] md:pr-[20px] lg:pr-[20px] p-4 lg:p-0">
        <ErrorToast
          open={error}
          onClose={() => setError(false)}
          message="Error Fill Your Brand First"
        />
        <Sidebar currentStep={currentStep} />

        <div className="flex lg:flex-row w-full md:w-[95%] lg:w-[1024px] flex-col mx-auto gap-4">
          <div className="w-full lg:w-1/3 grow">
            <CampaignStepsBar
              timing={timing}
              service={service}
              currentStep={currentStep}
              campaignInfo={campaignInfo as any}
            />
          </div>
          <div className="w-full lg:w-2/3 grow lg:grow-0">
            <CustomComponent
              title={customComponentData[currentStep - 1].title}
              subtitle={customComponentData[currentStep - 1].subtitle}
            >
              {currentStep === 1 && <PurposeForm handleNext={handleNext} />}
              {currentStep === 2 && (
                <ServiceForm
                  handleNext={handleNext}
                  handleBack={handleBack}
                  setService={setService}
                />
              )}
              {currentStep === 3 && (
                <AudienceForm handleNext={handleNext} handleBack={handleBack} />
              )}
              {currentStep === 4 && (
                <TimingForm handleNext={handleNext} handleBack={handleBack} setTiming={setTiming} />
              )}
              {currentStep >= 5 && (
                <CampaignBriefForm
                  setTiming={setTiming}
                  setService={setService}
                  setCurrentStep={setCurrentStep}
                  handleBack={handleBack}
                  handleApprove={handleNext}
                />
              )}
            </CustomComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
