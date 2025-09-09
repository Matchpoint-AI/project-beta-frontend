import React, { useContext } from 'react';
import DetailsBlock from './shared/DetailsBlock';
import { BrandContext } from '../context/BrandContext';
import { useNavigate } from 'react-router-dom';

interface BrandDetailsReviewProps {
  stepHandler: (step: number) => void;
  edit?: boolean;
  hasBrand?: boolean;
}

export default function BrandDetailsReview({ stepHandler, edit = true }: BrandDetailsReviewProps) {
  const { businessInfo } = useContext(BrandContext);
  const description = {
    mission: 'The goal you want to achieve as a company',
    values: 'The core beliefs that guide your interactions with customers',
    persona: 'The characteristics that identify who you are and how you behave',
    toneAndVoice: 'How your business speaks and verbally expresses its personality',
  };
  const navigate = useNavigate();

  const clickHandler = (value: string) => {
    stepHandler(1);
    navigate(
      {
        pathname: window.location.pathname,
        search: '?edit=true',
        hash: `#${value}`,
      },
      { replace: true },
    );
  };
  return (
    <div>
      {typeof businessInfo?.mission === 'string' && (
        <DetailsBlock
          edit={edit}
          title="mission"
          description={description.mission}
          onClick={() => clickHandler('mission')}
        >
          {businessInfo?.mission}
        </DetailsBlock>
      )}
      {typeof businessInfo?.mission !== 'string' && (
        <DetailsBlock
          edit={edit}
          title="mission"
          description={description.mission}
          onClick={() => clickHandler('mission')}
        >
          <div className="flex flex-wrap gap-3">
            {(businessInfo?.mission ?? [])
              .filter((c) => c.selected)
              .map((c) => (
                <div
                  key={c.id}
                  className="py-1 px-[10px] bg-[#D1D5DB] text-xs font-medium leading-[18px] capitalize text-[#111928] rounded-md"
                >
                  {c.label}
                </div>
              ))}
          </div>
        </DetailsBlock>
      )}
      <DetailsBlock
        edit={edit}
        title="values"
        description={description.values}
        onClick={() => clickHandler('values')}
      >
        <div className="flex flex-wrap gap-3">
          {(businessInfo?.values ?? [])
            .filter((c) => c.selected)
            .map((c) => (
              <div
                key={c.id}
                className="py-1 px-[10px] bg-[#D1D5DB] text-xs font-medium leading-[18px] capitalize text-[#111928] rounded-md"
              >
                {c.label}
              </div>
            ))}
        </div>
      </DetailsBlock>
      <DetailsBlock
        edit={edit}
        title="persona"
        description={description.persona}
        onClick={() => clickHandler('persona')}
      >
        <div className="flex flex-wrap gap-3">
          {(businessInfo?.persona ?? [])
            .filter((c) => c.selected)
            .map((c) => (
              <div
                key={c.id}
                className="py-1 px-[10px] bg-[#D1D5DB] text-xs font-medium leading-[18px] capitalize text-[#111928] rounded-md"
              >
                {c.label}
              </div>
            ))}
        </div>
      </DetailsBlock>
      <DetailsBlock
        edit={edit}
        title="tone of voice"
        description={description.toneAndVoice}
        onClick={() => clickHandler('toneAndVoice')}
      >
        <div className="flex flex-wrap gap-3">
          {(businessInfo?.toneAndVoice ?? [])
            .filter((c) => c.selected)
            .map((c) => (
              <div
                key={c.id}
                className="py-1 px-[10px] bg-[#D1D5DB] text-xs font-medium leading-[18px] capitalize text-[#111928] rounded-md"
              >
                {c.label}
              </div>
            ))}
        </div>
      </DetailsBlock>
    </div>
  );
}
