"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Pagination from '../../components/Pagination';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

const PostSkeleton = () => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md p-5 mb-8 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
    <div className="flex items-center space-x-4 mb-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
    </div>
    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
  </div>
);

const formatCategoryName = (category) => {
    return decodeURIComponent(category)
      .split(/[/\-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  export default function CategoryPage({ params }) {
    const { category } = params;
    const decodedCategory = decodeURIComponent(category);
    const formattedCategory = formatCategoryName(category);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;
  
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await fetch(`/api/posts?category=${encodeURIComponent(decodedCategory)}`);
          const data = await response.json();
          setPosts(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching posts:', error);
          setIsLoading(false);
        }
      };
  
      fetchPosts();
    }, [decodedCategory]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <div className="pt-20 pb-16 px-4 min-h-screen bg-gradient-to-r from-gray-200 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative">
      <div className="absolute inset-0 md:inset-x-4 lg:inset-x-8 top-[5.8rem] bottom-5 bg-gray border border-gray-300 dark:bg-[#2C3E57] dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"></div>
      <div className="max-w-4xl mx-auto pt-7 relative">
        <div className="bg-gray-100 dark:bg-gray-800 py-6 px-6 rounded-t-lg">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{formattedCategory}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isLoading ? 'Loading...' : `${posts.length} post${posts.length !== 1 ? 's' : ''} in this category`}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 py-0 rounded-b-lg flex flex-col min-h-[calc(100vh-16rem)]">
          <div className="space-y-8 flex-grow">
            {isLoading ? (
              Array(postsPerPage).fill().map((_, index) => <PostSkeleton key={index} />)
            ) : (
              currentPosts.map((post, index) => (
                <Link href={`/blog/${post.slug}`} key={index}>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 p-5 mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-2" />
                        {calculateReadingTime(post.content)} min read
                      </div>
                    </div>
                    {post.excerpt && (
                      <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
          {!isLoading && posts.length > postsPerPage && (
            <div className="mt-auto pt-1 pb-2">
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
}