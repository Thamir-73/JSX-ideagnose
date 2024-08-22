import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaGithub, FaYoutube, FaCopyright } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const SubstackEmbed = dynamic(() => import('components/SubstackEmbed'), {
  ssr: false
});

const Footer = () => {
  return (
    <footer className="mt-auto pt-4 pb-4 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4">
      <div className="mt-8 mb-8 flex justify-center">
        <SubstackEmbed />
        </div>
        <div className="flex justify-center space-x-6 mb-6">
          <a href="https://x.com/Thamirsview" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <FaTwitter className="h-6 w-6" />
          </a>
          <a href="https://www.youtube.com/@F-1ST-P/videos" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <FaYoutube className="h-6 w-6" />
          </a>
        </div>
        <div className="text-center text-gray-500 dark:text-gray-400 flex items-center justify-center">
          <FaCopyright className="mr-2" />
          <span>2024 Thamir.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;