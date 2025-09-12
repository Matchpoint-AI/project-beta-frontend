import React from 'react';
interface BrandDetailsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
export default function BrandDetailsInput({
  className,
  ...props
}: BrandDetailsInputProps): import('react/jsx-runtime').JSX.Element;
export {};
