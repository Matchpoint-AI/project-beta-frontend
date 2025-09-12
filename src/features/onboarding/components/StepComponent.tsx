import React, { useContext } from 'react';
import { BrandContext } from '../../features/brand/context/BrandContext';

interface StepProps {
  title: string;
  icon: string;
  step: number;
  currentStep: number;
  setStep: (step: number) => void;
}

const StepComponent: React.FC<StepProps> = ({ title, icon, step, currentStep, setStep }) => {
  const { businessInfo } = useContext(BrandContext);
  const headers = ['', 'Nice name', 'Brand Guidelines are good!', "Let's Review"];

  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const descriptions = [
    '',
    'Business info is locked. Keep going!',
    'The logo, colors and look of your brand make you recognizable and memorable',
    "Let's make sure we’ve gotten to know you well.",
  ];
  return (
    <button
      disabled={step >= currentStep}
      onClick={() => setStep(step)}
      className="flex flex-col justify-center py-4 space-y-2"
    >
      <div className={`flex items-center`}>
        {/* Step Icon */}
        <div className="mr-2">
          <img
            src={
              currentStep === step
                ? `/src/assets/icons/${icon}_active.svg`
                : `/src/assets/icons/${icon}_gray.svg`
            }
            alt={icon}
            width={20}
            height={20}
          />
        </div>
        {/* Step Title */}
        <p
          className={`text-sm ${
            currentStep === step && step >= currentStep
              ? 'text-[#5145CD] font-bold'
              : 'font-normal text-[#747474]'
          }`}
        >
          {title}
        </p>
      </div>
      {currentStep === step && (
        <div>
          <div className="flex flex-row">
            <p className="text-lg font-semibold text-gray-900">
              {headers[currentStep]}
              {currentStep === 1 && businessInfo.name !== undefined && businessInfo.name !== '' && (
                <span className="text-lg font-semibold text-indigo-700">
                  ,{` ${capitalizeFirstLetter(businessInfo.name)}!`}
                </span>
              )}
            </p>
          </div>
          <p className="text-md font-light text-left">{descriptions[currentStep]}</p>
        </div>
      )}
    </button>
  );
};

export default StepComponent;
