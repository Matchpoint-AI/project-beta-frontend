import React, { useContext, useEffect, useState } from 'react';
import { CampaignContext } from '../../features/campaign/context/CampaignContext';
import EditBlock from '../shared/EditBlock';
import ChipComponent from '../../shared/components/ui/ChipComponent';
import ChipsEditBlock from '../onboard/ChipsEditBlock';

interface CampaignContextType {
  campaignInfo: {
    product_features?: string[];
  };
  setCampaignInfo: (value: React.SetStateAction<CampaignContextType['campaignInfo']>) => void;
}

export default function KeyFeatures({ pros }: { pros: string[] }) {
  const { campaignInfo, setCampaignInfo } = useContext(CampaignContext) as CampaignContextType;

  const [features, setFeatures] = React.useState<string[]>(campaignInfo?.product_features ?? []);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setCampaignInfo((prev: CampaignContextType['campaignInfo']) => ({
      ...prev,
      product_features: features,
    }));
  }, [features]);

  useEffect(() => {
    if (!Array.isArray(pros)) {
      return;
    }
    setFeatures(pros);
  }, [pros]);

  const handleChipClose = (index: number) => {
    const newChips = Array.from(features);
    newChips.splice(index, 1);
    setFeatures(newChips);
  };

  return (
    <div className="p-[20px] rounded-lg mt-7">
      <div className="flex items-center">
        <h3 className="text-[#111928] font-semibold leading-6 capitalize">
          Key competitive service or product features
        </h3>

        <EditBlock disabled={edit} onClick={() => setEdit(true)} className="ml-auto" />
      </div>
      <p className="font-medium text-xs mb-5">
        What makes your service or product standout—feel free to edit/add more up to 3 total.
      </p>
      {!edit && (
        <div
          className="bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg flex items-center"
          style={{
            height: features.length > 0 ? 'fit-content' : '56px',
            padding: features.length > 0 ? '14px 16px' : '0px 16px',
          }}
        >
          <div className="block">
            {features?.map((feature, index) => (
              <ChipComponent
                key={index}
                label={feature}
                index={index}
                selected={true}
                onClose={handleChipClose}
                onSelect={() => {}}
                className="inline-block whitespace-normal my-[2px]"
              />
            ))}
          </div>
        </div>
      )}
      {edit && (
        <ChipsEditBlock
          max={3}
          initValues={features}
          saveValues={setFeatures}
          closeEdit={() => setEdit(false)}
        />
      )}
    </div>
  );
}
