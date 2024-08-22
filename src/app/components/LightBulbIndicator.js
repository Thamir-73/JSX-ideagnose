"use client";

import React from 'react';

const LightBulbIcon = ({ isActive }) => (
  <svg className={`w-7 h-7 ${isActive ? 'text-yellow-400' : 'text-gray-400'}`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5C13.9249 5 9 9.92487 9 16C9 20.2641 11.1849 23.9775 14.4467 26.078C15.3424 26.6975 15.9167 27.6509 15.9167 28.6822V33C15.9167 34.3807 17.0359 35.5 18.4167 35.5H21.5833C22.9641 35.5 24.0833 34.3807 24.0833 33V28.6822C24.0833 27.6509 24.6576 26.6975 25.5533 26.078C28.8151 23.9775 31 20.2641 31 16C31 9.92487 26.0751 5 20 5Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 31H22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    {isActive && (
      <>
        <path d="M20 2V0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M28.2 4.8L30.2 2.8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.8 4.8L9.8 2.8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.8 11.8L2.8 9.8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M35.2 11.8L37.2 9.8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 20H0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M40 20H38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </>
    )}
  </svg>
);

const LightBulbIndicator = ({ isActive }) => {
  return (
    <div className="absolute -left-3.5 -top-3.5 z-10 transition-all duration-300 ease-in-out transform">
      <div className={`relative ${isActive ? 'scale-115' : 'scale-100'}`}>
        <LightBulbIcon isActive={isActive} />
        {isActive && (
          <div className="absolute inset-0 bg-yellow-400 opacity-25 rounded-full blur-md -z-10 animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default LightBulbIndicator;