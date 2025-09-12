import React from 'react';

import Sidebar from '../../../components/shared/Sidebar';
import useFetchUserData from '../../users/hooks/useFetchUserData';
import UserDataBlocks from '../../users/components/UserDataBlocks';
import { CircularProgress } from '@mui/material';
import { RiErrorWarningLine } from 'react-icons/ri';

export default function CampaignContentPage() {
  const [data, loading, handleRetry] = useFetchUserData();
  const _error = false;

  return (
    <div className="w-full h-full">
      <div className="flex w-full lg:flex-row flex-col bg-gradient-to-b min-h-screen from-[#F1FDFF] to-[#F5D9FF]">
        <Sidebar />
        {loading && (
          <div className="w-full min-h-screen flex flex-col gap-5 justify-center items-center">
            <CircularProgress sx={{ color: '#42389D' }} size={80} thickness={5} />
            <h1 className="text-2xl font-semibold leading-9 text-gradient">Fetching user data</h1>
          </div>
        )}
        {!loading && _error && (
          <div className="w-full min-h-screen flex flex-col gap-5 justify-center items-center">
            <RiErrorWarningLine size={64} color="#F05252" />
            <h1 className="font-medium md:text-[42px] sm:text-[32px] text-[28px] text-center text-[#30175A]">
              Unexpected Error
            </h1>
            <p className="text-[#30175A] md:text-lg text-base text-center max-w-[600px]">
              Sorry, unexpected error happend while fetching user data
              <br />
              Please retry.
            </p>
            <button
              className="flex items-center justify-center font-semibold mt-5 bg-[#5145CD] text-white rounded-lg py-3 px-5"
              onClick={handleRetry}
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !_error && (
          <div className="md:ml-[80px] flex-grow flex flex-col gap-8 p-8 md:mt-8 mt-[80px]">
            <UserDataBlocks
              data={data || { 
                id: '',
                name: '',
                email: '',
                plan: '',
                created_at: '',
                brand: {
                  name: '',
                  website: '',
                  logo: '',
                  industry: '',
                  vertical: ''
                },
                campaigns: []
              }}
              viewContent={async () => {
                // Empty implementation - no content viewing functionality
              }}
              viewThread={async () => {
                // Empty implementation - no thread viewing functionality
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
