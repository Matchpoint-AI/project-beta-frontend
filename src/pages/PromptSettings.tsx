import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { RiErrorWarningLine } from 'react-icons/ri';

import Sidebar from '../components/shared/Sidebar';
import { useAuth } from '../features/auth/context/AuthContext';
import fetchPrompts from '../helpers/fetchPrompts';
import PromptEditor from '../components/campaign/PromptEditor';

export interface Prompt {
  prompt: string;
  version: number;
}

interface AppPrompt {
  content_generation: Prompt[];
  scrape_website: Prompt[];
}

export default function PromptsSettings() {
  const [prompts, setPrompts] = useState<AppPrompt>(null!);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { profile } = useAuth();
  const content_gen_args = [
    'campaign_data',
    'frequency',
    'post_structure',
    'campaign_themes',
    'brand_profile',
    'negative_prompts',
  ];
  const scraping_args = ['html_content'];

  const getPrompts = async () => {
    setLoading(true);
    const app_prompts = await fetchPrompts(profile?.token || '');
    console.log(app_prompts);
    if (app_prompts) setPrompts(app_prompts);
    else setError('error loading prompts');
    setLoading(false);
  };

  const switchPrompts = (version: number, target: 'content_generation' | 'scrape_website') => {
    setPrompts((old) => {
      const newPrompts = { ...old };
      const promptIndex = version - 1;
      const arrLength = newPrompts[target].length;

      newPrompts[target][promptIndex].version = arrLength;
      newPrompts[target][arrLength - 1].version = version;

      const tmp = newPrompts[target][promptIndex];
      newPrompts[target][promptIndex] = newPrompts[target][arrLength - 1];
      newPrompts[target][arrLength - 1] = tmp;

      return newPrompts;
    });
  };

  const addPrompt = (prompt: string, target: 'content_generation' | 'scrape_website') => {
    const version = prompts[target].length + 1;
    setPrompts((old) => {
      const newPrompts = { ...old };
      newPrompts[target] = [
        ...newPrompts[target],
        {
          prompt,
          version,
        },
      ];
      return newPrompts;
    });
  };

  useEffect(() => {
    getPrompts();
  }, [profile]);

  return (
    <div className="w-full h-full">
      <div className="flex w-full lg:flex-row flex-col bg-gradient-to-b min-h-screen from-[#F1FDFF] to-[#F5D9FF]">
        <Sidebar />
        {loading && (
          <div className="w-full min-h-screen flex flex-col gap-5 justify-center items-center">
            <CircularProgress sx={{ color: '#42389D' }} size={80} thickness={5} />
            <h1 className="text-2xl font-semibold leading-9 text-gradient">Fetching Prompts</h1>
          </div>
        )}
        {!loading && error && (
          <div className="w-full min-h-screen flex flex-col gap-5 justify-center items-center">
            <RiErrorWarningLine size={64} color="#F05252" />
            <h1 className="font-medium md:text-[42px] sm:text-[32px] text-[28px] text-center text-[#30175A]">
              Unexpected Error
            </h1>
            <p className="text-[#30175A] md:text-lg text-base text-center max-w-[600px]">
              Sorry, unexpected error happend while fetching prompts
              <br />
              Please retry.
            </p>
            <button
              className="flex items-center justify-center font-semibold mt-5 bg-[#5145CD] text-white rounded-lg py-3 px-5"
              onClick={() => getPrompts()}
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !error && (
          <div className="md:ml-[80px] flex-grow flex flex-col gap-8 p-8 md:mt-8 mt-[80px]">
            {prompts?.content_generation && (
              <PromptEditor
                promptsArr={prompts.content_generation}
                placeholders={content_gen_args}
                target="content_generation"
                switchPrompts={switchPrompts}
                addPrompts={addPrompt}
              />
            )}
            {prompts?.scrape_website && (
              <PromptEditor
                promptsArr={prompts.scrape_website}
                placeholders={scraping_args}
                target="scrape_website"
                switchPrompts={switchPrompts}
                addPrompts={addPrompt}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
