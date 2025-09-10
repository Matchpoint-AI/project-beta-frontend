import React, { useState } from 'react';
import { MdEdit } from 'react-icons/md';

interface CampaignDetailsBlockProps {
  title: string;
  text: string;
  review?: boolean;
}

export default function CampaignDetailsBlock({ title, text, review }: CampaignDetailsBlockProps) {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(text);

  return (
    <div
      className={`p-5 mb-[14px] rounded-md w-full border border-[#D1D5DB] group flex items-center justify-between ${
        edit ? 'bg-white' : review ? 'bg-[#F6F5FF]' : 'bg-[#F6F5FF] hover:bg-[#DCD7FE]'
      }`}
    >
      <div className="flex-grow pr-2">
        <h1 className="capitalize text-[#42389D] font-medium text-lg leading-7 mb-1">{title}</h1>
        {!edit && <p className="text-sm leading-5">{value}</p>}
        {edit && (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="rounded-lg w-full h-[150px] p-4 border border-[#D1D5DB] outline-none"
          />
        )}
      </div>
      {!review && (
        <>
          {!edit && (
            <button
              type="button"
              onClick={() => setEdit(true)}
              className="h-8 aspect-square rounded-full bg-[#362F78] p-[3px] hidden group-hover:flex items-center justify-center"
            >
              <MdEdit color="white" size={25} />
            </button>
          )}
          {edit && (
            <button
              type="button"
              onClick={() => setEdit(false)}
              className="py-[5px] px-[14px] uppercase font-medium text-white bg-[#0E9F6E] text-[12px] rounded"
            >
              save
            </button>
          )}
        </>
      )}
    </div>
  );
}

/*

<div className="p-5 mb-5 rounded-md w-full flex items-center justify-between bg-[#DCD7FE] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
          <div>
            <h1 className="capitalize text-[#42389D] font-medium text-lg leading-7 mb-1">
              brand
            </h1>
            <p className="capitalize">{businessInfo.name}</p>
          </div>
          <button className="h-8 aspect-square rounded-full bg-[#362F78] p-[3px] flex items-center justify-center">
            <MdEdit color="white" size={25} />
          </butto
*/
