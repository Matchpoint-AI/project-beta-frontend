import React from "react";

const StepContainer = ({
   icon,
   title,
   children,
}: {
   icon: string;
   title: string;
   children: React.ReactNode;
}) => {
   return (
      <div className="w-full h-[279px] bg-gradient-to-b from-[#8E87D566] to-[#FFB5E600] rounded-t-lg xs:p-0 px-5">
         <div className="w-16 h-16 bg-white rounded-full mx-auto my-5 flex justify-center items-center">
            <img src={icon} alt="briefcase" className="w-8 h-8 " />
         </div>
         <h1 className="text-center text-[#5145CD] text-xl font-bold my-5">
            {title}
         </h1>
         <p className="px-5 text-center text-xl font-normal">{children}</p>
      </div>
   );
};

export default StepContainer;
