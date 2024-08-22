"use client";
import { useState, useEffect } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { FaTwitter, FaYoutube, FaCopyright, FaHome } from 'react-icons/fa';
import { FaFolderClosed } from "react-icons/fa6";
import TextReveal from './TextReveal';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PiFileVideo,PiQuotesBold } from "react-icons/pi";
import { RiArchiveStackFill } from "react-icons/ri";
import { FaUserAstronaut } from "react-icons/fa";
import dynamic from 'next/dynamic';

const SubstackEmbed = dynamic(() => import('components/SubstackEmbed'), {
  ssr: false
});



const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setMounted(true);
    fetchPosts();
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSearch = (event) => {
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
  };

  const findSearchContext = (content, term) => {
    const index = content.toLowerCase().indexOf(term);
    if (index === -1) return '';
    const start = Math.max(0, index - 30);
    const end = Math.min(content.length, index + term.length + 30);
    return '...' + content.slice(start, end) + '...';
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  
  const isActive = (path) => {
    if (path === '/categories') {
      // This will make the link active for both /categories and /categories/[category]
      return pathname === path || pathname.startsWith('/categories/') 
        ? 'text-black dark:text-white shadow-custom-light dark:shadow-custom-dark bg-white dark:bg-gray-800' 
        : 'text-gray-400 dark:text-gray-400';
    }

    return pathname === path 
      ? 'text-black dark:text-white shadow-custom-light dark:shadow-custom-dark bg-white dark:bg-gray-800' 
      : 'text-gray-400 dark:text-gray-400';
  };

  if (!mounted) return null;

  return (
    <>
      <nav className="fixed top-0 w-full px-2 pr-2 py-2 flex justify-between items-center bg-[#f8f9fa] dark:bg-[#2c3e50] border-b-2 dark:border-gray-600 backdrop-filter backdrop-blur-lg bg-opacity-70 dark:bg-opacity-70 z-50">
        <Link href="/" className="flex items-center font-bold text-gray-600 dark:text-white">
          <img className="w-14 h-16 pl-1 shadow shadow-gray-200 dark:shadow-gray-600 rounded-lg" src="/penne5.png" alt="ideagnose" />
          <TextReveal className="lg:text-3xl sm:text-[1.6rem] text-[1.7rem] pl-2 text-gray-600 dark:text-gray-400 text-shadow-lg dark:text-shadow-dark-lg transform transition-transform duration-500 hover:translate-y-1 hover:translate-x-1" text="ideagnose"/>
        </Link>

        <div className="lg:hidden flex items-center">
          <button onClick={toggleTheme} className="py-1 px-1.5 m-1 h-9 w-9 text-center bg-gray-100 border border-gray-300 rounded-md text-black dark:text-gray-300 dark:bg-gray-700 flex items-center justify-center">
            {theme === 'dark' ? (
              <svg className="w-6 h-6 text-black dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-black dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            )}
          </button>
          <button onClick={toggleMenu}>
            <MenuIcon className="h-9 w-9 text-black m-1 text-center bg-gray-100 border border-gray-300 rounded-md text-black dark:text-gray-300 dark:bg-gray-700" />
          </button>
        </div>

        <ul className="hidden lg:flex lg:items-center lg:w-auto lg:space-x-6 lg:ml-auto ">
          <li>
            <Link href="/" className={`py-1.5 px-2 text-center border border-gray-200 rounded-lg dark:border-gray-600 hover:text-black dark:hover:text-white ${isActive('/')}`}>
              <FaHome className="inline-block mr-1 pb-1 size-5" />
              Blog
            </Link>
          </li>

          <li>
            <Link href="/archives" className={`py-1.5 px-2 text-center border border-gray-200 rounded-lg dark:border-gray-600 hover:text-black dark:hover:text-white ${isActive('/archives')}`}>
            <RiArchiveStackFill className="inline-block mr-1 pb-1 size-5" />
              Archives
            </Link>
          </li>

           <li>
          <Link href="/quotes" className={`py-1.5 px-2 text-center border border-gray-200 rounded-lg dark:border-gray-600 hover:text-black dark:hover:text-white ${isActive('/quotes')}`}>
            <PiQuotesBold className="inline-block mr-1 pb-1 size-5" />
              Quotes
            </Link>
          </li>

          <li>
            <Link href="/podcast" className={`py-1.5 px-2 text-center border border-gray-200 rounded-lg dark:border-gray-600 hover:text-black dark:hover:text-white ${isActive('/podcast')}`}>
            <PiFileVideo className="inline-block mr-1 pb-1 size-5" />
              Podcast
            </Link>
          </li>

          <li>
          <Link href="/about" className={`py-1.5 px-2 text-center border border-gray-200 rounded-lg dark:border-gray-600 hover:text-black dark:hover:text-white ${isActive('/about')}`}>
            <FaUserAstronaut className="inline-block mr-1 pb-1 size-5" />
              About
            </Link>
          </li>

          <li>
          <Link href="/categories" className={`py-1.5 px-2 text-center border border-gray-200 rounded-lg hover:text-black dark:border-gray-600 dark:hover:text-white ${isActive('/categories')}`}>
        <FaFolderClosed className="inline-block mr-1 pb-1 size-5" />
        Categories
        </Link>
          </li>
         
        
         
         
          <li>
          <div className="relative mx-auto text-gray-600 flex items-center">
  <button onClick={toggleSearch} className="py-1.5 px-3 m-1 text-center bg-gray-100 border border-gray-300 rounded-md text-black dark:text-gray-300 dark:bg-gray-700 focus:outline-none">
    <svg className="text-gray-600 dark:text-gray-200 h-6 w-6 fill-current" viewBox="0 0 56.966 56.966" width="512px" height="512px">
      <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
    </svg>
  </button>
  {isSearchOpen && (
    <div className="relative">
      <input
        className="w-full py-[0.47rem] p-2 pl-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean-blue dark:focus:ring-ocean-blue focus:border-ocean-blue dark:focus:border-ocean-blue"
        type="search"
        name="search"
        placeholder="Search"
        autoComplete="off"
        value={searchTerm}
        onChange={handleSearch}
      />
     {searchResults.length > 0 && (
  <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
    {searchResults.map((result, index) => (
      <Link key={index} href={`/blog/${result.slug}`}>
        <div className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0">
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
  )}
</div>
          </li>
        </ul>

        <div className="hidden lg:flex items-center space-x-6">
          <button id="theme-toggle" type="button" className="py-1.5 px-3 m-1 text-center bg-gray-100 border border-gray-300 rounded-md text-black dark:text-gray-300 dark:bg-gray-700 flex items-center justify-center" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navbar */}
<div className={`navbar-menu fixed top-[4rem] left-0 w-full bg-[#f8f9fa] dark:bg-[#2c3e50] border-b-2 dark:border-gray-600 overflow-hidden z-40 transition-all duration-800 ease-in-out ${isOpen  ? 'max-h-[1000px] opacity-100 transition-max-height duration-500 ease-in-out delay-100' : 'max-h-0 opacity-0 transition-max-height duration-300 ease-in-out'}`}>
<div className="px-4 py-3 flex flex-col items-center">
  <div className="relative text-gray-600 flex justify-center items-center m-3 w-full">
    <div className="flex items-center">
      <button onClick={toggleSearch} className="py-2 px-4 m-1 text-center bg-gray-100 border border-gray-300 rounded-md text-black dark:text-gray-300 dark:bg-gray-700 focus:outline-none">
        <svg className="text-gray-600 dark:text-gray-200 h-7 w-7 fill-current" viewBox="0 0 56.966 56.966" width="512px" height="512px">
          <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
        </svg>
      </button>
      {isSearchOpen && (
        <div className="relative ml-2">
          <input
            className="w-64 sm:w-80 border border-gray-300 placeholder-current h-12 px-6 pr-16 rounded-lg text-base focus:outline-none dark:bg-gray-500 dark:border-gray-50 dark:text-gray-200 focus:ring-2 focus:ring-ocean-blue dark:focus:ring-ocean-blue focus:border-ocean-blue dark:focus:border-ocean-blue"
            type="search"
            name="search"
            placeholder="Search"
            autoComplete="off"
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchResults.length > 0 && (
  <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
    {searchResults.map((result, index) => (
      <Link key={index} href={`/blog/${result.slug}`}>
        <div className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0">
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
      )}
    </div>
  </div>
  <ul className="w-full text-center space-y-5 mb-4">
  {[
    { href: "/", icon: FaHome, text: "Blog" },
    { href: "/archives", icon: RiArchiveStackFill, text: "Archives" },
    { href: "/quotes", icon: PiQuotesBold, text: "Quotes" },
    { href: "/podcast", icon: PiFileVideo, text: "Podcast" },
    { href: "/about", icon: FaUserAstronaut, text: "About" },
    { href: "/categories", icon: FaFolderClosed, text: "Categories" }
  ].map(({ href, icon: Icon, text }) => (
    <li key={href}>
      <Link 
        href={href} 
        className={`inline-flex items-center justify-center w-[9rem] py-1.5 px-3 text-center border border-gray-300 rounded-lg hover:text-black dark:border-gray-600 dark:hover:text-white ${isActive(href)}`}
      >
        <Icon className="inline-block mr-2 size-5" />
        <span>{text}</span>
      </Link>
    </li>
  ))}
</ul>
<div className="mt-4 flex flex-col items-center">

  <div className="flex space-x-4 mb-4">
    <a href="https://x.com/Thamirsview" className="text-gray-400 hover:text-violet-600 dark:text-gray-400 dark:hover:text-white">
      <FaTwitter className="h-6 w-6" />
    </a>
    <a href="https://www.youtube.com/@F-1ST-P/videos" className="text-gray-400 hover:text-violet-600 dark:text-gray-400 dark:hover:text-white">
      <FaYoutube className="h-6 w-6" />
    </a>
  </div>
  <div className="flex justify-center mb-3 ">
            <SubstackEmbed/>
          </div>
  <div className="flex justify-center text-gray-400 dark:text-gray-400">
    <FaCopyright className="mr-1" />
    <span>2024 Thamir</span>
  </div>
</div>
  </div>
</div>
    </>
  );
};

export default Navbar;