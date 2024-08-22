"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch, FaQuoteLeft } from 'react-icons/fa';

const renderQuoteWithTags = (quote) => {
  // Remove HTML comments
  const quoteWithoutComments = quote.replace(/<!--[\s\S]*?-->/g, '');
  
  return quoteWithoutComments.split(/<br\s*\/?>/i).map((part, index) => (
    <React.Fragment key={index}>
      {index > 0 && <br />}
      {part.split(/(<b>.*?<\/b>)/).map((subPart, subIndex) => {
        if (subPart.startsWith('<b>') && subPart.endsWith('</b>')) {
          return <b key={subIndex}>{subPart.slice(3, -4)}</b>;
        }
        return subPart;
      })}
    </React.Fragment>
  ));
};


const QuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [visibleQuotes, setVisibleQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);
  const lastQuoteRef = useRef(null);
  const quoteRefs = useRef([]);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/quotes');
      if (!response.ok) {
        throw new Error(`Failed to fetch quotes: ${response.status} ${response.statusText}`);
      }
      const quotesList = await response.json();
      if (!Array.isArray(quotesList)) {
        throw new Error(`Unexpected response format: ${JSON.stringify(quotesList)}`);
      }
      setQuotes(quotesList);
      setFilteredQuotes(quotesList);
      setVisibleQuotes(quotesList.slice(0, 10));
      setError(null);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setError(`Failed to load quotes: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    const filtered = quotes.filter(quote => 
      quote.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuotes(filtered);
    setVisibleQuotes(filtered.slice(0, 10));
    setIsSearching(searchTerm.length > 0);
    setNoResults(searchTerm.length > 0 && filtered.length === 0);
  }, [searchTerm, quotes]);

  useEffect(() => {
    const currentQuoteRefs = quoteRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInnn');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    currentQuoteRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentQuoteRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [visibleQuotes]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleQuotes.length < filteredQuotes.length) {
          setVisibleQuotes(prev => [
            ...prev,
            ...filteredQuotes.slice(prev.length, prev.length + 10)
          ]);
        }
      },
      { threshold: 1 }
    );

    if (lastQuoteRef.current) {
      observerRef.current.observe(lastQuoteRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [filteredQuotes, visibleQuotes]);

  const SkeletonQuote = () => (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md animate-pulse2">
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="pt-20 pb-16 px-4 min-h-screen bg-gradient-to-r from-gray-200 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative">
      <div className="absolute inset-x-4 top-[5.8rem] bottom-5 bg-gray border border-gray-300 dark:bg-[#2C3E57] dark:border-gray-700 rounded-lg shadow-lg"></div>
      <div className="max-w-4xl mx-auto py-2 px-4 sm:px-6 lg:px-8 relative">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200 border-b-2 border-gray-300 dark:border-gray-600 pb-2 mt-8">Quotes</h1>
        
        <div className="mb-8 p-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">What is this Page?</h2>
          <p className="text-gray-600 dark:text-gray-400">
            This page will be a library for all the quotes I write down to convey my ideas concisely, and in a poetic way (poetic on my level at least)...
          </p>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search Quotes/Words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
          />
          <FaSearch 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${isSearching ? 'animate-pulse2' : ''}`}
            style={{
              color: isSearching 
                ? (noResults ? '#ef4444' : '#3b82f6') // red-500 for no results, blue-500 for results
                : '#9ca3af' // gray-400 when not searching
            }}
          />
        </div>
        
        {isLoading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <SkeletonQuote key={index} />
            ))}
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-6">
        {visibleQuotes.map((quote, index) => (
          <div
            key={index}
            ref={(el) => {
              quoteRefs.current[index] = el;
              if (index === visibleQuotes.length - 1) {
                lastQuoteRef.current = el;
              }
            }}
            className={`bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md opacity-0 transition-opacity duration-500 ease-in-out relative ${
              isSearching && quote.toLowerCase().includes(searchTerm.toLowerCase())
                ? 'border-2 border-blue-500'
                : ''
            }`}
          >
            <FaQuoteLeft className="absolute top-4 left-4 text-gray-300 dark:text-gray-600 text-4xl opacity-50" />
            <p className="text-gray-500 dark:text-gray-300 pl-8 prose-lg">
              {renderQuoteWithTags(quote)}
            </p>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default QuotesPage;