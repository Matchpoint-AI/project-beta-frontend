import React, { useContext, useRef } from 'react';
import { CampaignContext } from '../features/campaign/context/CampaignContext';
import dayjs from 'dayjs';

export default function CampaignSchedule() {
  const { campaignInfo } = useContext(CampaignContext);
  const startingDays = useRef<string[]>(
    (() => {
      const days = [];
      const duration = campaignInfo?.durationNum ?? 0;

      for (let i = 0; i < duration; i++) {
        const date = dayjs(campaignInfo?.start_date).add(i, 'weeks');
        const month = date.format('MMMM');
        const day = date.get('D');

        days.push(`${month} ${day}`);
      }

      return days;
    })()
  );

  return (
    <>
      {startingDays.current && (
        <div className="p-5 mb-[14px] rounded-md w-full bg-[#F6F5FF] border border-[#D1D5DB]">
          <div>
            <h1 className="capitalize text-[#42389D] font-medium text-lg leading-7 mb-1">
              Deliverables
            </h1>
            <ul className="list-disc font-bold pl-8">
              {Array.from({
                length: campaignInfo?.durationNum ?? 0,
              }).map((x, i) => (
                <li key={i}>
                  <span className="capitalize">campaign week {i + 1}</span>{' '}
                  <span className="font-normal">
                    - {(campaignInfo?.frequency ?? 0) * 7} total files delivered by{' '}
                    {startingDays.current[i]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
