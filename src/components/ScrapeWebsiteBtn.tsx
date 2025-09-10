import React, { useState, useContext, MouseEventHandler, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { BrandContext } from '../context/BrandContext';
import { SparklesMessage } from './shared/SparklesMessage';

interface ErrorState {
  error: boolean;
  message?: string;
}

interface ScrapeWebsiteBtnProps {
  handleSubmit: () => void;
  nameError: ErrorState;
  websiteError: ErrorState;
  progressDescription: string;
  scrapingError: boolean;
}

export function ScrapeWebsiteBtn({
  handleSubmit,
  nameError,
  websiteError,
  progressDescription,
  scrapingError,
}: ScrapeWebsiteBtnProps) {
  const [showBtn, setShowBtn] = useState(true);
  const [scraping, setScraping] = useState(false);
  const { businessInfo } = useContext(BrandContext);

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    setScraping(true);
    handleSubmit();
  };

  useEffect(() => {
    if (nameError.error || websiteError.error || scrapingError) setScraping(false);
  }, [nameError, websiteError, scrapingError]);

  useEffect(() => {
    if (businessInfo.industry || businessInfo.vertical || businessInfo.physical_locations)
      setShowBtn(false);
  }, [businessInfo]);

  return (
    <>
      {showBtn && (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="bg-[#5145CD] hover:bg-[#6875F5] text-white text-sm h-10 w-[100px] rounded-lg font-bold flex items-center disabled:cursor-not-allowed justify-center"
            onClick={handleClick}
            disabled={scraping}
          >
            {scraping ? (
              <CircularProgress sx={{ color: '#ffffff' }} size={25} thickness={5} />
            ) : (
              'Start'
            )}
          </button>
        </div>
      )}
      {progressDescription !== '' && (
        <SparklesMessage loading={true}>
          Hold tight. Matchpoint is analyzing your business
        </SparklesMessage>
      )}
    </>
  );
}
