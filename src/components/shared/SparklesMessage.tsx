import React from 'react';

export function SparklesMessage({ loading, children }: { loading?: boolean, children: React.ReactNode }) {
    return (
      <div className="flex items-center rounded-md gap-2 bg-[#EBF5FF] p-1.5">
        <img src={loading ? "loading_spinner.svg" : "/sparkles.svg"} alt="location" className="w-5 h-5" />
        <p className="text-sm text-[#1C64F2]">{children}</p>
      </div>
    );
  }