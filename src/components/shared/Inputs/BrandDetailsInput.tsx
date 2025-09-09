import React from 'react';

interface BrandDetailsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function BrandDetailsInput({ className = '', ...props }: BrandDetailsInputProps) {
  return (
    <input
      {...props}
      className={`outline-none bg-white p-[10px] border border-[#8F8F8F] rounded-lg w-full ${className}`}
    />
  );
}
