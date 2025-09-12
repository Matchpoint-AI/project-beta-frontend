import React from 'react';
import { BrandData } from '../hooks/useFetchUserData';

export default function UserBrandData({ data }: { data: BrandData }) {
  if (!data) {
    return <p className="text-[#111928] text-center">Did not setup a brand yet</p>;
  }

  return (
    <div className="p-5 flex gap-10 sm:flex-row flex-col items-center bg-white rounded-md">
      <div>
        {data.logo ? (
          <img
            className="w-24 h-auto"
            src={`https://storage.googleapis.com/matchpoint-brands-logos/${data.logo}`}
            alt="brand logo"
          />
        ) : (
          <div className="w-16 aspect-square bg-[#5145CD] text-white rounded-full flex items-center justify-center">
            <span className="font-semibold text-2xl">{data.name.slice(0, 1).toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className="flex-grow flex items-center justify-between flex-wrap">
        <div>
          <p className="text-[#6B7280] text-sm capitalize">name: </p>
          <p className="font-medium text-[#111928] mr-2 md:mb-0 mb-3">{data.name}</p>
        </div>
        <div>
          <p className="text-[#6B7280] text-sm capitalize">website: </p>
          <p className="font-medium text-[#111928] mr-2 md:mb-0 mb-3">{data.website}</p>
        </div>
        <div>
          <p className="text-[#6B7280] text-sm capitalize">industry: </p>
          <p className="font-medium text-[#111928] capitalize mr-2 md:mb-0 mb-3">{data.industry}</p>
        </div>
        <div>
          <p className="text-[#6B7280] text-sm capitalize">vertical: </p>
          <p className="font-medium text-[#111928] capitalize mr-2 md:mb-0 mb-3">{data.vertical}</p>
        </div>
      </div>
    </div>
  );
}
