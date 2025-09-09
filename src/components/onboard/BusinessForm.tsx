import React, { FormEventHandler, useContext, useEffect, useState } from 'react';

import FormsContainer from '../shared/FormsContainer';
import { BrandContext } from '../../context/BrandContext';
import WebsiteOwnership from '../WebsiteOwnership';
import NextButton from '../shared/Buttons/NextButton';
import IndustryVertical from '../onboard/IndustryVertical';
import WebsiteScrapingForm from '../onboard/WebsiteScrapingForm';
import BrandDetails from '../onboard/BrandDetails';
// import { ConnectInstagram } from "../ConnectToInstagram";
import InstaConnect from '../shared/Buttons/InstaConnect';
import type { Selectable } from '../../context/BrandContext';

export default function BusinessForm({ handleNext }: { handleNext: () => void }) {
  const { businessInfo } = useContext(BrandContext);
  const [disableNext, setDisableNext] = useState(true);

  const checkValidity = () => {
    if (!businessInfo?.industry || !businessInfo?.website || !businessInfo?.name) return false;
    const values = (businessInfo?.values ?? []).filter((c: Selectable) => c.selected);
    const persona = (businessInfo?.persona ?? []).filter((c: Selectable) => c.selected);
    const toneAndVoice = (businessInfo?.toneAndVoice ?? []).filter((c: Selectable) => c.selected);

    if (
      businessInfo?.industry &&
      businessInfo?.vertical &&
      businessInfo?.mission &&
      values.length > 0 &&
      persona.length > 0 &&
      toneAndVoice.length > 0
    )
      return true;
    return false;
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (checkValidity()) handleNext();
  };

  useEffect(() => {
    setDisableNext(!checkValidity());
  }, [businessInfo]);

  return (
    <>
      <FormsContainer>
        <form id="business_form" onSubmit={handleSubmit}>
          <WebsiteScrapingForm />
          <InstaConnect
            stats={{ approved: 0, ready_for_review: 0 }}
            startDate={businessInfo?.start_date || ''}
            duration={businessInfo?.durationNum || 0}
          />
          {businessInfo.industry && businessInfo.vertical && <IndustryVertical />}
          {businessInfo.mission && <BrandDetails />}
        </form>
      </FormsContainer>
      <WebsiteOwnership />
      <div className="flex justify-between mb-10 w-full">
        <NextButton text="Next" formId="business_form" disabled={disableNext} />
      </div>
    </>
  );
}
