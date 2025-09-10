import React, { useContext } from 'react';
import FormsContainer from '../../../components/shared/FormsContainer';
import BrandDetailsReview from './BrandDetailsReview';
import { BrandContext } from '../context/BrandContext';
import Sidebar from '../../../components/shared/Sidebar';
import { FaEdit } from 'react-icons/fa';

export default function BrandReview({ toggleEdit, hasBrand }: any) {
  const { businessInfo } = useContext(BrandContext);

  return (
    <div className="flex h-full flex-col max-w-2xl mx-auto gap-2 md:mt-auto mt-16">
      <Sidebar currentStep={0} />
      <FormsContainer>
        <div className="flex flex-col gap-4">
          <button
            onClick={toggleEdit}
            className="flex items-center justify-center gap-2 bg-indigo-500 text-white 
            rounded-md text-sm font-medium px-4 py-1.5 
            hover:bg-indigo-600
            max-w-[12vw]
            ml-auto
            "
          >
            <FaEdit />
            Edit details
          </button>
          <p className="text-xl text-[#111928] font-semibold mb-5">
            Here&apos;s what Matchpoint knows about your business:
          </p>
        </div>
        {businessInfo?.logo !== '' && (
          <div className="mb-5">
            <div className="mb-5 flex items-center gap-3">
              <label title="logo" className="block text-base font-medium text-gray-900">
                {businessInfo?.logo !== '' ? 'Logo' : 'Brand Name'}
              </label>
            </div>
            {businessInfo?.logo !== '' ? (
              <img
                src={`https://storage.googleapis.com/matchpoint-brands-logos/${businessInfo?.logo}`}
                alt="logo"
                className="w-[150px] h-auto"
              />
            ) : (
              <h2 className="text-lg capitalize text-[#111928]">{businessInfo?.name}</h2>
            )}
          </div>
        )}
        {(businessInfo?.brandColors?.length ?? 0) > 0 && (
          <div className="mb-5">
            <div className="mb-5 flex items-center gap-3">
              <label className="block text-base font-medium text-gray-900">Brand Colors</label>
            </div>
            <div className="gap-3 overflow-x-auto whitespace-nowrap">
              {businessInfo?.brandColors?.map((color: string, index: number) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full inline-block mr-2 shadow-md"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
        <div>
          <label title="logo" className="block text-base font-medium text-gray-900">
            Business and Brand Summary
          </label>
          <div className="bg-[#EBF5FF] p-4 my-5 rounded-md">
            <p>{businessInfo?.summary}</p>
          </div>
        </div>
        <BrandDetailsReview edit={true} hasBrand={hasBrand} />
      </FormsContainer>
    </div>
  );
}
