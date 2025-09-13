import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import posthog from '../../../shared/utils/posthog';

interface NavbarProps {
  style?: string;
}

export default function Navbar({ style = '' }: NavbarProps) {
  const { profile } = useAuth();
  const [displaySidebar, setDisplaySidebar] = useState(false);
  const { hash } = useLocation(); // Get the current hash from the URL

  const isActive = (section: string) => hash === section; // Check if the current hash matches the section

  const handleToLanding = () => {
    if (posthog.__loaded) {
      posthog.capture('Navigated to Landing Page', {
        distinct_id: profile?.id || 'anonymous_user',
      });
    }
  };

  if (style !== '') {
    return (
      // <nav
      //   className={` z-20 top-0 start-0   flex flex-wrap items-center justify-center gap-10 mx-auto p-4 bg-transparent `}
      // >
      <nav
        className={`fixed lg:static w-full z-20 top-0 start-0 flex gap-10 md:justify-center md:items-center bg-white md:bg-transparent mx-auto p-4`}
      >
        <button type="button" onClick={handleToLanding}>
          <Link to="/landing" className="items-center space-x-3 rtl:space-x-reverse flex md:hidden">
            <img src="/src/assets/icons/logo.svg" className="h-8" alt="Matchpoint Logo" />
          </Link>
        </button>
        <div className="items-center justify-center  hidden w-full md:flex md:w-auto md:order-1 ">
          <ul
            className={`flex flex-col gap-5 p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0`}
          >
            {[
              { href: '#product', label: 'Product' },
              { href: '#features', label: 'Features' },
              { href: '#about', label: 'About' },
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`block py-2 px-3 rounded md:p-0 ${
                    isActive(item.href)
                      ? 'text-[#5145CD]'
                      : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#5145CD]'
                  }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden md:flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center">
          <Link
            to="/login"
            type="button"
            className="text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mx-3"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            type="button"
            className="text-white bg-[#5145CD] focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
          >
            Sign Up
          </Link>
        </div>
        <button
          onClick={() => setDisplaySidebar((old) => !old)}
          className="block md:hidden absolute right-4 top-1/2 translate-y-[-50%]"
        >
          <img src="/src/assets/icons/burger.svg" alt="burger-menu" />
        </button>
        {displaySidebar && (
          <div className="bg-white absolute right-0 top-full h-screen p-3 shadow-lg">
            <div className="flex-col items-center justify-between w-full flex md:w-auto md:order-1">
              <ul className="flex flex-col mt-4 font-medium rtl:space-x-reverse">
                {[
                  { href: '#product', label: 'Product' },
                  { href: '#features', label: 'Features' },
                  { href: '#about', label: 'About' },
                  // { href: "#contact", label: "Contact" },
                ].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setDisplaySidebar((old) => !old)}
                      className={`block py-2 px-3 rounded md:p-0 ${
                        isActive(item.href)
                          ? 'text-white bg-[#5145CD]'
                          : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#5145CD]'
                      }`}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center mt-5 ">
              <Link
                to="/login"
                type="button"
                className="text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mx-3"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                type="button"
                className="text-white bg-[#5145CD] focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </nav>
    );
  }
  return (
    <nav
      className={` fixed w-screen z-20 top-0 start-0 border-b border-gray-200 flex flex-wrap items-center justify-center bg-white md:justify-between  mx-auto p-4`}
    >
      <button type="button" onClick={handleToLanding}>
        <Link to="/landing" className="items-center space-x-3 rtl:space-x-reverse flex md:hidden">
          <img src="/src/assets/icons/logo.svg" className="h-8" alt="Matchpoint Logo" />
        </Link>
      </button>
      {/* <div className="items-center justify-center hidden w-full md:flex md:w-auto md:order-1">
        <ul
          className={`flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0`}
        >
          <li>
            <a
              href="/"
              className="block py-2 px-3 text-white bg-[#5145CD] rounded md:bg-transparent md:text-[#5145CD] md:p-0"
              aria-current="page"
            >
              Product
            </a>
          </li>
          <li>
            <a
              href="/"
              className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#5145CD] md:p-0 "
            >
              Features
            </a>
          </li>
          <li>
            <a
              href="/"
              className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#5145CD] md:p-0 "
            >
              About
            </a>
          </li>
          <li>
            <a
              href="/"
              className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#5145CD] md:p-0 "
            >
              Contact
            </a>
          </li>
        </ul>
      </div> */}
      <div className="hidden md:flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center">
        <Link
          to="/login"
          type="button"
          className="text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mx-3"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          type="button"
          className="text-white bg-[#5145CD] focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
        >
          Sign Up
        </Link>
      </div>
      <button
        onClick={() => setDisplaySidebar((old) => !old)}
        className="block md:hidden absolute right-4 top-1/2 translate-y-[-50%]"
      >
        <img src="/src/assets/icons/burger.svg" alt="burger-menu" />
      </button>
      {displaySidebar && (
        <div className="bg-white absolute right-0 top-full h-screen p-3 shadow-lg">
          {/* <div className="flex-col items-center justify-between w-full flex md:w-auto md:order-1">
            <ul className="flex flex-col mt-4 font-medium rtl:space-x-reverse">
              <li>
                <a
                  href="/"
                  className="block py-2 px-3 text-white bg-[#5145CD] rounded md:bg-transparent md:text-[#5145CD] md:p-0"
                  aria-current="page"
                >
                  Product
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#5145CD] md:p-0 "
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#5145CD] md:p-0 "
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#5145CD] md:p-0 "
                >
                  Contact
                </a>
              </li>
            </ul>
          </div> */}
          <div className="flex flex-col items-center mt-5 ">
            <Link
              to="/login"
              type="button"
              className="text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mx-3"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              type="button"
              className="text-white bg-[#5145CD] focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
