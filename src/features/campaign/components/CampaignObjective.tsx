import React, { useContext } from 'react';
import { CampaignContext } from '../context/CampaignContext';

interface Props {
  title: string;
  objective: string;
  onEdit: () => void;
}

const CampaignObjective: React.FC<Props> = ({ title, objective, onEdit }) => {
  const { campaignInfo, setCampaignInfo }: any = useContext(CampaignContext);

  return (
    <div className="flex items-center gap-4 mb-2 p-4 bg-gray-100 rounded-md">
      <div className="flex items-center mb-2">
        <span className="mr-2 text-purple-600 bg-white w-10 h-10 rounded-full flex justify-center items-center">
          <img src="/bulb.svg" alt="sparkles" className="w-5 h-5" />
        </span>
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mb-2 text-xs">{objective}</p>
      </div>
      <button
        onClick={onEdit}
        className="w-12 h-5 text-white bg-[#5145CD] text-xs p-2 flex justify-center items-center rounded-sm hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-[#5145CD] focus:ring-opacity-50"
      >
        {campaignInfo.campaign_brief !== true ? 'EDIT' : 'VIEW'}
        {/* EDIT */}
      </button>
    </div>
  );
};

export default CampaignObjective;
