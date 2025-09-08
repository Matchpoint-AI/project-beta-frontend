import React from "react";

// Icon components can be added here or imported from a library like react-icons
const StepIcon = ({ icon }: { icon: string }) => (
   <div className="flex items-center justify-center w-24 h-24 lg:w-32 lg:h-32 bg-purple-200 rounded-full text-purple-800 border-[6px] border-[#FBE2FF]">
      <img src={icon} className="w-8 h-8 lg:w-10 lg:h-10" alt="Step Icon" />
   </div>
);

const Step = ({
   icon,
   title,
   description,
}: {
   icon: string;
   title: string;
   description: string;
}) => (
   <div className="flex flex-row lg:flex-col  items-center gap-6 w-full lg:w-[304px] text-center">
      <StepIcon icon={icon} />
      <div className="flex flex-col gap-4">
         <h3 className="text-3xl text-left lg:text-4xl lg:text-center lg:leading-[45px] font-medium tracking-tight text-[#221F28]">
            {title}
         </h3>
         <p className="text-lg text-left lg:text-center lg:text-xl lg:leading-[27px] font-medium text-gray-800">
            {description}
         </p>
      </div>
   </div>
);

// Arrow component
const Arrow = () => (
   <div className="ml-4 flex self-start lg:self-auto items-center justify-center">
      <svg
         className="w-16 h-16 lg:hidden text-[#DEDAE7]"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg">
         <path
            d="M12 5V19M12 19L19 12M12 19L5 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
      <img src={"arrow.svg"} className="hidden lg:block w-56" alt="Step Icon" />
   </div>
);

const HowBanner = () => {
   return (
      <div className="w-full h-full flex flex-col mt-14">
         <div
            id="about"
            className="w-full h-auto bg-white rounded-[30px] py-20 px-4 lg:px-9 gap-10 mx-auto">
            <h2 className="text-3xl lg:text-5xl font-medium lg:leading-[75px] tracking-tighter text-[#221F28] text-center mb-20">
               How We Make the Magic Happen
            </h2>
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 justify-center items-center ">
               <Step
                  icon={"paint.svg"} // Replace with your actual icon path or component
                  title={
                     <>
                        Input Your <br /> Brand Details
                     </>
                  }
                  description={
                     <>
                        Feed Matchpoint AI with <br /> your brand specifics.
                     </>
                  }
               />
               <Arrow />
               <Step
                  icon={"bullseye.svg"} // Replace with your actual icon path or component
                  title={
                     <>
                        Choose Your <br /> Campaign Goals
                     </>
                  }
                  description={
                     <>
                        Set objectives for audience <br /> engagement and reach.
                     </>
                  }
               />
               <Arrow />
               <Step
                  icon={"popup.svg"} // Replace with your actual icon path or component
                  title={
                     <>
                        Generate and <br /> Publish
                     </>
                  }
                  description={
                     <>
                        Watch as Matchpoint AI <br /> crafts and schedules{" "}
                        <br /> your content.
                     </>
                  }
               />
            </div>
         </div>
      </div>
   );
};

export default HowBanner;
