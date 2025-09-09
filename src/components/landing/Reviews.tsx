import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const reviews = [
  {
    text: 'Matchpoint AI transformed our social media strategy!',
    name: 'Emerson Stedmann',
    title: 'CEO, Spa Essentials',
    image: '/face.png', // Replace with actual image URL
  },
  {
    text: 'This platform skyrocketed our engagement!',
    name: 'Sophia Carter',
    title: 'Marketing Director, BrightSide',
    image: '/face.png', // Replace with actual image URL
  },
  {
    text: 'Incredible AI tools that save us time and improve our results.',
    name: 'Liam James',
    title: 'Founder, GreenWave Co.',
    image: '/face.png', // Replace with actual image URL
  },
];

const Reviews: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
  };

  return (
    <div className="flex flex-col py-28 px-16 lg:py-40 lg:px-52 w-full bg-[#F9D2FF] items-center justify-center relative">
      <p className="text-3xl leading-10 lg:text-6xl lg:leading-[83px] font-light  text-center text-[#1B1934] mb-6">
        “{reviews[currentIndex].text}”
      </p>
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <img
          src={reviews[currentIndex].image}
          alt={reviews[currentIndex].name}
          className="w-20 h-20 lg:w-32 lg:h-32 rounded-full"
        />
        <div className="flex flex-col  w-full">
          <p className="text-2xl lg:text-4xl text-black text-center lg:text-left font-light">
            {reviews[currentIndex].name}
          </p>
          <p className="text-base leading-5 text-center lg:text-left lg:text-2xl text-black font-medium">
            {reviews[currentIndex].title}
          </p>
        </div>
      </div>
      <div className=" flex flex-row gap-4 mt-10 lg:mt-0">
        <div className="lg:absolute inset-y-0 left-14 flex items-center">
          <IoIosArrowBack
            onClick={handlePrev}
            className="w-10 h-10 text-purple-400 hover:text-purple-500 cursor-pointer focus:outline-none"
          />
        </div>
        <div className="lg:absolute inset-y-0 right-14 flex items-center">
          <IoIosArrowForward
            onClick={handleNext}
            className="w-10 h-10 text-purple-400 hover:text-purple-500 cursor-pointer focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Reviews;
