import React, { useEffect } from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const delta = 2; // Number of pages to show on each side of current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // Always show first page
        i === totalPages || // Always show last page
        (i >= currentPage - delta && i <= currentPage + delta) // Show pages around current page
      ) {
        pageNumbers.push(i);
      } else if (pageNumbers[pageNumbers.length - 1] !== '...') {
        // Add ellipsis if it's not already there
        pageNumbers.push('...');
      }
    }

    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center mt-8 space-x-2">
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(page)}
          disabled={page === '...' || page === currentPage}
          className={`py-1.5 px-3 m-1 text-center bg-gray-100 border border-gray-300 rounded-md text-black dark:text-gray-300 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 ${
            currentPage === page ? 'bg-gray-300 dark:bg-gray-400' : ''
          } ${page === '...' ? 'cursor-default' : 'cursor-pointer'}`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;