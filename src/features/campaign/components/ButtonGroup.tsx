import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import CampaignStats from "./CampaignStats";
// import CampaignReviewButton from "./CampaignReviewButton";
// import { useAuth } from "../../../features/auth/context/AuthContext";
// import { getServiceURL } from "../../../helpers/getServiceURL";
import InstaConnect from '../../../shared/components/buttons/InstaConnect';
import TabItems from './TabItems';
// import CardStats from "./CardStats";
import NewCardStats from '../../dashboard/components/NewCardStats';
import { CampaignInfoType } from '../../../features/campaign/context/CampaignContext';

interface Stats {
  approved: number;
  ready_for_review: number;
  total_posts: number;
}

interface ButtonGroupProps {
  campaign: CampaignInfoType;
  currentTab: number;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
  setApprovePopup: React.Dispatch<React.SetStateAction<boolean>>;
  stats: Stats;
  onApprove?: () => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  campaign,
  currentTab,
  setCurrentTab,
  setApprovePopup,
  stats,
  onApprove,
}) => {
  // const { profile } = useAuth();
  const { id } = useParams();
  // const endpointUrl = getServiceURL("data");
  // const [weeksData, setWeeksData] = useState([]);
  // const [hidden, setHidden] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (campaign !== undefined) {
      setStartDate(campaign?.campaign_data?.campaign_variables?.start_date || '');
      setDuration(campaign?.campaign_data?.campaign_variables?.durationNum || 0);
    }
  }, [campaign]);
  return (
    <div className={`flex flex-col gap-7`}>
      <NewCardStats id={id as string} stats={stats} />
      <div className="flex flex-col-reverse md:flex-row gap-4 justify-between w-full items-end md:items-center">
        <TabItems
          currentPage={currentTab}
          onPageChange={setCurrentTab}
          setApprovePopup={setApprovePopup}
          onApprove={onApprove}
        />
        <InstaConnect publish={true} stats={stats} startDate={startDate} duration={duration} />
      </div>
      {/* <div className="flex gap-2 bg-black self-end"></div> */}
    </div>
  );
};

export default ButtonGroup;
