// ImageStack.tsx
import React from 'react';

const ImageStack: React.FC = () => {
  return (
    <div className="relative">
      {/* Add your images here */}
      <img
        src="/src/assets/icons/first_rectangle.svg"
        alt="First"
        className="absolute top-0 left-0 w-[178px] h-[173px]"
      />
      <img
        src="/src/assets/icons/second_rectangle.svg"
        alt="Second"
        className="absolute -top-5 left-32 w-[178px] h-[173px]"
      />
      <img
        src="/src/assets/icons/third_rectangle.svg"
        alt="Third"
        className="absolute -top-7 left-64 w-[181px] h-[175px]"
      />
    </div>
  );
};

export default ImageStack;
