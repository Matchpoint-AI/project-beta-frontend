import React, { useRef } from 'react';
import StepCampaignComponent from '../StepComponentCampaign';
import PhoneNavIcons from '../shared/PhoneNavIcons';
import { CampaignInfoType } from '../../context/CampaignContext';

interface CampaignStepsBar {
  currentStep: number;
  campaignInfo: CampaignInfoType;
  timing: string;
  service: string;
}

export default function CampaignStepsBar({
  currentStep,
  campaignInfo,
  timing,
  service,
}: CampaignStepsBar) {
  const { current: stepTitle } = useRef([
    'Campaign Creation',
    'Purpose',
    'Service of Product',
    'Audience',
    'Timing',
    'Review & Approve Brief',
  ]);

  const getTimingDisplay = () => {
    if (!timing || timing.includes('Invalid Date') || timing === 'Timing not selected') {
      return 'Timing not set';
    }
    let timingCleaned = timing.replace(/\b(\d+)\s+weeks?\b/gi, (_, num) => {
      const n = Number(num);
      return `${n} ${n === 1 ? 'week' : 'weeks'}`;
    });
    timingCleaned = timingCleaned.replace(/\b(week|weeks)\s+(week|weeks)\b/gi, '$1');
    return timingCleaned;
  };

  const getServiceDisplay = () => {
    if (!service || service.trim() === 'not selected' || service.trim() === '') {
      return 'Not selected yet';
    }
    return service;
  };

  const timingDisplay = getTimingDisplay();
  const serviceDisplay = getServiceDisplay();

  return (
    <>
      <div className={`hidden lg:flex flex-col w-fit mt-28 ${currentStep === 6 ? 'blur-md' : ''}`}>
        <div className="text-[#747474] w-[350px]">
          <h1 className="text-[#42389D] text-lg font-semibold leading-6 capitalize">
            {!campaignInfo.name || campaignInfo.name === '' ? 'campaign name' : campaignInfo.name}
          </h1>
          <p className="text-sm">
            <span className="font-bold">Brand/Service/Product: </span>
            {serviceDisplay} | {timingDisplay}
          </p>
          <div className="flex flex-col gap-4 my-10">
            <div className="flex">
              <div className="mr-2">
                <img src="/calendar_active.svg" alt="calendar" width={20} height={20} />
              </div>
              <p className="text-lg font-semibold text-[#5145CD]">Campaign Creation</p>
            </div>
            <StepCampaignComponent
              name="Purpose"
              title="Naming your campaign"
              description="This will help you find and manage your campaign in the future."
              isActive={currentStep === 1}
              currentStep={1}
              globalStep={currentStep}
            />
            <StepCampaignComponent
              name="Service or Product"
              isActive={currentStep === 2}
              currentStep={2}
              globalStep={currentStep}
            />
            <StepCampaignComponent
              name="Audience"
              isActive={currentStep === 3}
              currentStep={3}
              globalStep={currentStep}
            />
            <StepCampaignComponent
              name="Timing"
              isActive={currentStep === 4}
              currentStep={4}
              globalStep={currentStep}
            />
            <StepCampaignComponent
              name="Review & Approve Brief"
              isActive={currentStep === 5}
              currentStep={5}
              globalStep={currentStep}
            />
          </div>
        </div>
      </div>
      <div className="lg:mt-28 mt-[100px] lg:hidden block w-full">
        <div className="mb-3 lg:mb-0">
          <h1 className="bg-gradient-to-r bg-clip-text font-semibold text-transparent from-[#681DBA] to-[#FF43E1] text-2xl mb-1">
            {!campaignInfo.name || campaignInfo.name === '' ? 'Campaign name' : campaignInfo.name}
          </h1>
          <div className="text-sm">
            <span className="font-bold">Service: {serviceDisplay} | </span>
            <span>{timingDisplay}</span>
          </div>
        </div>
        <PhoneNavIcons currentStep={currentStep} />
        <div className="mt-5">
          <span className="font-semibold text-[#5145CD]">{stepTitle[currentStep - 1]}</span>
        </div>
      </div>
    </>
  );
}
