import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const Features = () => {
  const cards = [
    {
      title: 'Intuitive Interface',
      description: 'User-friendly design for seamless content management.',
      bgColor: 'bg-purple-400',
    },
    {
      title: 'Real Time Analytics',
      description: 'Track performance and tweak strategies for better results.',
      bgColor: 'bg-blue-400',
    },
    {
      title: 'Enhanced Security',
      description: 'Keep your data safe with advanced security protocols.',
      bgColor: 'bg-pink-400',
    },
    {
      title: 'Smart Recommendations',
      description: 'Leverage AI insights to optimize strategies and boost performance.',
      bgColor: 'bg-yellow-400',
    },
    {
      title: 'Seamless Collaboration',
      description: 'Work together with your team effortlessly for efficient content creation.',
      bgColor: 'bg-orange-400',
    },
    {
      title: 'Automated Workflows',
      description: 'Save time with smart automation for repetitive tasks and content delivery.',
      bgColor: 'bg-cyan-400',
    },
    {
      title: 'Social Engagement',
      description: 'Boost audience interaction with tailored posts and data-driven campaigns.',
      bgColor: 'bg-red-400',
    },
    {
      title: 'Unified Dashboard',
      description: 'Manage all your social platforms in one intuitive interface.',
      bgColor: 'bg-indigo-400',
    },
    {
      title: 'Advanced Security',
      description: 'Ensure data privacy with top-tier protection and encrypted systems.',
      bgColor: 'bg-gray-400',
    },
    {
      title: 'Multi-Channel Posting',
      description: 'Expand your reach with scheduled posts across multiple platforms.',
      bgColor: 'bg-lime-400',
    },
    {
      title: 'Performance Tracking',
      description: 'Monitor real-time stats and optimize content for better results.',
      bgColor: 'bg-amber-400',
    },
    {
      title: 'Personalized Campaigns',
      description: 'Create tailored campaigns that resonate with your audience effectively.',
      bgColor: 'bg-emerald-400',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    // if (currentIndex === 9) {
    //   setCurrentIndex(0);
    //   return;
    // }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };
  return (
    <div
      id="features"
      className="flex flex-col w-full lg:flex-row items-center justify-start gap-8 px-5 py-20 lg:px-16 lg:py-28 bg-gradient-to-tr from-white/40  to-[#8DA6FF]/40"
    >
      {/* iPhone Image Section */}
      <div className="relative w-full flex flex-col lg:flex-row justify-start items-start gap-7 ">
        <img
          src="/IphoneDisplay.png"
          alt="iPhone"
          className="w-[350px] drop-shadow-lg hidden lg:block"
        />
        <div className="flex w-full flex-col justify-strat items-start lg:mt-6 gap-9">
          <div className="w-full pl-2 lg:pl-0">
            <h2 className="text-4xl lg:text-5xl lg:leading-[60px] text-[#30175A] font-medium">
              Features
            </h2>
            <p className="text-2xl lg:text-4xl text-[#6D607E] font-normal">
              Unique features and offerings
            </p>
          </div>
          {/* Cards hovering on the image */}
          <div className="rounded-lg lg:absolute w-full lg:w-[80%] xl:w-[85%] 2xl:w-[88%] overflow-hidden lg:left-52  lg:bottom-1/4 flex flex-col lg:flex-row">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-2"
              style={{
                transform:
                  window.innerWidth >= 1024
                    ? `translateX(-${(currentIndex * 100) / cards.length}%)`
                    : `translateX(-${currentIndex * 238}px)`,
                ...(window.innerWidth >= 1024 && {
                  width: `${cards.length * 100}%`,
                }),
              }}
            >
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="w-[230px] h-[250px] lg:w-[300px] lg:h-[300px] p-8 bg-white rounded-lg shadow-lg flex flex-col items-center justify-between text-center flex-shrink-0"
                >
                  <div
                    className={`${card.bgColor} w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] rounded-full`}
                  ></div>
                  <div className="flex flex-col gap-5">
                    <h3 className="text-xl lg:text-3xl font-medium text-[#221F28]">{card.title}</h3>
                    <p className="text-black font-normal text-sm lg:text-xl">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex self-end justify-self-start place-self-end gap-4">
          <IoIosArrowBack
            onClick={handlePrev}
            className="w-10 h-10 cursor-pointer focus:outline-none"
          />
          <IoIosArrowForward
            onClick={handleNext}
            className="w-10 h-10 cursor-pointer focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Features;
