import React from 'react';
import { Navbar } from '../features/auth';
import LandingFooter from '../components/landing/LandingFooter';
// import Contact from "../components/landing/Contact";
import WhyBanner from '../components/landing/WhyBanner';
import HowBanner from '../components/landing/HowBanner';
// import Reviews from "../components/landing/Reviews";
import HeroSection from '../components/landing/HeroSection';
import Features from '../components/landing/Features';

const LandingPage = () => {
  return (
    <>
      <div className="min-h-screen bg-[#F9D2FF] lg:bg-gradient-to-br lg:from-[#F9D2FF] lg:to-[#8DA6FF]">
        <Navbar style={'bg-transparent'} />
        <div className="flex flex-col items-center w-full h-full">
          <HeroSection />
          <WhyBanner />
          <HowBanner />
          {/* <Reviews /> */}
          <Features />
          {/* <Contact /> */}
          <LandingFooter />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
