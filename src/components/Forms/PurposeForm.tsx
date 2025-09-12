import React, { FormEventHandler, useContext, useEffect, useRef, useState } from 'react';
import { CampaignContext } from '../../features/campaign/context/CampaignContext';
import FormsContainer from '../../../shared/components/layout/FormsContainer';
import NextButton from '../../shared/components/buttons/NextButton';
import WebsiteOwnership from '../WebsiteOwnership';
import CampaignFormInput from '../../shared/components/inputs/CampaignFormInput';
import Dropdown from '../../features/campaign/components/CampaignDropdown';
import LanguageSelector from '../../features/campaign/components/LanguageSelector';
import { BrandContext } from '../../features/brand/context/BrandContext';
import { useAuth } from '../../features/auth/context/AuthContext';
import posthog from '../../helpers/posthog';

interface PurposeFormProps {
  handleNext?: (step?: number) => void;
  review?: boolean;
}

const PurposeForm = ({ handleNext, review = false }: PurposeFormProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { campaignInfo, setCampaignInfo } = useContext(CampaignContext);
  const { businessInfo } = useContext(BrandContext);
  const [purpose, setPurpose] = useState(campaignInfo?.purpose ?? 'Make customers aware/excited');
  const [purposeAbout, setPurposeAbout] = useState(
    campaignInfo?.purposeAbout ?? "Our business's brand"
  );
  const [name, setName] = useState(campaignInfo.name ?? '');
  const [selectedLanguage, setSelectedLanguage] = useState(campaignInfo.language ?? 'en');
  const [error, setError] = useState<boolean | null>(null);
  const [openPurpose, setOpenPurpose] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);
  const { profile } = useAuth();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!campaignInfo.name || campaignInfo.name === '') {
      setError(true);
      return;
    }
    // Save the selected language to campaign info
    setCampaignInfo((prev) => ({
      ...prev,
      language: selectedLanguage,
    }));

    if (purposeAbout === "Our business's brand") {
      setCampaignInfo((prev) => ({
        ...prev,
        product: businessInfo.name,
        language: selectedLanguage,
        // productDescription,
      }));
      handleNext?.(2);
    } else handleNext?.();
    if (posthog.__loaded) {
      posthog.capture('Campaign Step Completed', {
        distinct_id: profile?.id,
        step: 1, // Replace with actual step number
      });
    }
  };

  const handleOpenDropdown = (target: 'purpose' | 'about') => {
    if (target === 'purpose') {
      setOpenPurpose(!openPurpose);
      setOpenAbout(false);
    }
    if (target === 'about') {
      setOpenAbout(!openAbout);
      setOpenPurpose(false);
    }
  };

  useEffect(() => {
    setCampaignInfo((prev) => ({
      ...prev,
      purpose: purpose,
    }));
    setPurposeAbout(purposeOptions[0]);
  }, [purpose]);

  useEffect(() => {
    setCampaignInfo((prev) => ({
      ...prev,
      purposeAbout: purposeAbout,
    }));
  }, [purposeAbout]);

  useEffect(() => {
    if (campaignInfo?.name) setName(campaignInfo?.name);
    if (campaignInfo?.purpose) setPurpose(campaignInfo?.purpose);
    if (campaignInfo?.purposeAbout) setPurposeAbout(campaignInfo?.purposeAbout);
  }, [campaignInfo]);

  const { current: campaignPurpose } = useRef([
    'Make customers aware/excited',
    'Drive customers to convert/use',
  ]);
  const { current: purposeOptions } = useRef([
    "Our business's brand",
    "Our business's services or products",
  ]);

  return (
    <>
      <FormsContainer>
        <form id="purpose_form" onSubmit={handleSubmit}>
          <div className="mb-5">
            <h2 className="mb-2 text-lg md:text-xl font-medium text-gray-900">
              What do you want to name your campaign?
            </h2>
            <CampaignFormInput name={name} setName={setName} error={error} setError={setError} />
          </div>
          <div className="mb-5">
            <h2 className="mb-2 text-lg md:text-xl font-medium text-gray-900">
              What is your campaign&apos;s purpose?
            </h2>
            <p className="my-2 text-sm text-[#111928]">
              What do you want customers to know or do after seeing your campaign?
            </p>
            <Dropdown
              open={openPurpose}
              setOpen={() => handleOpenDropdown('purpose')}
              currentValue={purpose}
              options={campaignPurpose}
              onUpdateContext={(value: string) => {
                setCampaignInfo((prev) => ({
                  ...prev,
                  purpose: value,
                }));
                setPurpose(value);
              }}
              className="w-full"
            />
          </div>
          <div className="mb-5">
            <h2 className="mb-2 text-lg md:text-xl font-medium text-gray-900">
              {purpose.includes('Make') ? `${purpose} About` : purpose}
            </h2>
            <Dropdown
              open={openAbout}
              setOpen={() => handleOpenDropdown('about')}
              currentValue={purposeAbout}
              options={purposeOptions}
              onUpdateContext={(value: string) => {
                setCampaignInfo((prev) => ({
                  ...prev,
                  purposeAbout: value,
                }));
                setPurposeAbout(value);
              }}
              className="w-full"
            />
          </div>
          <div className="mb-5">
            <h2 className="mb-2 text-lg md:text-xl font-medium text-gray-900">Content Language</h2>
            <p className="mb-2 text-sm text-[#111928]">
              Select the primary language for your campaign content
            </p>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={(languageCode) => {
                setSelectedLanguage(languageCode);
                setCampaignInfo((prev) => ({
                  ...prev,
                  language: languageCode,
                }));
              }}
              className="w-full"
            />
          </div>
        </form>
      </FormsContainer>
      <WebsiteOwnership />
      {!review && (
        <div className="flex justify-between mb-10 w-full">
          <NextButton text="Next" formId="purpose_form" />
        </div>
      )}
    </>
  );
};

export default PurposeForm;
