import React, { useContext, useEffect, useState } from 'react';
import BrandDetailsInput from '../../shared/components/inputs/BrandDetailsInput';
import PurpleButton from '../../shared/components/buttons/PurpleButton';
// import { TbArrowBackUp } from "react-icons/tb";
import { CampaignContext } from '../../campaign/context/CampaignContext';

interface ChipsEditBlockProps {
  initValues: string[];
  closeEdit: () => void;
  saveValues: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
  max: number;
  genre?: 'emotion' | 'interests';
}

export default function ChipsEditBlock({
  initValues,
  saveValues,
  closeEdit,
  className,
  max,
  genre,
}: ChipsEditBlockProps) {
  const { campaignInfo } = useContext(CampaignContext);
  const [values, setValues] = useState<string[]>(Array.from({ length: max }, () => ''));

  const handleRemove = (chipIndex: number) => {
    const newChips = Array.from(values);
    newChips[chipIndex] = '';
    setValues(newChips);
  };

  const handleChange = (chipIndex: number, value: string) => {
    setValues((old) => {
      const newValues = Array.from(old);
      newValues[chipIndex] = value;
      return newValues;
    });
  };

  const handleSave = () => {
    saveValues(values.filter((v) => v));
    closeEdit();
  };

  const handleReset = () => {
    if (campaignInfo.audienceEmotion && genre === 'emotion')
      setValues(campaignInfo.audienceEmotion);
    else if (campaignInfo.audienceInterests && genre === 'interests')
      setValues(campaignInfo.audienceInterests);
  };

  useEffect(() => {
    setValues((old) => {
      const newArr = Array.from(old);
      const chuncked = initValues?.splice(0, 3) || [];
      newArr.splice(0, chuncked.length, ...chuncked);
      return newArr;
    });
  }, [initValues]);

  return (
    <div className={className}>
      <div>
        {values.map((v, i) => {
          return (
            <div key={i} className="flex items-center justify-between gap-[10px] mb-5">
              <BrandDetailsInput value={v} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(i, e.target.value)} />
              <button type="button" onClick={() => handleRemove(i)}>
                <img src="/src/assets/icons/remove_tag.svg" alt="remove tag" />
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        {genre &&
          ((genre === 'emotion' && campaignInfo.audienceEmotion) ||
            (genre === 'interests' && campaignInfo.audienceInterests)) && (
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-3 flex items-center justify-center gap-2 border border-[#6B7280] rounded-lg disabled:cursor-not-allowed"
            >
              <span className="capitalize text-[#6B7280] font-medium text-sm">Reset</span>
            </button>
          )}
        <PurpleButton type="button" onClick={handleSave}>
          Save
        </PurpleButton>
      </div>
    </div>
  );
}
