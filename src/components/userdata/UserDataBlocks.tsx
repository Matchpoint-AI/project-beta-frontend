import React from 'react';
import { UserData } from '../../hooks/useFetchUserData';
import UserBrandData from './UserBrandData';
import UserCampaignsData from '../UserCampaignsData';

interface UserDataBlocksProps {
  data: UserData;
  viewContent: (id: string) => Promise<void>;
  viewThread: (thread_id: string) => Promise<void>;
}

export default function UserDataBlocks({ data, viewContent, viewThread }: UserDataBlocksProps) {
  return (
    <>
      <div>
        <h1 className=" font-semibold text-[30px] text-[#5145CD] capitalize">{data.name}</h1>
        <div className="flex items-center gap-12 flex-wrap mt-1">
          <div>
            <p className="text-[#6B7280] text-sm capitalize">email: </p>
            <p className="font-medium text-[#111928]">{data.email}</p>
          </div>
          <div>
            <p className="text-[#6B7280] text-sm capitalize">plan: </p>
            <p className="font-medium text-[#111928] capitalize">{data.plan.toLowerCase()}</p>
          </div>
          <div>
            <p className="text-[#6B7280] text-sm capitalize">joined: </p>
            <p className="font-medium text-[#111928]">{data.created_at}</p>
          </div>
        </div>
      </div>
      <div>
        <p className="text-lg font-semibold text-[#111928] mb-2">Brand</p>
        <UserBrandData data={data.brand} />
      </div>
      {data.campaigns.length > 0 && (
        <div>
          <p className="text-lg font-semibold text-[#111928] mb-2">Campaigns</p>
          {data.campaigns.map((c, i) => (
            <UserCampaignsData
              key={i}
              campaign={c}
              viewContent={viewContent}
              viewThread={viewThread}
            />
          ))}
        </div>
      )}
    </>
  );
}
