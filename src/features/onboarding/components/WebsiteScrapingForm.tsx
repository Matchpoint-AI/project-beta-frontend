import React, { useState, useContext } from 'react';
import { BrandContext } from '../../brand/context/BrandContext';
import scrapeBrandWebsite from '../../brand/utils/scrapeBrandWebsite';
import WorkflowProgressTracker from '../../brand/components/WorkflowProgressTracker';
import { useAuth } from '../../auth/context/AuthContext';
// import { ConnectInstagram } from "./ConnectToInstagram";
import { ScrapeWebsiteBtn } from '../../brand/components/ScrapeWebsiteBtn';
import isUrl from 'is-url';
import BusinessFormInput from '../../../shared/components/inputs/BusinessFormInput';
import ErrorToast from '../../../shared/components/feedback/ErrorToast';

export default function WebsiteScrapingForm() {
  const { businessInfo, setBusinessInfo, updateWorkflowState, clearWorkflow } =
    useContext(BrandContext);
  const { profile } = useAuth();
  const [runValidation, setRunValidation] = useState(0);
  const [nameError, setNameError] = useState({ count: 0, error: false });
  const [websiteError, setWebsiteError] = useState({ count: 0, error: false });
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
    if (!profile?.token) {
      setScrapingError(true);
      return;
    }

    try {
      // Clear any existing workflow state
      clearWorkflow();

      // Initialize workflow state
      updateWorkflowState({
        isActive: true,
        currentStep: 'crawling',
        progress: 0.1,
        progressMessage: 'Starting brand analysis...',
      });

      const onProgress = (step: string, progress?: number) => {
        updateWorkflowState({
          isActive: true,
          currentStep: step.includes('crawling')
            ? 'crawling'
            : step.includes('analyzing')
              ? 'analyzing'
              : 'completed',
          progress: progress || 0.5,
          progressMessage: step,
        });
      };

      await scrapeBrandWebsite(businessInfo, setBusinessInfo, {
        token: profile.token,
        onProgress,
        maxPages: 50,
      });

      // Mark workflow as completed
      updateWorkflowState({
        isActive: false,
        currentStep: 'completed',
        progress: 1.0,
        progressMessage: 'Analysis complete!',
      });
    } catch (e) {
      updateWorkflowState({
        isActive: false,
        currentStep: 'failed',
        progress: 0,
        error: e instanceof Error ? e.message : 'Analysis failed',
      });
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
        title="What's the business called?"
        placeholder="Company name"
        type="text"
        validateInput={validateName}
        runValidation={runValidation}
        setFormError={setNameError}
      />
      <BusinessFormInput
        subject="website"
        title="Add the business website"
        description="We'll import info on your brand, products and audience"
        placeholder="Company website"
        type="link"
        validateInput={validateWebsite}
        runValidation={runValidation}
        setFormError={setWebsiteError}
      />

      {/* Progress Tracker */}
      <WorkflowProgressTracker workflow={businessInfo.workflow} />

      <ScrapeWebsiteBtn
        handleSubmit={submitBrandData}
        nameError={nameError}
        websiteError={websiteError}
        progressDescription={businessInfo.workflow?.progressMessage || ''}
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
