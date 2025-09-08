import React from 'react'

export default function FormInputBox({
    color,
    children,
    styles
  }: {
    color: string;
    children: React.ReactNode;
    styles?: React.CSSProperties
  }) {
    return (
      <div
        className="bg-gray-50 border rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 flex items-center justify-center gap-2"
        style={{
          borderColor: color,
          ...styles
        }}
      >
        {children}
      </div>
    );
  }