import React from "react";

const LandingFooter = () => {
  return (
    <div className="w-full">
      <div className="w-full flex justify-center items-center px-8 py-16 lg:p-20 bg-[#41326D]">
        <h1 className="font-normal text-2xl  text-center lg:text-left lg:text-[50px] lg:leading-[62px] text-[#F5E8F7]">
          Elevate Your Social Media Presence with Matchpoint AI
        </h1>
      </div>
      <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-6 px-9 py-10 bg-white">
        <a
          href="#hero"
          className="flex items-center space-x-3 rtl:space-x-reverse self-start  w-full"
        >
          <img src="logo.svg" className="h-8" alt="Matchpoint Logo" />
        </a>
        <div className="flex flex-row justify-between items-center gap-10 lg:gap-14">
          <a
            href="#product"
            className="text-gray-900 font-medium text-base leading-6 hover:text-[#5145CD]"
            aria-current="page"
          >
            Product
          </a>

          <a
            href="#features"
            className="text-gray-900 font-medium text-base leading-6 hover:text-[#5145CD]"
          >
            Features
          </a>

          <a
            href="#about"
            className="text-gray-900 font-medium text-base leading-6 hover:text-[#5145CD]"
          >
            About
          </a>

          {/* <a
            href="#contact"
            className="text-gray-900 font-medium text-base leading-6 hover:text-[#5145CD]"
          >
            Contact
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default LandingFooter;
