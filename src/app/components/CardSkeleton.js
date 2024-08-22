import React from 'react';

const CardSkeleton = () => {
  return (
    <div className="bg-gray dark:bg-[#1E293B] border border-gray-700 rounded-xl p-4 mb-6 w-full max-w-4xl mx-auto animate-pulse">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/4 h-48 bg-gray-400 dark:bg-gray-700 rounded-lg"></div>
        <div className="w-full sm:w-3/4 flex flex-col justify-between">
          <div>
            <div className="h-6 bg-gray-400 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
          <div className="h-10 dark:bg-gray-700 rounded w-1/4 mt-4"></div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;