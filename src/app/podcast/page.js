"use client";

import React, { useState, useEffect } from 'react';
import { FaYoutube } from 'react-icons/fa';

const EpisodeSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
    </div>
  </div>
);

export default function PodcastPage() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestEpisodes() {
      try {
        const response = await fetch('/api/podcast');
        const data = await response.json();
        setEpisodes(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching latest episodes:', error);
        setLoading(false);
      }
    }

    fetchLatestEpisodes();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <section className="relative w-full max-w-7xl mx-auto mt-20 min-h-[calc(100vh-6rem)]">
        <div className="absolute inset-0 md:inset-x-4 lg:inset-x-8 top-2 bottom-4 bg-gray border border-gray-300 dark:bg-[#2C3E57] dark:border-gray-700 rounded-lg shadow-lg"></div>
        <div className="relative py-10 px-4 md:px-8 lg:px-12 min-h-[calc(100vh-6rem)]">
          <div className="mx-auto max-w-6xl text-gray-800 dark:text-gray-200 min-h-[calc(100vh-10rem)]">
            <h1 className="text-3xl font-bold mb-8 text-center text-slate-700 dark:text-slate-300">Latest Podcast Episodes</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {loading
                ? Array(2).fill().map((_, index) => <EpisodeSkeleton key={index} />)
                : episodes.map((episode) => (
                    <div key={episode.videoId} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 animate-fadeIn">
                      <div className="w-full h-60 md:h-68 lg:h-76">
                        <iframe
                          src={`https://www.youtube.com/embed/${episode.videoId}`}
                          title={episode.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                      <div className="p-4">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{episode.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{episode.description.slice(0, 100)}...</p>
                        <div className="flex justify-between items-center">
                          <a
                            href={`https://www.youtube.com/watch?v=${episode.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center"
                          >
                            <FaYoutube className="mr-2" /> Watch on YouTube
                          </a>
                          <span className="text-sm border border-gray-600 text-gray-500 dark:text-gray-400 dark:border-gray-400 rounded-xl px-1 lg:px-2">
                            {new Date(episode.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}