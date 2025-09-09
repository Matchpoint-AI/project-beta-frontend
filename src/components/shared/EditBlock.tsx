import React from 'react';
import { FaRegEdit } from 'react-icons/fa';

interface EditBlockProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
  className?: string;
}

export default function EditBlock({ onClick, disabled, className }: EditBlockProps) {
  return (
    <button
      disabled={disabled}
      className={`flex items-center gap-1 group ${className}`}
      onClick={onClick}
    >
      <span className="font-semibold text-[12px] sr-only text-[#3F83F8] capitalize group-disabled:text-[#9CA3AF]">
        edit block
      </span>
      <FaRegEdit color={disabled ? '#9CA3AF' : '#3F83F8'} size={16} />
    </button>
  );
}
