import React, { forwardRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendar, FaFolder } from 'react-icons/fa';
import LightBulbIndicator from './LightBulbIndicator';

const Card = forwardRef(({ image, title, comment, date, category, className, isActive, isBulged, style, slug }, ref) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [delayedBulge, setDelayedBulge] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, parseFloat(style?.animationDelay || '0') + 500);

    return () => clearTimeout(timer);
  }, [style?.animationDelay]);

  useEffect(() => {
    if (isBulged) {
      const bulgeTimer = setTimeout(() => {
        setDelayedBulge(true);
      }, 120);
      return () => clearTimeout(bulgeTimer);
    } else {
      setDelayedBulge(false);
    }
  }, [isBulged]);

  return (
    <div 
      ref={ref}
      className={`
        ${className || ''} 
        relative group overflow-visible p-4 rounded-xl 
        border border-gray-400
        dark:bg-gray-800 dark:border-gray-300 
        mb-6 w-full max-w-4xl mx-auto 
        transition-all duration-200 ease-in-out
        ${hasLoaded && delayedBulge 
          ? 'scale-105 shadow-2xl z-10'
          : 'scale-100 shadow-lg z-0'}
      `}
      style={style}
    >        
      <div className={`flex flex-col sm:flex-row gap-4 animate-fadeIn`}>
        {image && (
          <div className="w-full sm:w-1/4 h-48 sm:h-auto relative pt-3 pb-2">
            <LightBulbIndicator isActive={isActive} />
            <div className="w-full h-full relative border border-gray-600 rounded-lg overflow-hidden">
            <Image 
              src={image} 
              alt={title || 'Post image'} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-lg object-cover"
              unoptimized={image.endsWith('.gif')}
            />
            </div>
          </div>
        )}
        <div className={`w-full ${image ? 'sm:w-3/4' : ''} flex flex-col justify-between`}>
          <div>
            <Link href={`/blog/${slug}`}>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-300 leading-tight tracking-tight hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">{title || 'Untitled Post'}</h2>
            </Link>
            {comment && <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">{comment}</p>}
            <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
              {date && (
                <>
                  <FaCalendar className="mr-2" />
                  <span className="mr-4">{date}</span>
                </>
              )}
            {category && (
            <Link href={`/categories/${encodeURIComponent(category.toLowerCase())}`} className="flex items-center hover:text-blue-500 transition-colors duration-200">
              <FaFolder className="mr-2" />
              <span>{category}</span>
            </Link>
          )}
            </div>
          </div>
          <Link href={`/blog/${slug}`}>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 self-start transition-colors duration-300">Read</button>
          </Link>
        </div>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;