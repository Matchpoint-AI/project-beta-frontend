import React from 'react';
// import { HiOutlineHand, HiOutlineSparkles, HiOutlineCog } from "react-icons/hi";

const CardComponent = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="w-full p-7 lg:p-10 bg-gradient-to-br to-white/90 from-[#F9D2FF]/90 shadow-lg rounded-xl">
      <div className="flex flex-col items-start justify-start gap-5">
        <div className="w-20 h-20 bg-[#3F2C5D] rounded-full flex items-center justify-center">
          <img src={icon} className="text-white w-10 h-10" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-semibold text-black">{title}</h2>
        <p className=" font-medium text-lg lg:text-2xl text-gray-800">{description}</p>
      </div>
    </div>
  );
};

const CardsSection = () => {
  const cardsData = [
    {
      icon: 'pointer.svg',
      title: 'Effortless Content Creation',
      description: 'Generate high-quality visuals and copy in seconds.',
    },
    {
      icon: 'wand.svg',
      title: 'AI-Powered Efficiency',
      description: 'Generate high-quality visuals and copy in seconds.',
    },
    {
      icon: 'gear.svg',
      title: 'Diverse Customization',
      description: 'Tailor your content to perfectly fit your brand and audience.',
    },
  ];

  return (
    <div className="w-full flex flex-col lg:flex-row gap-7 lg:gap-3 justify-between">
      {cardsData.map((card, index) => (
        <CardComponent
          key={index}
          icon={card.icon}
          title={card.title}
          description={card.description}
        />
      ))}
    </div>
  );
};

export default CardsSection;
