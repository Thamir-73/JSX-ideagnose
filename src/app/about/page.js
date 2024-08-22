"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaTwitter, FaYoutube, FaEnvelope } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const SubstackEmbed = dynamic(() => import('components/SubstackEmbed'), {
  ssr: false
});

const AboutPage = () => {
    const [copied, setCopied] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const revealRefs = useRef([]);
    const email = "Thamir.299@hotmail.com"; // Replace with your actual email

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInn');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      revealRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const copyEmail = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Modern browsers
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setShowEmail(true);
        setTimeout(() => {
          setCopied(false);
          setShowEmail(false);
        }, 3000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
        fallbackCopyTextToClipboard(email);
      });
    } else {
      // Fallback for older browsers
      fallbackCopyTextToClipboard(email);
    }
  };
  
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setShowEmail(true);
        setTimeout(() => {
          setCopied(false);
          setShowEmail(false);
        }, 3000);
      } else {
        console.error('Fallback: Copying text command was unsuccessful');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
  
    document.body.removeChild(textArea);
  };

  return (
    <div className="pt-20 pb-16 px-4 min-h-screen bg-gradient-to-r from-gray-200 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative">
      <div className="absolute inset-0 md:inset-x-4 lg:inset-x-8 top-[5.8rem] bottom-5 bg-gray border border-gray-300 dark:bg-[#2C3E57] dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"></div>
      <div className="max-w-4xl mx-auto relative z-10 pt-[10%] lg:pt-[3%]">
        
        {/* About the Author Section */}
        <section className="mb-16 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md" ref={(el) => (revealRefs.current[0] = el)}>
        <div className="opacity-0 transition-opacity duration-500" ref={(el) => (revealRefs.current[1] = el)}>
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">About The Author</h2>
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/mee1.jpg"
              alt="Author"
              width={200}
              height={200}
              className="rounded-full mb-4"
            />
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl">
              I'm Thamir. I started this blog as an avenue to share my thoughts as I think & research Philosophy, Metaphysics, Science, History, & more.
              <br /><br />
              You know what?
              <br /><br />
              I don't think those "specific" intellectual interests are the only ones, because I'm literally interested in almost everything intellectual, like literally…
              <br /><br />
              So In a nutshell,
              <br />
              I think, Therefore, I write.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center space-x-6 mb-6">
            <a href="https://x.com/Thamirsview" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500 transition-colors">
              <FaTwitter size={24} />
            </a>
            <a href="https://www.youtube.com/@F-1ST-P/videos" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600 transition-colors">
              <FaYoutube size={24} />
            </a>
            <div className="relative">
            <button
  onClick={copyEmail}
  className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
>
  <FaEnvelope size={20} className={copied ? "text-blue-300" : ""} />
  <span>{copied ? 'Copied!' : 'Copy Email'}</span>
</button>
{showEmail && (
  <div className="absolute left-0 top-full mt-2 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-md">
    <p className="text-sm text-gray-700 dark:text-gray-300">{email}</p>
  </div>
)}
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <SubstackEmbed />
          </div>
        </div>
      </section>
        
        {/* About the Blog Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md" ref={(el) => (revealRefs.current[2] = el)}>
        <div className="opacity-0 transition-opacity duration-500" ref={(el) => (revealRefs.current[3] = el)}>
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">About the Blog</h2>
          <div className="text-gray-600 dark:text-gray-400">
            <p className="mb-4">
              If you wanna know more about what the blog is about, specific to your interests, <br /> I made the search very "searchable", <br /><br /> so just use the search to look for words or concepts you're interested in, and if that word was written once, or is in the titles, or is in the categories, you'll find it.
              <br /><br />
              I know you're probably thinking, what the hell is this name (ideagnose), but hear me out:
              <br /><br />
              it was a combination between two words: idea and diagnose. The two words were merged in hope to get a new meaning out of these two words, which is: the trial to "diagnose" different ideas and philosophies.
              <br /><br />
              Makes more sense now , ahlie?
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
);
};

export default AboutPage;