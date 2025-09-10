import React from 'react';
// import { Link } from "react-router-dom";
import { MdCalendarToday } from 'react-icons/md';
import { GoClock } from 'react-icons/go';
import { FaRegBuilding } from 'react-icons/fa6';
// import CampaignReviewButton from '../dashboard/CampaignReviewButton';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface CampaignHeaderProps {
  title: string;
  service: string;
  timeFrame: string;
  currentTab: number;
  postingSchdule: string;
  handleNavigate: () => void;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  title,
  service,
  timeFrame,
  postingSchdule,
  handleNavigate,
}) => {
  const Description = [
    '',
    'Your campaign content is here!  Quickly review thumbnails for each day below or click on a day to review, edit or approve all posts.',
    '',
    'Let’s get your campaign content out to your audience. Select the range to download and click export below.',
  ];
  return (
    <div className="flex flex-col lg:flex-row justify-between">
      <div className="flex flex-col justify-between gap-3">
        <h1
          className="flex items-center gap-2  hover:cursor-pointer
            text-purple-700 text-2xl font-semibold leading-9 underline"
          onClick={handleNavigate}
        >
          {title}{' '}
          <span>
            <FaExternalLinkAlt className="w-4" />
          </span>
        </h1>
        <p className="text-sm my-1">{Description[1]}</p>
        {/* <p className="text-sm my-1">
          <span className="font-bold">Brand, Service or Product:</span>{" "}
          {service} | {timeFrame}
        </p> */}
        <div>
          <div className="flex flex-row gap-2 items-center">
            <MdCalendarToday />
            <span className="text-sm my-1 font-normal text-purple-700 underline">
              Campaign Date: {timeFrame}
            </span>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <GoClock />
            <span className="text-sm my-1 font-normal">Posting Schedule: {postingSchdule}</span>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <FaRegBuilding />
            <span className="text-sm my-1 font-normal">Service: {service}</span>
          </div>
        </div>
      </div>
      {/* <Link
        to="/dashboard"
        className="bg-[#5145CD] mb-1 lg:mb-0 text-white justify-center rounded-md text-sm flex items-center w-36 h-12"
      >
        All Campaigns
      </Link> */}
    </div>
  );
};

export default CampaignHeader;
