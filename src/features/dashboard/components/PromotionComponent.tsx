// src/features/dashboard/components/PromotionComponent.tsx

import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CampaignContext } from '../../../features/campaign/context/CampaignContext';
import CardStats from './CardStats';
import CampaignReviewButton from './CampaignReviewButton';
import handleNavigate from '../../../helpers/handleNavigate';
import { useAuth } from '../../auth/context/AuthContext';
import { GiElectric } from 'react-icons/gi';
import CampaignThreadWin from '../../campaign/components/CampaignThreadWin';
import useFetchThreadMessages from '../../../hooks/useFetchThreadMessages';
import { CircularProgress } from '@mui/material';

interface Campaign {
  campaign_id: string;
  thread_id?: string;
  status: string;
  timestamp?: string;
  campaign_data: {
    campaign_variables: {
      name: string;
      product_service: string;
      start_date: string;
      duration: string;
      audience_ethnicity: string[];
      emotion: string[];
      audience_interests: string[];
      product_service_description: string;
      purpose_topic: string;
      scene: string[];
      currentStep: number;
      key_feature: string[];
      purpose: string;
      audience_gender: string[];
      audience_age: string[];
      postingFrequency: number;
      deliveryDay: string;
      summary: string;
    };
  };
}

interface PromotionComponentProps {
  campaign: Campaign;
  status: string;
}

const PromotionComponent: React.FC<PromotionComponentProps> = ({ campaign, status }) => {
  const { setCampaignInfo } = useContext(CampaignContext);
  const { profile } = useAuth();
  const [loadingMessages, setLoadingMessage] = useState(false);
  const [messages, openThreadWin, setOpenThreadWin, fetchMessages, addMessage, popMessage] =
    useFetchThreadMessages();

  const handleOpenThreadWin = async (thread_id: string) => {
    setLoadingMessage(true);
    await fetchMessages(thread_id);
    setLoadingMessage(false);
  };

  const capitalizeFirstLetterOfEachWord = (str: string | undefined) => {
    if (!str) return '';
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const title = capitalizeFirstLetterOfEachWord(campaign?.campaign_data?.campaign_variables?.name);

  const formatMonthDayYear = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatMonth = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatFullDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const calculateWeekNumber = (startDate: Date, durationWeeks: number): number => {
    const now = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationWeeks * 7);

    // Calculate the difference in milliseconds
    const daysBetween = Math.ceil((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

    // Calculate the week number
    return Math.ceil(daysBetween / 7);
  };

  const displayPeriod = (startDate: string | undefined, duration: string | undefined): string => {
    if (!startDate || !duration || status === 'Draft') return '';
    const [month, day, year] = startDate.split('/').map(Number);
    const start = new Date(year, month - 1, day);
    const tmp = campaign?.campaign_data?.campaign_variables?.product_service || '';
    // Parse the duration
    const durationParts = duration.split(' ');
    const durationValue = Number(durationParts[0]);
    const durationUnit = durationParts[1].toLowerCase(); // e.g., "weeks"

    // Calculate the end date
    let end: Date;
    if (durationUnit === 'weeks' || durationUnit === 'week') {
      end = new Date(start);
      end.setDate(start.getDate() + durationValue * 7); // Add duration in days
    } else {
      throw new Error(`Unsupported duration unit: ${durationUnit}`);
    }
    const now = new Date();
    // Calculate week number
    const isCompleted = now >= end;
    const weekNumber = isCompleted ? durationValue : calculateWeekNumber(start, durationValue);

    const startMonth = formatMonth(start);
    const startDayMonth = formatMonthDayYear(start);
    const endDayMonth = formatMonthDayYear(end);
    const startYear = formatFullDate(start);
    const endYear = formatFullDate(end);

    // Format date range
    let dateRange: string;
    if (startYear === endYear) {
      if (start.getMonth() === end.getMonth()) {
        dateRange = `${startMonth} ${startDayMonth} - ${endDayMonth}, ${startYear}`;
      } else {
        dateRange = `${startMonth} ${startDayMonth} - ${endDayMonth}, ${startYear}`;
      }
    } else {
      dateRange = `${startMonth} ${startDayMonth}, ${startYear} - ${endDayMonth}, ${endYear}`;
    }

    if (isCompleted || weekNumber <= 0) {
      return `${tmp} | ${duration} | ${dateRange}`;
    } else {
      return `${tmp} | Week ${weekNumber} of ${durationValue} | ${dateRange}`;
    }
  };

  const info = displayPeriod(
    campaign?.campaign_data?.campaign_variables?.start_date,
    campaign?.campaign_data?.campaign_variables?.duration
  );

  const navigate = useNavigate();
  const statusColor = () => {
    let color;
    if (status === 'Current') color = 'text-[#0E9F6E]';
    else if (status === 'Past') color = 'text-[#D61F69]';
    else if (status === 'Inactive') color = 'text-[#111928]';
    else if (status === 'Draft') color = 'text-orange-700';
    return color;
  };

  const handleDraft = () => {
    const data = campaign.campaign_data.campaign_variables;
    setCampaignInfo((prev) => ({
      ...prev,
      name: data.name,
      product: data.product_service,
      audienceRace: data.audience_ethnicity,
      audienceEmotion: data.emotion,
      audienceInterests: data.audience_interests,
      productDescription: data.product_service_description,
      purpose: data.purpose_topic,
      locations: data.scene,
      currentStep: data.currentStep,
      product_features: data.key_feature,
      purposeAbout: data.purpose,
      audienceGender: data.audience_gender,
      audienceAgeRange: data.audience_age,
      startDate: data.start_date,
      duration: data.duration,
      postingFrequency: data.postingFrequency,
      deliveryDay: data.deliveryDay,
      campaign_id: campaign.campaign_id,
      summary: data.summary,
    }));
    handleNavigate(profile?.id ?? '', '/campaign', navigate);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md w-full flex flex-col lg:flex-row lg:justify-between lg:items-center justify-start border border-gray-400 relative">
      <div>
        <h1 className={`text-sm  ${statusColor()} font-medium mb-2 uppercase`}>{status}</h1>
        {status !== 'Draft' ? (
          <Link
            to={`/campaign/content/${campaign.campaign_id}`}
            className="text-2xl text-[#362F78] font-semibold mb-2"
          >
            {title}
          </Link>
        ) : (
          <h1
            className="text-2xl text-[#362F78] font-semibold mb-2 hover:cursor-pointer"
            onClick={handleDraft}
          >
            {title}
          </h1>
        )}
        {info !== '' && <p className="text-lg font-normal text-gray-900 mb-4">{info}</p>}
        {status !== 'Draft' && <CardStats id={campaign.campaign_id} />}
      </div>
      <div className="mt-4 flex lg:justify-center">
        {status === 'Draft' ? (
          <button
            onClick={handleDraft}
            className="text-[#5145CD] border border-[#5145CD] text-sm px-2 py-1 rounded-md mr-2 w-32 h-9"
          >
            Continue
          </button>
        ) : (
          <>
            <CampaignReviewButton campaign={campaign} />
            <button
              onClick={() =>
                handleNavigate(
                  profile?.id ?? '',
                  `/campaign/content/${campaign.campaign_id}`,
                  navigate
                )
              }
              className="text-[#5145CD] border border-[#5145CD] text-sm px-2 py-1 rounded-md  h-9"
            >
              Content Library
            </button>
          </>
        )}
      </div>
      {campaign.thread_id && profile?.role === 'ADMIN' && (
        <button
          className="absolute top-5 right-5"
          onClick={() => handleOpenThreadWin(campaign?.thread_id ?? '')}
          disabled={loadingMessages}
        >
          {loadingMessages ? (
            <CircularProgress
              sx={{ color: '#42389D' }}
              size={18}
              thickness={5}
              className="mx-auto mb-5"
            />
          ) : (
            <GiElectric color="#5145CD" size={25} />
          )}
        </button>
      )}
      <CampaignThreadWin
        open={openThreadWin}
        onClose={() => setOpenThreadWin(false)}
        messages={messages}
        addMessage={addMessage}
        popMessage={popMessage}
      />
    </div>
  );
};

export default PromotionComponent;
