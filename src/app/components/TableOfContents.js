'use client';

import React, { useState, useEffect } from 'react';

export default function TableOfContents({ content, onItemClick }) {
  const [activeId, setActiveId] = useState('');
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (content && typeof content === 'string') {
      const extractedHeadings = content.match(/^#{1,3} .+$/gm) || [];
      setHeadings(extractedHeadings);
    }
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-60px 0px -85% 0px' }
    );

    headings.forEach((heading) => {
      const id = heading.replace(/^#+\s/, '').toLowerCase().replace(/\s/g, '-');
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (e, href) => {
    e.preventDefault();
    const targetId = href.slice(1);
    const element = document.getElementById(targetId);
    if (element) {
      onItemClick();
      setTimeout(() => {
        element.scrollIntoView({ block: 'start' });
        setTimeout(() => {
          window.scrollTo({
            top: element.offsetTop - 200,
            behavior: 'smooth'
          });
        }, 0);
      }, 100);
    }
  };

  if (headings.length === 0) {
    return <div>No headings found</div>;
  }

  return (
    <nav className="border border-gray-700 dark:border-gray-400 dark:bg-gray p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Table of Contents</h2>
      <ul className="space-y-2">
        {headings.map((heading, index) => {
          const level = heading.match(/^#+/)[0].length;
          const title = heading.replace(/^#+\s/, '');
          const href = `#${title.toLowerCase().replace(/\s/g, '-')}`;
          const isActive = activeId === href.slice(1);
          return (
            <li key={index} style={{ paddingLeft: `${(level - 1) * 0.5}rem` }}>
              <a 
                href={href}
                onClick={(e) => handleClick(e, href)}
                className={`text-blue-400 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-100 transition-colors duration-200 flex items-center ${isActive ? 'font-semibold' : ''}`}
                style={{ fontWeight: 450 }}
              >
                <span className={`mr-2 text-md ${isActive ? 'text-blue-500 dark:text-blue-300 glow' : 'text-gray-400 dark:text-gray-500'}`}>•</span>
                {title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}