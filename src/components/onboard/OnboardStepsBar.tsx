import PhoneNavIcons from '../shared/PhoneNavIcons';
import ProgressBar from '../../shared/components/ui/ProgressBar';
import StepComponent from './StepComponent';
import React, { useEffect } from 'react';

export default function OnboardStepsBar({
  currentStep,
  setStep,
}: {
  currentStep: number;
  setStep: (step: number) => void;
}) {
  const headers = ['', 'Nice name', 'Brand Guidelines are good!', "Let's Review"];
  const descriptions = [
    '',
    'Business info is locked. Keep going!',
    'The logo, colors and look of your brand make you recognizable and memorable',
    "Let's make sure we’ve gotten to know you well",
  ];

  useEffect(() => {
    console.log('steps bar');
  }, []);

  return (
    <>
      {/* this is the steps bar for large screens */}
      <div className={`hidden lg:flex flex-col w-fit mt-28 ${currentStep === 5 ? 'blur-md' : ''}`}>
        <div className="text-[#747474] w-[350px]">
          <div className="flex gap-6">
            <ProgressBar currentStep={currentStep} />
            <div className="flex flex-col divide-[#D1D5DB] divide-y">
              {/* <h1 className="text-sm font-extrabold mb-6">
                        Step {currentStep} of 4
                     </h1> */}
              <StepComponent
                title="Business Info"
                icon="briefcase"
                currentStep={currentStep}
                step={1}
                setStep={setStep}
              />
              <StepComponent
                title="Brand Info"
                icon="palette"
                currentStep={currentStep}
                step={2}
                setStep={setStep}
              />
              <StepComponent
                title="Review"
                icon="clipboard"
                currentStep={currentStep}
                step={3}
                setStep={setStep}
              />
              <StepComponent
                title="Start Campaign"
                icon="calendar"
                currentStep={currentStep}
                step={4}
                setStep={setStep}
              />
            </div>
          </div>
        </div>
      </div>
      {/* this is the steps bar for small screens */}
      <div className="lg:mt-28 mt-[100px] lg:hidden block w-full">
        <PhoneNavIcons currentStep={currentStep} />
        <div className="mt-5">
          <h2 className="text-lg font-semibold text-gray-900">{headers[currentStep]}</h2>
          <p className="">{descriptions[currentStep]}</p>
        </div>
      </div>
    </>
  );
}
