'use client'

import React from 'react';

interface SearchResultProps {
  results: any[]; 
}

const SearchResults: React.FC<SearchResultProps> = ({ results }) => {
  return (
    <div className="">
      <div className="text-6xl text-blue-900 text-center m-12">
        New Search Results
      </div>
      <div className='container mx-auto flex-wrap justify-around'>
        {results.map((result, index) => (
          <div key={index} className='w-60 cursor-pointer w- flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'>
            <p>Name: {result.name}</p>
          </div>
        ))}
      </div>
      {/* Exapmles */}
      <div className="flex flex-wrap justify-around">
        <div className=''>
            <span className='w-60 cursor-pointer w- flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'>
              Gebran Nemes<br></br>
            </span>
        </div>
        <div className=''>
            <span className='w-60 cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'>
              Jane Beyrouthy<br></br>
            </span>
        </div>
        <div className=''>
            <span className='w-60 cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'>
              Alaa Mahfouz<br></br>
            </span>
        </div>
        <div className=''>
            <span className='w-60 cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'>
              Theodor Rahme<br></br>
            </span>
        </div>
        <div className=''>
            <span className='w-60 cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'>
              Anthony Kreidy<br></br>
            </span>
        </div>
        <div className=''>
            <span className='w-60 cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'>
              Nour Adabachy<br></br>
            </span>
        </div>
        <div className=''>
            <span className='w-60 cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'>
              Dr. Bernadette Wakim<br></br>
            </span>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
