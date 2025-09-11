import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
// import { HiOutlineHand, HiOutlineSparkles, HiOutlineCog } from "react-icons/hi";
var CardComponent = function (_a) {
  var icon = _a.icon,
    title = _a.title,
    description = _a.description;
  return _jsx('div', {
    className:
      'w-full p-7 lg:p-10 bg-gradient-to-br to-white/90 from-[#F9D2FF]/90 shadow-lg rounded-xl',
    children: _jsxs('div', {
      className: 'flex flex-col items-start justify-start gap-5',
      children: [
        _jsx('div', {
          className: 'w-20 h-20 bg-[#3F2C5D] rounded-full flex items-center justify-center',
          children: _jsx('img', { src: icon, className: 'text-white w-10 h-10' }),
        }),
        _jsx('h2', { className: 'text-2xl lg:text-3xl font-semibold text-black', children: title }),
        _jsx('p', {
          className: ' font-medium text-lg lg:text-2xl text-gray-800',
          children: description,
        }),
      ],
    }),
  });
};
var CardsSection = function () {
  var cardsData = [
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
  return _jsx('div', {
    className: 'w-full flex flex-col lg:flex-row gap-7 lg:gap-3 justify-between',
    children: cardsData.map(function (card, index) {
      return _jsx(
        CardComponent,
        { icon: card.icon, title: card.title, description: card.description },
        index
      );
    }),
  });
};
export default CardsSection;
//# sourceMappingURL=CardComponant.js.map
