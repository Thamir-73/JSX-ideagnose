"use client";

import React, { useState } from 'react';
import { FaList, FaTimes } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const TableOfContents = dynamic(() => import('../../components/TableOfContents'), { ssr: false });

export default function BlogPostClient({ post }) {
  const [showTOC, setShowTOC] = useState(false);

  const handleTOCItemClick = () => {
    setShowTOC(false);
  };

  if (!post) return null;

  return (
    <>
      {/* Table of Contents for desktop */}
      <div className="hidden lg:block fixed top-[5.6rem] right-4 w-56">
        <TableOfContents content={post.content} onItemClick={() => {}} />
      </div>

      {/* Mobile and Tablet TOC Button */}
      <button
        onClick={() => setShowTOC(!showTOC)}
        className="lg:hidden fixed bottom-5 right-5 bg-gray-400 dark:bg-gray-600 text-white p-3 rounded-full shadow-lg z-50"
        aria-label="Toggle Table of Contents"
      >
        <FaList />
      </button>

      {/* Mobile and Tablet TOC Modal */}
      {showTOC && (
        <div className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-11/12 max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setShowTOC(false)}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-400"
            >
              <FaTimes />
            </button>
            <TableOfContents content={post.content} onItemClick={handleTOCItemClick} />
          </div>
        </div>
      )}
    </>
  );
}