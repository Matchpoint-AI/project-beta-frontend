import React, { ReactNode } from 'react';

type CustomComponentProps = {
  title: string;
  subtitle: string;
  isDialogOpen?: boolean;
  children: ReactNode;
};

const CustomComponent: React.FC<CustomComponentProps> = ({
  title,
  subtitle,
  isDialogOpen = false,
  children,
}) => {
  return (
    <div className="flex flex-col mt-6 lg:mt-28 w-full items-center">
      <div className="w-full">
        <h1
          className={`bg-gradient-to-r bg-clip-text text-transparent from-[#681DBA] to-[#FF43E1] text-[22px] md:text-2xl font-semibold ${
            isDialogOpen ? 'blur-md' : ''
          }`}
        >
          {title}
        </h1>
        <p className={`my-3 w-full ${isDialogOpen ? 'blur-md' : ''}`}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

export default CustomComponent;
