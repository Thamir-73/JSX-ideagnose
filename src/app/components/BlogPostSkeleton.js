import React from 'react';

const BlogPostSkeleton = () => {
  return (
    <div className="animate-pulse w-full sm:max-w-[95%] md:max-w-full lg:max-w-5xl mx-auto">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg p-6">
        {/* Title */}
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto mb-4"></div>
        
        {/* Author, date, reading time */}
        <div className="flex justify-center space-x-4 mb-8">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        </div>
        
        {/* Content */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          ))}
          
          {/* Image placeholder */}
          <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded w-full my-8"></div>
          
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPostSkeleton;