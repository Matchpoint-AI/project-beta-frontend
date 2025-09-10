import React, { useState, useContext } from 'react';
import { BrandContext } from '../../context/BrandContext';
import scrapeBrandWebsite from '../../helpers/scrapeBrandWebsite';
// import { ConnectInstagram } from "./ConnectToInstagram";
import { ScrapeWebsiteBtn } from '../ScrapeWebsiteBtn';
import isUrl from 'is-url';
import BusinessFormInput from '../../shared/components/inputs/BusinessFormInput';
import ErrorToast from '../../shared/components/feedback/ErrorToast';

export default function WebsiteScrapingForm() {
  const { businessInfo, setBusinessInfo } = useContext(BrandContext);
  const [runValidation, setRunValidation] = useState(0);
  const [nameError, setNameError] = useState({ count: 0, error: false });
  const [websiteError, setWebsiteError] = useState({ count: 0, error: false });
  const [progressDescription, setProgressDescription] = useState('');
  const [scrapingError, setScrapingError] = useState(false);

  const validateWebsite = (website: string) => {
    if (!website || website === '') {
      return false;
    }
    if (!/^https?:\/\//i.test(website)) website = 'https://' + website;
    return isUrl(website);
  };

  const validateName = (name: string) => {
    if (name.trim() === '' || !/^[a-zA-Z0-9 ]*$/.test(name)) {
      return false;
    }
    return true;
  };

  const runScraping = async () => {
    try {
      setProgressDescription('Scraping Website...');
      await scrapeBrandWebsite(businessInfo, setBusinessInfo);
    } catch (e) {
      setScrapingError(true);
    }
  };

  const submitBrandData = () => {
    if (
      !businessInfo.name ||
      businessInfo.name === '' ||
      !businessInfo.website ||
      businessInfo.website === ''
    )
      setRunValidation((old) => old + 1);
    else {
      runScraping();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <BusinessFormInput
        subject="name"
        title="What’s the business called?"
        placeholder="Company name"
        type="text"
        validateInput={validateName}
        runValidation={runValidation}
        setFormError={setNameError}
      />
      <BusinessFormInput
        subject="website"
        title="Add the business website"
        description="We’ll import info on your brand, products and audience"
        placeholder="Company website"
        type="link"
        validateInput={validateWebsite}
        runValidation={runValidation}
        setFormError={setWebsiteError}
      />
      <ScrapeWebsiteBtn
        handleSubmit={submitBrandData}
        nameError={nameError}
        websiteError={websiteError}
        progressDescription={progressDescription}
        scrapingError={scrapingError}
      />
      <ErrorToast
        open={scrapingError}
        onClose={() => setScrapingError(false)}
        message="Error fetching data from the website! Try again later"
      />
    </div>
  );
}
