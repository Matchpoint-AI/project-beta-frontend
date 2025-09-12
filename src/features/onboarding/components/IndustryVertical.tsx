import React from 'react';
import { SparklesMessage } from '../../../shared/components/ui/SparklesMessage';
import BrandIndustryBlock from '../../brand/components/BrandIndustryBlock';

export default function IndustryVertical() {
  return (
    <div className="my-5">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">Confirm your industry & vertical</h2>
      <SparklesMessage>We’ve detected your business’s industry & vertical are:</SparklesMessage>
      <BrandIndustryBlock />
    </div>
  );
}
