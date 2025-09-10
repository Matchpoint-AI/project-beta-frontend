import React from 'react';
export default function PurpleButton({
  type,
  className,
  onClick,
  children,
  disabled,
}: {
  type?: 'submit' | 'reset' | 'button' | undefined;
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}): import('react/jsx-runtime').JSX.Element;
