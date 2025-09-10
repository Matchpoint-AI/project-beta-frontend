import React, { FormEventHandler, useEffect, useState } from 'react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { Button, Dialog, DialogContent, TextField } from '@mui/material';
import { getServiceURL } from '../../../helpers/getServiceURL';
import Cookies from 'universal-cookie';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import styled from '@emotion/styled';
import { MdClose } from 'react-icons/md';
import { imageApi } from '../../../api/contentGenerationApi';
interface ModifyPromptProps {
  week: number;
  day: number;
  post: number;
  content_id: string;
  image: unknown;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  regenerate: (prompt: string) => void;
  totalAllowed: number;
}

const PurpleButton = styled(Button)(({ theme: _theme }) => ({
  backgroundColor: '#5145CD',
  color: 'white',
  padding: '0.5rem 2rem',
  borderRadius: '0.3rem',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#5145CD',
  },
  '&:disabled': {
    backgroundColor: '#5145CD',
    opacity: 0.7,
  },
}));

const CancelButton = styled(Button)(() => ({
  backgroundColor: '#fce4ec',
  color: '#ad1457',
  padding: '0.5rem 2rem',
  borderRadius: '0.3rem',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#f8bbd9',
  },
}));

const StyledTextField = styled(TextField)(({ theme: _theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f5f5f5',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#9c27b0',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#9c27b0',
      borderWidth: '2px',
    },
  },
  '& .MuiOutlinedInput-input': {
    color: '#424242',
    fontSize: '14px',
  },
}));

export default function ModifyPrompt({
  week,
  day,
  post,
  content_id,
  setOpen,
  regenerate,
  open,
  image,
  totalAllowed: _totalAllowed,
}: ModifyPromptProps) {
  const [prompt, setPrompt] = useState('');
  const [submited, setSubmited] = useState(false);
  const { profile } = useAuth();
  const [limitReached, setLimitReached] = useState(false);
  const [remainingGenerations, setRemainingGenerations] = useState(0);

  const splitPrompt = (fullPrompt: string) => {
    if (!fullPrompt) return { firstPart: '', rest: '' };
    // Remove common prefixes but be more flexible
    const prefixes = [
      'A realistic photograph of',
      'A photograph of',
      'A realistic image of',
      'An image of',
    ];
    let withoutPrefix = fullPrompt;
    for (const prefix of prefixes) {
      if (fullPrompt.startsWith(prefix)) {
        withoutPrefix = fullPrompt.replace(prefix, '').trim();
        break;
      }
    }
    const [firstPart, ...rest] = withoutPrefix.split('.');
    const remainingText = rest.length > 0 ? `. ${rest.join('.')}` : '';
    return { firstPart, rest: remainingText };
  };

  const handleSavePrompt: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (remainingGenerations <= 0) {
      setLimitReached(true);
      return;
    }

    try {
      setSubmited(true);

      // Try new Flux/FAL image generation first
      const useFlux = true; // Feature flag for new generation

      if (useFlux && profile?.token) {
        try {
          // Generate image using new Flux/FAL API
          const imageData = await imageApi.generateImage(
            {
              prompt: prompt,
              model: 'flux-pro', // Use Flux Pro for best quality
              style: 'photorealistic',
              aspect_ratio: '1:1', // Instagram square
              negative_prompt: 'blurry, low quality, distorted',
              enhance_prompt: true, // Enable prompt enhancement
            },
            profile.token
          );

          if (imageData.image_url) {
            // Update the prompt in backend for consistency
            const endpointUrl = getServiceURL('content-gen');
            await fetch(`${endpointUrl}/api/v1/image_prompt`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${profile.token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                week_num: week,
                day_num: day,
                post_num: post + 1,
                content_id: content_id,
                image_prompt: prompt,
                image_url: imageData.image_url, // Include new image URL
              }),
            });

            setSubmited(false);
            regenerate(imageData.image_url); // Pass new image URL
            setOpen(false);
            return;
          }
        } catch (fluxError) {
          console.error('Flux generation failed, falling back to legacy:', fluxError);
        }
      }

      // Fallback to legacy image generation
      const endpointUrl = getServiceURL('content-gen');
      const response = await fetch(`${endpointUrl}/api/v1/image_prompt`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${profile?.token || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          week_num: week,
          day_num: day,
          post_num: post + 1,
          content_id: content_id,
          image_prompt: prompt,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.detail || 'Failed to update prompt');
      }

      await response.json();
      setSubmited(false);
      // Pass the prompt directly to regenerate
      regenerate(prompt);
      setOpen(false);
    } catch (e) {
      console.error('Error:', e);
      setSubmited(false);
    }
  };

  const getImagePrompt = async () => {
    if (!profile?.token) {
      console.warn('No authentication token available');
      return;
    }

    const endpointUrl = getServiceURL('content-gen');
    const params = new URLSearchParams();
    params.append('week_num', week.toString());
    params.append('day_num', day.toString());
    params.append('post_num', (post + 1).toString());
    params.append('content_id', content_id);

    try {
      const response = await fetch(endpointUrl + `/api/v1/image_prompt?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${profile?.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Authentication failed - token may be invalid or expired');
          // Clear the token and redirect to login
          const cookies = new Cookies();
          cookies.remove('access_token');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { prompt } = await response.json();
      setPrompt(prompt);
    } catch (error) {
      console.error('Error fetching image prompt:', error);
    }
  };

  useEffect(() => {
    getImagePrompt();
  }, [profile]);

  const fetchRemainingGenerations = async () => {
    try {
      const endpointUrl = getServiceURL('content-gen');
      const params = new URLSearchParams();

      params.append('week_num', week.toString());
      params.append('day_num', day.toString());
      params.append('post_num', (post + 1).toString());
      params.append('content_id', content_id);

      const response = await fetch(
        `${endpointUrl}/api/v1/contentgen/remaining_generations?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${profile?.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRemainingGenerations(data.remaining);
      }
    } catch (error) {
      console.error('Error fetching remaining generations:', error);
    }
  };

  useEffect(() => {
    fetchRemainingGenerations();
  });

  return (
    <>
      <Dialog
        className="min-w-3xl border border-red-600"
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogContent>
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
              Regenerate Your Image
            </h1>
            <p className="text-gray-700 font-bold text-md">Let&apos;s regenerate your image together.</p>
          </div>

          <div className="mb-4">
            <img src={image} className="w-full h-64 object-cover object-top rounded-md" />
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-purple-600 ">
              What change would you like to see in your image?
            </h2>
            <p className="text-gray-600 text-sm mb-3">Be as direct as possible.</p>

            <form onSubmit={handleSavePrompt} className="w-full" role="form">
              <StyledTextField
                fullWidth
                multiline
                rows={3}
                value={splitPrompt(prompt).firstPart}
                onChange={(e) => {
                  const { rest } = splitPrompt(prompt);
                  // Don't automatically add prefix - let the campaign data drive the prompt
                  setPrompt(`${e.target.value}${rest}`);
                }}
                sx={{ mb: 2 }}
              />

              <div className="flex gap-3 justify-center pt-4">
                <CancelButton type="button" onClick={() => setOpen(false)}>
                  Cancel
                </CancelButton>
                <PurpleButton type="submit" disabled={submited || remainingGenerations <= 0}>
                  {submited ? (
                    <span className="flex items-center gap-2">Regenerating</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Regenerate
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {remainingGenerations}
                      </span>
                      <PiArrowsClockwiseBold size={16} />
                    </span>
                  )}
                </PurpleButton>
              </div>
            </form>
          </div>

          <div className="text-center text-sm text-gray-500">
            {remainingGenerations} {remainingGenerations > 1 ? 'Regenerations' : 'Regenration'} left
            for this post
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={limitReached} onClose={() => setLimitReached(false)} maxWidth="sm" fullWidth>
        <DialogContent className="relative">
          <button
            className="absolute z-50 right-4 text-gray-500 hover:text-gray-700"
            onClick={() => setLimitReached(false)}
            aria-label="Close"
          >
            <MdClose size={20} />
          </button>
          <div className="relative text-center">
            <h2 className="text-xl font-bold text-purple-600 mb-4">Regeneration Limit Reached</h2>
            <p className="text-gray-700 mb-6">
              You&apos;ve hit your regeneration limit for this content. We&apos;ll keep you posted when
              Matchpoint Unlimited—with more regenerations—is ready for you.{' '}
            </p>

            <div className="flex flex-col gap-3">
              <PurpleButton
                onClick={() => {
                  setLimitReached(false);
                  setOpen(false);
                }}
              >
                Keep Current Image
              </PurpleButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
