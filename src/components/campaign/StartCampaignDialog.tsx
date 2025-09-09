import React from 'react';
import { default as _ReactPlayer } from 'react-player/lazy';
import { ReactPlayerProps } from 'react-player/types/lib';
const ReactPlayer = _ReactPlayer as unknown as React.FC<ReactPlayerProps>;

const StartCampaignDialog = () => {
  return (
    <div className="bg-white shadow-xl w-[720px] h-[720px] mx-auto p-20 items-center justify-center my-14 rounded-lg">
      <div className="flex flex-col justify-center items-center">
        <ReactPlayer url="/complete.mp4" playing />
        <h1 className="bg-gradient-to-r bg-clip-text text-transparent from-[#681DBA] to-[#FF43E1] text-4xl font-bold">
          You’re all set! Biz & Brand info is locked.
        </h1>
        <h2 className="text-xl text-center mt-5">
          Let’s get started creating your first campaign.
        </h2>
      </div>
    </div>
  );
};

export default StartCampaignDialog;
