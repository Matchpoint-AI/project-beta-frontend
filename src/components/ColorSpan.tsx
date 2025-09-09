import React from 'react';
import ClearIcon from '@mui/icons-material/Clear';

interface ColorProps {
  index: number;
  color: string;
  removeColor: (index: number) => void;
}

export default function ColorSpan({ index, color, removeColor }: ColorProps) {
  return (
    <span
      key={index}
      className="w-10 h-10 rounded-full mr-2 inline-block group shadow-md"
      style={{ backgroundColor: color }}
    >
      <button
        type="button"
        className="w-full h-full bg-[#00000080] rounded-full group-hover:flex hidden relative cursor-pointer"
        onClick={() => removeColor(index)}
      >
        <ClearIcon
          sx={{
            fontSize: '18px',
            color: 'white',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </button>
    </span>
  );
}
