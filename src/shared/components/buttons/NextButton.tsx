/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const NextButton = ({
  text,
  formId,
  disabled = false,
}: {
  text: string;
  formId: string;
  disabled?: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      form={formId}
      className="bg-[#5145CD] hover:bg-[#6875F5] text-white px-5 py-3 rounded-lg font-bold mb-0 ml-auto md:w-auto w-full flex items-center justify-center disabled:cursor-not-allowed"
    >
      {text}
      <img src="/angle-right-outline.svg" alt="arrow-right" className="w-4 h-4 inline-block ms-2" />
    </button>
  );
};

export default NextButton;
