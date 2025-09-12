/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Link } from 'react-router-dom';

interface NavButtonProps {
  href: string;
  text: string;
  onClick?: (e?: any) => void;
}

const NavButton = ({ href, text, onClick }: NavButtonProps) => {
  return (
    <Link to={href}>
      <button
        className="bg-[#5145CD] hover:bg-[#6875F5] text-white px-5 py-3 rounded-lg font-bold mb-0 ml-auto md:w-auto w-full flex items-center justify-center"
        onClick={onClick || (() => {})}
      >
        {text}
        <img
          src="/src/assets/icons/angle-right-outline.svg"
          alt="arrow-right"
          className="w-4 h-4 inline-block ms-2"
        />
      </button>
    </Link>
  );
};

export default NavButton;
