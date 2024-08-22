"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaFolderClosed } from "react-icons/fa6";

const formatCategoryName = (category) => {
  return category
    .split(/[/\-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const CategoryCard = ({ name, color }) => {
  return (
    <Link href={`/categories/${encodeURIComponent(name.toLowerCase())}`}>
      <div 
        className="h-48 rounded-lg flex items-center justify-center relative overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl"
        style={{ backgroundColor: color }}
      >
        <div className="absolute inset-0 opacity-20 backdrop-blur-sm"></div>
        <span className="relative z-10 font-sans text-2xl font-light prose tracking-wide text-shadow-sm px-4 text-center text-white">
          {formatCategoryName(name) || 'Uncategorized'}
        </span>
      </div>
    </Link>
  );
};

export default function CategoriesPage() {
  const [activeRow, setActiveRow] = useState(0);
  const [categories, setCategories] = useState([]);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  const colors = [
    '#8B4513', '#4B0082', '#008080', '#006400', '#8B0000', '#2F4F4F',
    '#800080', '#000080', '#556B2F', '#483D8B', '#8B008B', '#A0522D',
    '#2E8B57', '#4682B4', '#708090'
  ];

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const fetchedCategories = await response.json();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();

    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rowHeight = 200; // Card height (192px) + gap (8px)
        const scrollOffset = window.scrollY - containerRect.top + window.innerHeight / 2;
        const rowProgress = scrollOffset / rowHeight;
        const newActiveRow = Math.max(0, Math.min(Math.floor(rowProgress), Math.ceil(categories.length / (windowWidth >= 768 ? 2 : 1)) - 1));
        
        setActiveRow(newActiveRow);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call to set positions
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories, windowWidth]);

  const isDesktop = windowWidth >= 768;
  const rowCount = Math.ceil(categories.length / (isDesktop ? 2 : 1));

  return (
    <div className="pt-20 pb-16 pr-2 min-h-screen bg-gradient-to-r from-gray-200 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative">
      <div className="absolute inset-0 md:inset-x-4 lg:inset-x-8 top-[5.8rem] right-3 left-5 bottom-5 bg-gray border border-gray-300 dark:bg-[#2C3E57] dark:border-gray-700 rounded-lg shadow-lg"></div>
      <div className="max-w-6xl mx-auto py-2 px-4 sm:px-4 lg:px-6 relative">
        <h2 className="text-2xl item-center font-bold pl-[1.1rem] py-3 text-gray-600 dark:text-gray-400 animate-fadeInnn">
          <FaFolderClosed className="inline-block mr-1 mb-2 size-5.5" />Categories
        </h2>
        <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col items-center justify-center">
          {Array.from({ length: rowCount }).map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 mb-[196px] ml-2 last:mb-0 rounded-full transition-all duration-300 ${activeRow === index ? 'bg-blue-500 scale-150' : 'bg-gray-300'}`}
            ></div>
          ))}
        </div>
        <div 
          ref={containerRef} 
          className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4 opacity-0 animate-fadeInn"
        >
          {!isLoading && categories.map((category, index) => (
            <CategoryCard 
              key={index}
              name={category}
              color={colors[index % colors.length]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}