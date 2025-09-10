/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEventHandler, useContext, useEffect, useState } from 'react';
import { CampaignContext } from '../../context/CampaignContext';
import Dropdown from '../../shared/components/ui/Dropdown';

import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FormsContainer from '../shared/FormsContainer';
import BackButton from '../../shared/components/buttons/BackButton';
import NextButton from '../../shared/components/buttons/NextButton';
import posthog from '../../helpers/posthog';
import { useAuth } from '../../features/auth/context/AuthContext';

interface TimingFormProps {
  handleNext?: any;
  handleBack?: any;
  setTiming?: React.Dispatch<React.SetStateAction<string>>;
  review?: boolean;
}

const TimingForm = ({ handleNext, handleBack, setTiming, review = false }: TimingFormProps) => {
  const { campaignInfo, setCampaignInfo }: any = useContext(CampaignContext);
  const [value, setValue] = React.useState<Dayjs | null>(null);
  // const [open, setOpen] = React.useState<boolean>(false);
  const { profile } = useAuth();
  const [duration, setDuration] = useState<string>(campaignInfo?.duration ?? '1 Week');
  const [postingFrequency, setPostingFrequency] = useState<string>(
    campaignInfo?.postingFrequency ?? '3 posts per day'
  );
  const [deliveryDay, setDeliveryDay] = useState<string>(campaignInfo?.deliveryDay ?? 'Monday');

  const convertToNumber = (str: string) => {
    // Extract the number from the beginning of the string
    const numberMatch = str.match(/^\d+/);

    // If a number is found, return it as a number type
    if (numberMatch) {
      return parseInt(numberMatch[0], 10);
    }

    // If no number is found, return 0 or handle it as needed
    return 0;
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (posthog.__loaded) {
      posthog.capture('Campaign Step Completed', {
        distinct_id: profile?.id,
        step: 4,
      });
    }
    handleNext();
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
  const formatMonthDayYear = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      // month: "short",
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

  const displayPeriod = (startDate: string, duration: string): string => {
    // if (status === "DRAFT") return "";
    const [month, day, year] = startDate.split('/').map(Number);
    const start = new Date(year, month - 1, day);
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
    // const weekNumber = Math.ceil((start.getDate() - 1 + durationValue * 7) / 7);
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
      return `${duration}, ${dateRange}`;
    } else {
      return `Week ${weekNumber} of ${durationValue}, ${dateRange}`;
    }
  };
  useEffect(() => {
    const date = value?.format('MM/DD/YYYY');
    if (date === undefined) return;
    setCampaignInfo((prev: any) => ({ ...prev, startDate: date }));
    if (setTiming) {
      const info = displayPeriod(date, duration);
      setTiming(info);
    }
  }, [value]);
  useEffect(() => {
    const durationNum = convertToNumber(duration);
    setCampaignInfo((prev: any) => ({
      ...prev,
      duration: duration,
      durationNum: durationNum,
    }));
    if (setTiming) {
      const date = value?.format('MM/DD/YYYY');
      if (date === undefined) return;
      const info = displayPeriod(date, duration);
      setTiming(info);
    }
  }, [duration]);

  useEffect(() => {
    const frequency = convertToNumber(postingFrequency);
    setCampaignInfo((prev: any) => ({
      ...prev,
      postingFrequency: postingFrequency,
      frequency: frequency,
    }));
  }, [postingFrequency]);

  useEffect(() => {
    setCampaignInfo((prev: any) => ({
      ...prev,
      deliveryDay: deliveryDay,
    }));
  }, [deliveryDay]);

  useEffect(() => {
    if (campaignInfo.startDate === undefined) return;
    console.log('oldDate === ', campaignInfo.startDate);
    const oldDate = dayjs(campaignInfo.startDate);
    console.log('oldDateDayjs === ', oldDate);
    setValue(oldDate);
  }, []);

  const handleDatePicker = (e: any) => {
    e.stopPropagation();
  };
  return (
    <>
      <FormsContainer>
        <form id="timing_form" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label title="email" className="block mb-2 text-xl font-medium text-gray-900">
              Campaign Start Date
            </label>
            {/* <p className="my-2 text-sm text-[#111928]">
                     This will be used to determine your visual and copy content
                  </p> */}
            <div className="relative" onClick={handleDatePicker}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{
                    '.MuiOutlinedInput-root': {
                      height: '41px',
                      margin: 0,
                      borderRadius: '8px',
                    },
                  }}
                  // open={open}
                  className="w-full"
                  value={value}
                  onChange={(newValue: any) => setValue(newValue)}
                  shouldDisableDate={(date) => {
                    // Disable dates before today
                    return dayjs(date).isBefore(dayjs().add(1, 'day'), 'day');
                  }}
                  // onClick={(e) => console.log("clicked icon")}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="mb-5">
            <label title="email" className="block mb-2 text-xl font-medium text-gray-900">
              Campaign Duration
            </label>
            <Dropdown
              currentValue={duration}
              options={['1 Week', '2 Weeks', '3 Weeks', '4 Weeks', '5 Weeks', '6 Weeks']}
              onUpdateContext={
                (value: string) => setDuration(value)
                // setCampaignInfo((prev) => ({ ...prev, duration: value }))
              }
              className="w-full"
            />
            <div className="flex items-center gap-4 bg-[#EBF5FF] py-1 px-1 rounded-md my-2">
              <img src="/sparkles.svg" alt="location" className="w-5 h-5" />
              <p className="text-sm text-[#1C64F2]">Recommendation: min 3 weeks</p>
            </div>
          </div>
          <div className="mb-5">
            <label title="email" className="block mb-2 text-xl font-medium text-gray-900">
              Date Posting Frequency
            </label>
            <Dropdown
              currentValue={postingFrequency}
              options={[
                '1 post per day',
                '2 posts per day',
                '3 posts per day',
                '4 posts per day',
                '5 posts per day',
                '6 posts per day',
              ]}
              onUpdateContext={
                (value: string) => setPostingFrequency(value)
                // setCampaignInfo((prev) => ({ ...prev, postingFrequency: value }))
              }
              className="w-full"
            />
            <div className="flex items-center gap-4 bg-[#EBF5FF] py-1 px-1 rounded-md my-2">
              <img src="/sparkles.svg" alt="location" className="w-5 h-5" />
              <p className="text-sm text-[#1C64F2]">Recommendation: min 3 posts per day</p>
            </div>
          </div>
          <div className="mb-5">
            <label title="email" className="block mb-2 text-xl font-medium text-gray-900">
              Content Delivery Day
            </label>
            <p className="my-2 text-sm text-[#111928]">We deliver content in weekly batches</p>
            <Dropdown
              currentValue={deliveryDay}
              options={[
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
              ]}
              onUpdateContext={
                (value: string) => setDeliveryDay(value)
                // setCampaignInfo({ ...campaignInfo, deliveryDay: value })
              }
              className="w-full"
            />
            {/* <div className="flex items-center gap-4 bg-[#EBF5FF] py-1 px-1 rounded-md my-2">
              <img src="/sparkles.svg" alt="location" className="w-5 h-5" />
              <p className="text-sm text-[#1C64F2]">Recommendation: Thursday</p>
            </div> */}
          </div>
        </form>
      </FormsContainer>
      {!review && (
        <div className="flex justify-between mb-10 w-full">
          <BackButton onClick={() => handleBack()} />
          <NextButton text="Next" formId="timing_form" />
        </div>
      )}
    </>
  );
};

export default TimingForm;
