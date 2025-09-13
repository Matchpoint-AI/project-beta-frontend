import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
  };
  return (
    <div
      id="hero"
      className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-14 p-4 lg:p-10 lg:px-16 mt-20 lg:mt-0 xl:mt-14 w-full lg:bg-gradient-to-br lg:from-[#F9D2FF] lg:to-[#8DA6FF] bg-[#F9D2FF]"
    >
      {/* Left Section */}
      <div className="w-full lg:w-1/2 text-left flex flex-col gap-8 xl:gap-24">
        {/* Main Text */}
        <div className="flex flex-col gap-4 order-1 lg:order-1">
          <h1 className="text-5xl leading-[50px] lg:text-6xl lg:leading-[70px] xl:text-7xl xl:leading-[100px] font-medium text-[#30175A]">
            Elevate Your <br /> Social Media <br /> Presence with <br /> Matchpoint
          </h1>
          <p className="text-2xl hidden xl:block leading-8 lg:text-3xl lg:leading-9 text-indigo-900 font-medium md:mb-8">
            Unleash the power of AI to create <br /> stunning visuals and captivating copy.
          </p>
        </div>

        {/* Button */}
        <div className="flex flex-col gap-4 order-2 lg:order-3">
          <button
            onClick={handleSignUp}
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium text-base rounded-lg w-fit h-auto px-5 py-3 md:px-5 md:py-3"
          >
            Start Creating Content For Free
          </button>
          {/* <p className="text-xs hidden md:block leading-[18px] font-normal text-gray-800 mt-2">
            No payment info needed.
          </p> */}
        </div>

        {/* Subtext */}
        <div className="flex xl:hidden flex-col gap-4 order-3 lg:order-2">
          <p className="text-2xl leading-8 lg:text-3xl lg:leading-9 text-indigo-900 font-medium md:mb-8">
            Unleash the power of AI to create stunning visuals and captivating copy.
          </p>
        </div>
        {/* <p className="text-xs md:hidden order-4 leading-[18px] font-normal text-gray-800 mt-0">
          No payment info needed.
        </p> */}
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 flex justify-center lg:mt-0">
        {/* Main Image */}
        <div className="relative rounded-lg overflow-hidden">
          <img
            src="/src/assets/images/poster.png"
            alt="Main visual"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
