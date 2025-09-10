import React, { useContext } from 'react';
import { SparklesMessage } from '../../../components/shared/SparklesMessage';
import BrandDetailsBlock from './BrandDetailsBlock';
import BrandMissionBlock from './BrandMissionBlock';
import { BrandContext } from '../context/BrandContext';

export default function BrandDetails() {
  const { businessInfo } = useContext(BrandContext);

  return (
    <div className="my-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        Tell us about your <span className="capitalize">{businessInfo?.name}</span>’s brand
      </h2>
      <p className="text-[14px] mb-3">
        Here’s what Matchpoint knows about <span className="capitalize">{businessInfo?.name}</span>{' '}
        so far.
      </p>
      <SparklesMessage>Click tags to activate or deactivate them</SparklesMessage>
      {typeof businessInfo?.mission === 'string' ? (
        <BrandMissionBlock />
      ) : (
        <BrandDetailsBlock category="mission" />
      )}
      <BrandDetailsBlock category="values" />
      <BrandDetailsBlock category="persona" />
      <BrandDetailsBlock category="toneAndVoice" />
    </div>
  );
}
