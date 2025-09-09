import React from 'react';

import { GoClock } from 'react-icons/go';
import { FaCheckCircle } from 'react-icons/fa';
import { RiExportLine } from 'react-icons/ri';

const NewCardStats = ({ id, stats }: { id: string; stats: any }) => {
  return (
    <div className="flex sm:flex-row flex-col  items-start gap-4 w-full">
      <div className="flex flex-row gap-4 items-center justify-center">
        <div className="text-center flex items-center justify-center gap-3">
          <p className="text-[#6B7280] font-semibold text-xs">Total Content</p>
          <p className="text-xs font-bold bg-[#E1EFFE] text-[#1E429F] w-10 h-6 rounded-md flex items-center justify-evenly">
            {/* <HiCollection /> */}
            <img src="/collection.svg" />
            {stats?.total_content}
          </p>
        </div>
        <div className="text-center flex justify-center items-center gap-3">
          <p className="text-[#6B7280] font-semibold text-xs">Generating</p>
          <p className="text-xs font-bold bg-[#FBD5D5] text-[#8E4B10] w-10 h-6 rounded-md flex items-center justify-evenly">
            {/* <GoClock /> */}
            <img src="/ai.svg" />
            {stats?.generating}
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        <div className="text-center flex justify-center items-center gap-3">
          <p className="text-[#6B7280] font-semibold text-xs">Ready For Review</p>
          <p className="text-xs font-bold bg-[#FDF6B2] text-[#8E4B10] w-10 h-6 rounded-md flex items-center justify-evenly">
            <GoClock />
            {stats?.ready_for_review}
          </p>
        </div>
        <div className="text-center flex items-center justify-center gap-3">
          <p className="text-[#6B7280] font-semibold text-xs">Approved</p>
          <p className="text-xs font-bold bg-[#DEF7EC] text-[#03543F] w-10 h-6 rounded-md flex items-center justify-evenly">
            <FaCheckCircle className="text-[#0E9F6E]" />
            {stats?.approved}
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        <div className="text-center flex justify-center items-center gap-3">
          <p className="text-[#6B7280] font-semibold text-xs">Published</p>
          <p className="text-xs font-bold bg-[#82FFC9] text-[#046C4E] w-10 h-6 rounded-md flex items-center justify-evenly">
            {/* <GrDownload className="transfrom rotate-180" /> */}
            <img src="/publish.svg" className="w-[10px] h-[10px]" />
            {stats?.published}
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        <div className="text-center flex justify-center items-center gap-3">
          <p className="text-[#6B7280] font-semibold text-xs">Exported</p>
          <p className="text-xs font-bold bg-[#f9ff82] text-[#6c6c04] w-10 h-6 rounded-md flex items-center justify-evenly">
            {/* <GrDownload className="transfrom rotate-180" /> */}
            <RiExportLine className="w-[14px] h-[14px]" />
            {stats?.exported}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewCardStats;
