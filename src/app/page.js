"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Card from './components/Card';
import Pagination from './components/Pagination';
import CardSkeleton from './components/CardSkeleton';
import { FaArrowUp } from 'react-icons/fa';

const Page = () => {
  const [cardsData, setCardsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [bulgedCardIndex, setBulgedCardIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const cardsPerPage = 10;
  const cardsRef = useRef([]);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        const postsWithSlugs = sortedData.map(post => ({
          ...post,
          slug: post.slug || generateSlug(post.title)
        }));
        setCardsData(postsWithSlugs);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const scrollDirection = scrollY > lastScrollY.current ? 'down' : 'up';
      lastScrollY.current = scrollY;

      const viewportCenter = viewportHeight / 2;
      let newActiveIndex = -1;
      let newBulgedIndex = -1;
      let closestDistance = Infinity;

      cardsRef.current.forEach((card, index) => {
        if (card) {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.top + rect.height / 2;
          const distance = Math.abs(viewportCenter - cardCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            newActiveIndex = index;
            newBulgedIndex = index;
          }
        }
      });

      if (scrollY < 50 && scrollDirection === 'up') {
        newActiveIndex = 0;
        newBulgedIndex = 0;
      }

      const totalCards = cardsRef.current.length;
      const documentHeight = document.documentElement.scrollHeight;
      const scrolledToBottom = (window.innerHeight + window.scrollY) >= documentHeight - 50;

      if (scrolledToBottom) {
        newActiveIndex = totalCards - 1;
        newBulgedIndex = totalCards - 1;
      }

      setActiveCardIndex(newActiveIndex);
      setBulgedCardIndex(newBulgedIndex);
      setShowScrollTop(scrollY > 300);
    };

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler(); // Call once to set initial state

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  const totalPages = Math.ceil(cardsData.length / cardsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setActiveCardIndex(0);
    setBulgedCardIndex(-1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentCards = cardsData.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <section className="relative w-full max-w-7xl mx-auto mt-20 min-h-[calc(100vh-6rem)]">
        <div className="absolute inset-0 md:inset-x-4 lg:inset-x-8 top-2 bottom-4 bg-gray border border-gray-300 dark:bg-[#2C3E57] dark:border-gray-700 rounded-lg shadow-lg"></div>
        <div className="relative py-10 px-4 md:px-8 lg:px-12 min-h-[calc(100vh-6rem)]">
          <div className="mx-auto max-w-6xl text-gray-300 min-h-[calc(100vh-10rem)]">
            <div className="mt-2 flex flex-col gap-6 pb-20">
              {isLoading
                ? Array(cardsPerPage).fill().map((_, index) => (
                    <CardSkeleton key={index} />
                  ))
                : currentCards.map((card, index) => (
                    <Card
                      key={index}
                      ref={el => cardsRef.current[index] = el}
                      image={card.image}
                      title={card.title}
                      comment={card.comment}
                      date={card.date}
                      category={card.category}
                      className="card"
                      style={{ animationDelay: `${index * 100}ms` }}
                      isActive={index === activeCardIndex}
                      isBulged={index === bulgedCardIndex}
                      slug={card.slug} 
                    />
                  ))}
            </div>
            {!isLoading && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </section>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-gray border border-gray-400 text-white p-3 rounded-2xl shadow-lg hover:bg-gray-600 transition-colors duration-300"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </main>
  );
};

export default Page;