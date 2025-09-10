import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { Navbar } from '../features/auth';
import LandingFooter from '../components/landing/LandingFooter';
// import Contact from "../components/landing/Contact";
import WhyBanner from '../components/landing/WhyBanner';
import HowBanner from '../components/landing/HowBanner';
// import Reviews from "../components/landing/Reviews";
import HeroSection from '../components/landing/HeroSection';
import Features from '../components/landing/Features';
var LandingPage = function () {
  return _jsx(_Fragment, {
    children: _jsxs('div', {
      className: 'min-h-screen bg-[#F9D2FF] lg:bg-gradient-to-br lg:from-[#F9D2FF] lg:to-[#8DA6FF]',
      children: [
        _jsx(Navbar, { style: 'bg-transparent' }),
        _jsxs('div', {
          className: 'flex flex-col items-center w-full h-full',
          children: [
            _jsx(HeroSection, {}),
            _jsx(WhyBanner, {}),
            _jsx(HowBanner, {}),
            _jsx(Features, {}),
            _jsx(LandingFooter, {}),
          ],
        }),
      ],
    }),
  });
};
export default LandingPage;
//# sourceMappingURL=LandingPage.js.map
