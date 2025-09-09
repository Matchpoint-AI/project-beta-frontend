import React, { useState } from 'react';
import { SparklesMessage } from './shared/SparklesMessage';
import EditBlock from './shared/EditBlock';
import ChipComponent from './ChipComponent';
import ChipsEditBlock from './onboard/ChipsEditBlock';

interface AudienceEmotionsProps {
  values: string[];
  setValues: (values: string[]) => void;
  title: string;
  description?: string;
  genre: 'emotion' | 'interests';
}

export default function AudienceDetails(props: AudienceEmotionsProps) {
  const [edit, setEdit] = useState(false);

  const handleChipClose = (index: number) => {
    const newChips = Array.from(props.values);
    newChips.splice(index, 1);
    props.setValues(newChips);
  };

  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <h3 title="email" className="block mb-2 text-xl font-medium text-gray-900">
          {props.title}
        </h3>
        <EditBlock disabled={edit} onClick={() => setEdit(true)} className="ml-auto" />
      </div>
      {props.description && <p className="text-[#6B7280] text-sm mb-3">{props.description}</p>}
      <SparklesMessage>
        Matchpoint tailored these suggestions to your brand. They inform the scenes and activities
        shown in your content—feel free to edit/add more up to 3 total
      </SparklesMessage>
      {!edit && (
        <div
          className="bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg flex items-center mt-3"
          style={{
            height: props.values.length > 0 ? 'fit-content' : '56px',
            padding: props.values.length > 0 ? '14px 16px' : '0px 16px',
          }}
        >
          <div className="block">
            {props.values?.map((value, index) => (
              <ChipComponent
                key={index}
                label={value}
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
          initValues={props.values}
          saveValues={props.setValues}
          closeEdit={() => setEdit(false)}
          className="mt-3"
          genre={props.genre}
        />
      )}
    </div>
  );
}
