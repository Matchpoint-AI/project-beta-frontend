import React, { FormEventHandler, useEffect, useState } from 'react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import PurpleButton from '../../../components/shared/Buttons/PurpleButton';
import { getServiceURL } from '../../../helpers/getServiceURL';

interface ModifyPromptFormProps {
  week: number;
  day: number;
  post: number;
  content_id: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModifyPromptForm(props: ModifyPromptFormProps) {
  const [prompt, setPrompt] = useState('');
  const [submited, setSubmited] = useState(false);
  const { profile } = useAuth();

  const handleSavePrompt: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const endpointUrl = getServiceURL('content-gen');

    try {
      setSubmited(true);
      await fetch(`${endpointUrl}/api/v1/image_prompt`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${profile?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          week_num: props?.week,
          day_num: props?.day,
          post_num: props?.post + 1,
          content_id: props?.content_id,
          image_prompt: prompt,
        }),
      });
      setSubmited(false);
    } catch (e) {
      setSubmited(false);
    }
  };

  const getImagePrompt = async () => {
    const endpointUrl = getServiceURL('content-gen');
    const params = new URLSearchParams({
      week_num: props?.week.toString(),
      day_num: props?.day.toString(),
      post_num: (props?.post + 1).toString(),
      content_id: props?.content_id,
    });
    const response = await fetch(endpointUrl + `/api/v1/image_prompt?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${profile?.token}`,
      },
    });
    if (response.ok) {
      const { prompt } = await response.json();
      setPrompt(prompt);
    }
  };

  useEffect(() => {
    getImagePrompt();
  }, [profile]);

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)} maxWidth="sm" fullWidth={true}>
      <DialogContent>
        <h1 className="text-xl font-medium ">Image Prompt</h1>
        <p className="text-sm mt-2 mb-4">
          below is the prompt used to generate images for your post
        </p>
        <form onSubmit={handleSavePrompt}>
          <textarea
            className="w-full aspect-video p-3 outline-none border text-gray-900 rounded-md bg-gray-50"
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ resize: 'none' }}
          />
          <PurpleButton type="submit" className="mt-2 capitalize">
            {submited ? (
              <CircularProgress sx={{ color: '#ffffff' }} size={25} thickness={5} />
            ) : (
              'save prompt'
            )}
          </PurpleButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// A realistic photograph of a diverse group of young people aged 18-24 wearing casual and affordable high-quality men's clothing from uniqlo in a bright, electric, and fun setting, no text, logos, products, containers, or bottles
