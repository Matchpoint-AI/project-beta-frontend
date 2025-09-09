import { useState } from 'react';
import { getServiceURL } from '../helpers/getServiceURL';
import { useAuth } from '../features/auth/context/AuthContext';
export type Messages = {
  thread_id: string;
  messages: string[];
};

export default function useFetchThreadMessages() {
  const [openThreadWin, setOpenThreadWin] = useState(false);
  const [messages, setMessages] = useState<Messages | null>(null);
  const { profile } = useAuth();

  const fetchMessages = async (thread_id: string) => {
    const endpointUrl = getServiceURL('llm');
    const response = await fetch(`${endpointUrl}/api/v1/threads/${thread_id}`, {
      headers: {
        Authorization: `Bearer ${profile.token}`,
      },
    });

    if (!response.ok) return;

    const data = await response.json();
    setMessages({ thread_id, messages: data });
    setOpenThreadWin(true);
  };

  const addMessage = (prompt: string) => {
    setMessages((old) => {
      if (!old) return null;
      const newArr = Array.from(old.messages);
      newArr.push(prompt);
      return {
        thread_id: old.thread_id,
        messages: newArr,
      };
    });
  };

  const popMessage = () => {
    setMessages((old) => {
      if (!old) return null;
      const newArr = Array.from(old.messages);
      newArr.pop();
      return {
        thread_id: old.thread_id,
        messages: newArr,
      };
    });
  };

  return [
    messages,
    openThreadWin,
    setOpenThreadWin,
    fetchMessages,
    addMessage,
    popMessage,
  ] as const;
}
