import React from 'react';

interface FormsContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function FormsContainer({ children, className }: FormsContainerProps) {
  return (
    <div className={`w-full bg-white rounded-xl p-5 md:p-10 my-5 ${className || ''}`}>
      {children}
    </div>
  );
}
