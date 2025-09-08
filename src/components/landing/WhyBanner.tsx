import React from "react";
import CardsSection from "../CardsSection";

const WhyBanner = () => {
   return (
      <div
         id="product"
         className="w-full bg-[#3E2B5D] px-8 py-10 lg:p-8 xl:p-14 flex flex-col gap-14 lg:gap-20 justify-start items-start">
         <div className="flex flex-col gap-2 justify-center items-start ">
            <h1 className="font-medium text-3xl leading-10 lg:text-5xl lg:leading-[60px] text-white">
               Why Matchpoint AI?
            </h1>
            <h2 className="font-normal text-2xl leading-8 lg:text-4xl lg:leading-[50px] text-[#DFC7FF]">
               Discover the advantages.
            </h2>
         </div>
         <div className="flex flex-col lg:flex-row justify-start items-center w-full">
            <CardsSection />
         </div>
      </div>
   );
};

export default WhyBanner;
