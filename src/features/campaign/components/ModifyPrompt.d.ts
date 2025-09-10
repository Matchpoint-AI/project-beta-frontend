import React from 'react';
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
}: ModifyPromptProps): import('react/jsx-runtime').JSX.Element;
export {};
