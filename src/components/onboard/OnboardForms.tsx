/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import { BrandContext } from '../../context/BrandContext';
import CustomComponent from '../campaign/CustomComponent';
import BrandForm from '../onboard/BrandForm';
import ReviewForm from '../onboard/ReviewForm';
import { CampaignContext } from '../../context/CampaignContext';
import OnboardStepsBar from '../onboard/OnboardStepsBar';
import { useAuth } from '../../features/auth/context/AuthContext';
import { getServiceURL } from '../../helpers/getServiceURL';
import BusinessForm from '../onboard/BusinessForm';
import ErrorToast from '../shared/ErrorToast';
import StepContainer from '../onboard/StepContainer';
import handleNavigate from '../../helpers/handleNavigate';

const Onboard = ({ edit = false }: any) => {
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [errorSaving, setErrorSaving] = useState(false);
  const { businessInfo, setBusinessInfo }: any = useContext(BrandContext);
  const { setCampaignInfo }: any = useContext(CampaignContext);
  const [saveAndStart, setSaveAndStart] = useState(false);
  const endpointUrl = getServiceURL('data');

  console.log('brand id', businessInfo.id);
  const navigate = useNavigate();

  const handleBack = () => {
    if (currentStep === 4) {
      setBusinessInfo((prev: any) => ({
        ...prev,
        summary: undefined,
        product_features: undefined,
      }));
    }
    if (currentStep > 2) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleNext = () => {
    console.log('step: ', currentStep);
    setCurrentStep((step) => step + 1);
  };

  const handleSave = async () => {
    const formData = new FormData();

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
    const hours = String(date.getHours()).padStart(2, '0'); // Add leading zero for single-digit hours
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Add leading zero for single-digit minutes
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Add leading zero for single-digit seconds

    const formattedDateTime = `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`;

    businessInfo.timestamp = formattedDateTime;

    const cleanBusinessInfo = {
      ...businessInfo,
      timestamp: formattedDateTime,
      values: businessInfo.values?.filter((t: any) => t?.selected).map((t: any) => t.label),
      toneAndVoice: businessInfo.toneAndVoice
        ?.filter((t: any) => t?.selected)
        .map((t: any) => t.label),
      persona: businessInfo.persona?.filter((t: any) => t?.selected).map((t: any) => t.label),
    };

    delete cleanBusinessInfo.brandLogo;
    let logoData = {};
    if (businessInfo?.brandLogo) {
      const fileDetails: any = await toBase64(businessInfo.brandLogo);
      logoData = {
        file: fileDetails.split(',')[1],
        type: businessInfo?.brandLogo?.type,
        fileName: businessInfo?.brandLogo?.name,
      };
    }

    const payload = {
      timestamp: {
        timestamp: businessInfo.timestamp,
      },
      biz_variables: {
        brand_name: businessInfo?.name,
        brand_website: businessInfo?.website,
        industry: businessInfo?.industry,
        vertical: businessInfo?.vertical,
      },
      brand_variables: {
        mission: businessInfo?.mission,
        values: businessInfo?.values?.filter((t: any) => t?.selected).map((t: any) => t.label),
        tov: businessInfo?.toneAndVoice?.filter((t: any) => t?.selected).map((t: any) => t.label),
        persona: businessInfo?.persona?.filter((t: any) => t?.selected).map((t: any) => t.label),
        products: businessInfo?.products,
        colors: businessInfo?.brandColors,
        brand_visual_style: businessInfo?.style,
        locations: businessInfo?.physical_locations,
        isFetched: businessInfo?.locations_fetched,
        checkzip: businessInfo?.checkZip,
        summary: businessInfo?.summary,
        scenes: businessInfo?.scenes,
        themes: businessInfo?.themes,
        negative_prompts: businessInfo?.negative_prompts,
        product_features: businessInfo?.product_features,
      },
      logo: logoData,
      campaigns: [], // Empty campaigns array
    };

    formData.append(
      'entity_json',
      JSON.stringify({
        entity_name: 'brand_data',
        entity_data: payload,
        brandId: String(businessInfo.id),
        isEdit: Boolean(edit),
      }),
    );

    setCampaignInfo((prev: any) => ({
      ...prev,
      brandLogo: businessInfo?.brandLogo,
    }));

    setSaveAndStart(true);

    fetch(endpointUrl + '/api/v1/data/brand', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${profile?.token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to post data');
        }
        return response.json();
      })
      .then((data: any) => {
        console.log('data from brand', data, data.id);
        setBusinessInfo({
          name: data?.biz_variables?.brand_name,
          website: data?.biz_variables?.brand_website,
          industry: data?.biz_variables?.industry,
          vertical: data?.biz_variables?.vertical,
          physical_locations: data?.brand_variables?.locations,
          locations_fetched: data?.brand_variables?.isFetched,
          checkZip: data?.brand_variables?.checkZip,
          brandColors: data?.brand_variables?.colors,
          values: data?.brand_variables?.values,
          toneAndVoice: data?.brand_variables?.tov,
          mission: data?.brand_variables?.mission,
          persona: data?.brand_variables?.persona,
          summary: data?.brand_variables?.summary,
          isSaved: true,
          logo: data?.biz_variables?.brand_logo,
          products: data?.brand_variables?.products,
          product_features: data?.brand_variables?.product_features,
          id: data.id,
        });
        setSaveAndStart(false);
        setCurrentStep(4);
      })
      .catch((error) => {
        console.error('Error posting data:', error);
        setErrorSaving(true);
        setSaveAndStart(false);
      });
  };

  const customComponentData = [
    {
      title: 'Tell us about your business',
      subtitle:
        "Enter some info about the business you'd like to advertise today and a bit about its brand.",
    },
    {
      title: 'Share your Brand guidelines, colors & logo',
      subtitle:
        "Sharing visual guidance for your brand helps us make content that matches your business's unique style.",
    },
    {
      title: 'Review your business & brand info',
      subtitle:
        "We'll use the below as the foundation of your campaign content made with Matchpoint.",
    },
    {
      title: 'Start Campaign',
      subtitle:
        "Please provide the primary name of the business or brand you'd like to build campaigns around.",
    },
  ];

  useEffect(() => {
    if (currentStep === 4) {
      handleNavigate(profile?.id || '', '/campaign', navigate);
    }
  }, [currentStep, navigate]);

  return (
    <div className="flex h-full flex-col max-w-6xl mx-auto gap-2">
      {currentStep === 1 && businessInfo.name === undefined && (
        <div className="flex flex-col  mt-32 md:mt-16">
          <h1 className=" text-[#5145CD] text-2xl font-bold">
            Welcome to Matchpoint <span className="capitalize">{profile?.name.split(' ')[0]}</span>,
            let&apos;s get started.
          </h1>
          {/* <h2 className="bg-gradient-to-r mt-16 bg-clip-text text-transparent from-[#681DBA] to-[#FF43E1] text-4xl font-extrabold">
                     Welcome to Matchpoint AI{" "}
                     <span className="capitalize">
                        {profile.name.split(" ")[0]}.
                     </span>
                  </h2> */}
          <h3 className=" text-md w-full mb-4">
            You&apos;ve got 3 steps and then boom – your campaign content is on the way!
          </h3>
          <div className="flex-wrap items-center justify-between grid grid-cols-1 md:grid-cols-3 gap-3">
            <StepContainer icon="/briefcase.svg" title="Business & Brand info">
              Ensures your campaign content is unique to you
            </StepContainer>
            <StepContainer icon="/palette_active.svg" title="Campaign Brief">
              Creates a guide that keeps your campaign targeted and timely
            </StepContainer>
            <StepContainer icon="/notes.svg" title="Campaign Content Review">
              Allows you to review and tweak your content as you like
            </StepContainer>
          </div>
        </div>
      )}
      <Sidebar currentStep={currentStep} />
      <div className="flex lg:flex-row flex-col">
        <div className="w-full lg:w-1/3">
          <OnboardStepsBar currentStep={currentStep} setStep={setCurrentStep} />
        </div>
        <div className="w-full lg:w-2/3">
          {currentStep !== 4 && (
            <>
              {/* <OnboardStepsBar currentStep={currentStep} /> */}
              <CustomComponent
                title={customComponentData[currentStep - 1].title}
                subtitle={customComponentData[currentStep - 1].subtitle}
              >
                {currentStep === 1 && <BusinessForm handleNext={handleNext} />}
                {currentStep === 2 && <BrandForm handleNext={handleNext} handleBack={handleBack} />}
                {currentStep === 3 && (
                  <ReviewForm
                    setFormStep={setCurrentStep}
                    handleSave={handleSave}
                    handleBack={handleBack}
                    saving={saveAndStart}
                  />
                )}
              </CustomComponent>
            </>
          )}
          {/* {currentStep === 4 && <StartCampaignDialog />} */}
        </div>
      </div>
      <ErrorToast
        message="Something wrong happened when saving, try again!"
        open={errorSaving}
        onClose={() => setErrorSaving(false)}
      />
    </div>
  );
};

export default Onboard;
