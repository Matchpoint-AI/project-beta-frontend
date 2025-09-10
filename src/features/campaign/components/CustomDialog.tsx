import React, { FC, useContext } from 'react';
import AudienceForm from '../Forms/AudienceForm';
// import CampaignSetupCompleteDialog from "./CampaignSetupCompleteDialog";
import PurposeForm from '../Forms/PurposeForm';
import ServiceForm from '../onboard/ServiceForm';
import TimingForm from '../Forms/TimingForm';
import { CampaignContext } from '../../../context/CampaignContext';

interface CustomDialogProps {
  setIsOpen: React.Dispatch<React.SetStateAction<number>>;
  isOpen: number;
  onClose: () => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setTiming: React.Dispatch<React.SetStateAction<string>>;
  setService: React.Dispatch<React.SetStateAction<string>>;
}

const CustomDialog: FC<CustomDialogProps> = ({
  // onClose,
  isOpen,
  setIsOpen,
  setTiming,
  // setCurrentStep,
  setService,
}: CustomDialogProps) => {
  // const [step, setStep] = React.useState(1);
  const {
    campaignInfo,
    // setCampaignInfo
  } = useContext(CampaignContext);

  const handleBack = () => {
    setIsOpen(0);
    // setCurrentStep(5);
  };
  console.log('opening the cusotm dialog');
  const handleNext = () => {
    setIsOpen(0);
    // setStep(step + 1);
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Dialog box */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        ></span>
        <div className="inline-block align-bottom rounded-lg text-left overflow-hidden transform transition-all w-[639px] my-10">
          {/* Your content goes here */}
          {isOpen === 1 && <PurposeForm review={true} />}
          {isOpen === 2 && <ServiceForm review={true} setService={setService} />}

          {isOpen === 3 && <AudienceForm review={true} />}
          {isOpen === 4 && <TimingForm review={true} setTiming={setTiming} />}
          {campaignInfo?.campaign_brief !== true ? (
            <div className="flex justify-between mb-10 w-full">
              <button
                type="button"
                className="h-12 flex items-center text-white bg-[#F98080] focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={handleBack}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-12 px-5 py-2.5 text-sm font-medium text-white bg-[#5145CD] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center"
                onClick={handleNext}
              >
                Save and update brief
              </button>
            </div>
          ) : (
            <div className="flex justify-end mb-10 w-full">
              <button
                type="button"
                className="h-12 px-5 py-2.5 text-sm font-medium text-white bg-[#5145CD] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center"
                onClick={handleBack}
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
