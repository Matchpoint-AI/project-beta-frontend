import React from 'react';

const LandingInput = ({
  placeholder,
  handleChange,
}: {
  placeholder: string;
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}) => {
  return placeholder === 'INDUSTRY' ? (
    <textarea
      placeholder={placeholder}
      onChange={handleChange}
      className="h-28 w-full border-[0.5px] border-[#BBAABF] bg-[#EEEAEF] rounded-xl p-3 text-start align-text-top"
      style={{ resize: 'none' }} // Disable resizing for better control
    />
  ) : (
    <input
      type="text"
      placeholder={placeholder}
      onChange={handleChange}
      className="p-3 w-full border-[0.5px] border-[#BBAABF] bg-[#EEEAEF] rounded-xl"
    />
  );
};

export default LandingInput;
