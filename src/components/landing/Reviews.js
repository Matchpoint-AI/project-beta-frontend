import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
var reviews = [
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
var Reviews = function () {
    var _a = useState(0), currentIndex = _a[0], setCurrentIndex = _a[1];
    var handleNext = function () {
        setCurrentIndex(function (prevIndex) { return (prevIndex + 1) % reviews.length; });
    };
    var handlePrev = function () {
        setCurrentIndex(function (prevIndex) { return (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1); });
    };
    return (_jsxs("div", { className: "flex flex-col py-28 px-16 lg:py-40 lg:px-52 w-full bg-[#F9D2FF] items-center justify-center relative", children: [_jsxs("p", { className: "text-3xl leading-10 lg:text-6xl lg:leading-[83px] font-light  text-center text-[#1B1934] mb-6", children: ["\u201C", reviews[currentIndex].text, "\u201D"] }), _jsxs("div", { className: "flex flex-col lg:flex-row items-center gap-4", children: [_jsx("img", { src: reviews[currentIndex].image, alt: reviews[currentIndex].name, className: "w-20 h-20 lg:w-32 lg:h-32 rounded-full" }), _jsxs("div", { className: "flex flex-col  w-full", children: [_jsx("p", { className: "text-2xl lg:text-4xl text-black text-center lg:text-left font-light", children: reviews[currentIndex].name }), _jsx("p", { className: "text-base leading-5 text-center lg:text-left lg:text-2xl text-black font-medium", children: reviews[currentIndex].title })] })] }), _jsxs("div", { className: " flex flex-row gap-4 mt-10 lg:mt-0", children: [_jsx("div", { className: "lg:absolute inset-y-0 left-14 flex items-center", children: _jsx(IoIosArrowBack, { onClick: handlePrev, className: "w-10 h-10 text-purple-400 hover:text-purple-500 cursor-pointer focus:outline-none" }) }), _jsx("div", { className: "lg:absolute inset-y-0 right-14 flex items-center", children: _jsx(IoIosArrowForward, { onClick: handleNext, className: "w-10 h-10 text-purple-400 hover:text-purple-500 cursor-pointer focus:outline-none" }) })] })] }));
};
export default Reviews;
//# sourceMappingURL=Reviews.js.map