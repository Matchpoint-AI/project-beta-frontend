import React, { KeyboardEventHandler, useState, useRef, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { CircularProgress } from '@mui/material';
import { Messages } from '../../pages/UserDataPage';
import { ClearIcon } from '@mui/x-date-pickers/icons';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { useAuth } from '../../../features/auth/context/AuthContext';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface CampaignThreadWinProps {
  open: boolean;
  onClose: () => void;
  messages: Messages | null;
  addMessage: (prompt: string) => void;
  popMessage: () => void;
}

export default function CampaignThreadWin({
  open,
  onClose,
  messages,
  addMessage,
  popMessage,
}: CampaignThreadWinProps) {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleKeyDown: KeyboardEventHandler = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const endpointUrl = getServiceURL('llm');
      setLoading(true);
      addMessage(prompt);
      setPrompt('');
      const response = await fetch(`${endpointUrl}/api/v1/threads/${messages?.thread_id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${profile?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      if (!response.ok) {
        setLoading(false);
        popMessage();
        return;
      }

      const message = await response.json();
      addMessage(message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;

      if (textarea.scrollHeight < 60) textarea.style.height = '60px';
    }
    if (prompt === '\n') setPrompt('');
  }, [prompt]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages) return;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      sx={{ zIndex: 10 }}
    >
      <div className="p-7 bg-gradient-to-b from-[#F1FDFF] to-[#F5D9FF] h-full relative">
        <div className="px-5 py-3 absolute top-0 left-0 w-full flex items-center justify-between">
          <p className="font-semibold text-[#111928] text-lg">
            Thread: <span className="font-medium">{messages.thread_id}</span>
          </p>
          <button type="button" onClick={onClose}>
            <ClearIcon
              sx={{
                color: '#6B7280',
              }}
            />
          </button>
        </div>
        <div className="flex flex-col items-center h-full w-full max-w-[700px] mx-auto mt-6 pb-4">
          <div ref={divRef} className="flex-grow flex flex-col overflow-y-auto messages-box">
            {messages.messages.map((m, i) => (
              <article
                key={i}
                className={`rounded-lg py-3 px-4 md:max-w-[75%] mb-5 max-w-full shadow-lg ${
                  i % 2 === 0 ? 'ml-auto bg-[#F1FDFF]' : 'mr-auto bg-[#F5D9FF]'
                }`}
              >
                {m.startsWith('{"response"') ? JSON.parse(m).response : m}
              </article>
            ))}
            {loading && (
              <CircularProgress
                sx={{ color: '#42389D' }}
                size={25}
                thickness={5}
                className="mx-auto mb-5"
              />
            )}
          </div>
          <div className=" bg-white px-3 py-3 rounded-2xl w-full flex-grow-0">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              ref={textareaRef}
              onKeyDown={handleKeyDown}
              className="w-full text-[#111928] outline-none border-none resize-none min-h-[60px] max-h-[150px]"
              placeholder="Enter Prompt"
              rows={3}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
