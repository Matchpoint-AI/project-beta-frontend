import React, { useContext, useEffect, useState } from 'react';
import BrandDetailsInput from './shared/Inputs/BrandDetailsInput';
import { Chip } from '../helpers/convertToChips';
import PurpleButton from './shared/Buttons/PurpleButton';
import { BrandContext } from '../context/BrandContext';

interface BrandDetailsEditBlockProps {
  category: 'mission' | 'persona' | 'values' | 'toneAndVoice';
  initValues: Chip[];
  closeEdit: () => void;
}

export default function BrandDetailsEditBlock({
  initValues,
  category,
  closeEdit,
}: BrandDetailsEditBlockProps) {
  const [values, setValues] = useState<Chip[]>(
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      label: '',
      selected: true,
    }))
  );
  const { businessInfo, setBusinessInfo } = useContext(BrandContext);

  const handleRemove = (chipIndex: number) => {
    const newChips = Array.from(values);
    newChips[chipIndex].label = '';
    setValues(newChips);
  };

  const handleChange = (chipIndex: number, value: string) => {
    setValues((old) => {
      const newValues = Array.from(old);
      newValues[chipIndex].label = value;
      return newValues;
    });
  };

  const handleSave = () => {
    setBusinessInfo({
      ...businessInfo,
      [category]: values.filter((v) => v.label),
    });
    closeEdit();
  };

  useEffect(() => {
    const newValues = initValues.splice(0, 3).map((v, i) => ({ ...v, id: i }));
    setValues((old) => {
      const newChips = Array.from(old);
      newChips.splice(0, newValues.length, ...newValues);
      return newChips;
    });
  }, [initValues]);

  return (
    <div>
      <div>
        {values.map((v, i) => {
          return (
            <div key={v.id} className="flex items-center justify-between gap-[10px] mb-5">
              <BrandDetailsInput
                value={v.label}
                onChange={(e) => handleChange(i, e.target.value)}
              />
              <button onClick={() => handleRemove(i)}>
                <img src="/remove_tag.svg" alt="remove tag" />
              </button>
            </div>
          );
        })}
      </div>
      <PurpleButton type="button" onClick={handleSave}>
        Save
      </PurpleButton>
    </div>
  );
}
