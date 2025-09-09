import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white shadow border fixed bottom-0 w-full">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center">
          © 2023 - {new Date().getFullYear()} Matchpoint, LLC. All rights reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
          <li>
            <a href="/" className="hover:underline me-4 md:me-6">
              About
            </a>
          </li>
          <li>
            <a href="/privacy" className="hover:underline me-4 md:me-6">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="mailto:hello@matchpointai.com" className="hover:underline">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
