import React, { useState } from 'react';
import Sidebar from '../components/shared/Sidebar';
import useFetchUserData from '../hooks/useFetchUserData';
import UserDataBlocks from '../components/userdata/UserDataBlocks';
import { CircularProgress } from '@mui/material';
import { RiErrorWarningLine } from 'react-icons/ri';
import { getServiceURL } from '../helpers/getServiceURL';
import { CampaignContentWin, CampaignThreadWin } from '../features/campaign';
import { useAuth } from '../features/auth/context/AuthContext';
import useFetchThreadMessages from '../hooks/useFetchThreadMessages';

export type Post = {
  text: string;
  image_prompt: string;
  images: string[];
  posted: boolean;
};

export type Messages = {
  thread_id: string;
  messages: string[];
};

export default function UserDataPage() {
  const [data, loading, _error, handleRetry] = useFetchUserData();
  const { profile } = useAuth();
  const [openContentWin, setOpenContentWin] = useState(false);
  const [content, setContent] = useState<Post[][][]>([]);
  const [messages, openThreadWin, setOpenThreadWin, fetchMessages, addMessage, popMessage] =
    useFetchThreadMessages();

  const handleOpenWindow = async (id: string) => {
    const endpointUrl = getServiceURL('data');
    const response = await fetch(`${endpointUrl}/api/v1/users/campaign/${id}`, {
      headers: {
        Authorization: `Bearer ${profile?.token}`,
      },
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    setContent(data);
    setOpenContentWin(true);
  };

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
              Sorry, unexpected _error happend while fetching user data
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
              data={data!}
              viewContent={handleOpenWindow}
              viewThread={fetchMessages}
            />
          </div>
        )}
      </div>
      <CampaignContentWin
        open={openContentWin}
        onClose={() => setOpenContentWin(false)}
        content={content}
      />
      <CampaignThreadWin
        open={openThreadWin}
        onClose={() => setOpenThreadWin(false)}
        messages={messages}
        addMessage={addMessage}
        popMessage={popMessage}
      />
    </div>
  );
}
