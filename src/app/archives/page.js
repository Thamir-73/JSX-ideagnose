"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Pagination from '../components/Pagination';
import { FaCalendarAlt, FaFolder, FaSearch } from 'react-icons/fa';
import { FaFolderClosed } from 'react-icons/fa6';

const PostSkeleton = () => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm animate-pulse p-4 mb-4">
    <div className="flex justify-between items-center mb-2">
      <div className="bg-gray-200 dark:bg-gray-600 h-4 w-24 rounded"></div>
      <div className="bg-gray-200 dark:bg-gray-600 h-4 w-24 rounded"></div>
    </div>
    <div className="bg-gray-200 dark:bg-gray-600 h-6 w-3/4 rounded"></div>
  </div>
);

const YearSkeleton = () => (
  <div className="mb-8">
    <div className="bg-gray-200 dark:bg-gray-600 h-8 w-20 rounded mb-4"></div>
    {[...Array(5)].map((_, index) => (
      <PostSkeleton key={index} />
    ))}
  </div>
);

const ArchivesPage = () => {
  const [posts, setPosts] = useState([]);
  const [groupedPosts, setGroupedPosts] = useState({});
  const [activeYear, setActiveYear] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const postsPerPage = 15;
  const yearRefs = useRef({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const grouped = groupPostsByYear(posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage));
    setGroupedPosts(grouped);
  }, [posts, currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let newActiveYear = null;

      Object.keys(yearRefs.current).forEach(year => {
        const element = yearRefs.current[year];
        if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
          newActiveYear = year;
        }
      });

      setActiveYear(newActiveYear);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 50);
    };

    scrollToTop();
  }, [currentPage]);

  const groupPostsByYear = useCallback((posts) => {
    return posts.reduce((acc, post) => {
      const year = new Date(post.date).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(post);
      return acc;
    }, {});
  }, []);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSearch = useCallback((event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
  
    if (term.length > 0) {
      const results = posts.filter(post => 
        post.title.toLowerCase().includes(term) || 
        post.content.toLowerCase().includes(term) ||
        (post.category && post.category.toLowerCase().includes(term))
      ).map(post => ({
        ...post,
        context: findSearchContext(post.content, term)
      }));
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [posts]);

  const findSearchContext = useCallback((content, term) => {
    const index = content.toLowerCase().indexOf(term);
    if (index === -1) return '';
    const start = Math.max(0, index - 30);
    const end = Math.min(content.length, index + term.length + 30);
    return '...' + content.slice(start, end) + '...';
  }, []);

  return (
    <div className="pt-20 pb-16 px-4 min-h-screen bg-gradient-to-r from-gray-200 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative">
      <div className="absolute inset-0 md:inset-x-4 lg:inset-x-8 top-[5.8rem] bottom-5 bg-gray border border-gray-300 dark:bg-[#2C3E57] dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"></div>
      <div className="max-w-4xl mx-auto pt-7 relative">
        <div className="bg-gray-100 dark:bg-gray-800 py-3 pb-0 px-6 rounded-t-lg ">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-400">Archives</h2>
          <div className="relative mt-4 ">
            <input
              type="text"
              placeholder="Search archives..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {searchResults.length > 0 && (
            <div className="absolute z-20 left-6 right-6 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              {searchResults.map((result, index) => (
                <Link key={index} href={`/blog/${result.slug}`}>
                  <div className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-200 dark:border-gray-300 last:border-b-0">
                    <div className="font-semibold text-gray-800 dark:text-gray-200">{result.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-500">
                        <FaFolderClosed className="mr-1" />
                        Category: {result.category || 'Uncategorized'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {result.context.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) => 
                        part.toLowerCase() === searchTerm.toLowerCase() 
                          ? <span key={i} className="bg-blue-200 dark:bg-blue-600">{part}</span> 
                          : part
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 min-h-[calc(100vh-10rem)] rounded-b-lg flex flex-col">
          <div className="space-y-8 flex-grow">
            {isLoading ? (
              [...Array(3)].map((_, index) => <YearSkeleton key={index} />)
            ) : (
              Object.entries(groupedPosts).sort(([a], [b]) => b - a).map(([year, yearPosts]) => (
                <div key={year} ref={el => yearRefs.current[year] = el} className="relative">
                  <h2 className={`text-2xl rounded-xl font-semibold mb-4 sticky top-20 pl-3 bg-white dark:bg-gray-900 py-2 z-10 transition-all duration-300 ${activeYear === year ? 'text-blue-500 glow' : 'text-gray-700 dark:text-gray-300'}`}>
                    {year}
                  </h2>
                  <ul className="space-y-4">
                    {yearPosts.map((post, index) => (
                      <li key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                        <Link href={`/blog/${post.slug}`} className="block hover:bg-gray-50 dark:hover:bg-gray-800 p-4 transition-colors duration-200">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <FaCalendarAlt className="mr-2" />
                              {new Date(post.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <FaFolder className="mr-2" />
                              {post.category || ''}
                            </div>
                          </div>
                          <div className="text-lg font-medium text-gray-800 dark:text-gray-200">{post.title}</div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
          {!isLoading && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivesPage;