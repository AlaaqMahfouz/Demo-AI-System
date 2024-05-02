'use client'

import React, { useState, FC } from 'react';
import CandidateCard from './candidateCard';

interface SearchResultProps {
  results: any[]; 
}

const SearchResults: React.FC<SearchResultProps> = ({ results }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  const handleClick = async (result: any) => {
    setSelectedResult(result);
    setIsOpen(true);
    // Send candidateID to backend for parsing
  const response = await fetch('http://localhost:4000/parsing-JSON-To-HTML', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ candidateID: result.resumeID }),
  });

  if (response.ok) {
    const parsedResumeHTML = await response.text();
    // Update state with the parsed HTML
  } else {
    console.error('Error fetching parsed resume information:', response.statusText);
  }
  };

  const handleClose = (): void => {
    setIsOpen(false);
    setSelectedResult(null); // Reset selected result on close
  };

  return (
    <div>
      <div className="sm:text-6xl text-5xl text-blue-900 text-center m-12">
        New Search Results
      </div>
      <div className='container mx-auto flex flex-wrap justify-around'>
        {results.map((result, index) => (
          <div
          key={index}
          className='w-60 cursor-pointer w- flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'
          onClick={() => handleClick(result)}
          >
            <p>{result.name}</p>
          </div>
        ))}
      </div>

      {isOpen && selectedResult && (
        <div>
          <div className='fixed top-0 left-0 right-0 bottom-0 bg-gray-500 opacity-75 z-40'>
          </div>
          <div> 
            <CandidateCard isOpen={isOpen} onClose={handleClose} data={selectedResult} resumeInfo={undefined} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
