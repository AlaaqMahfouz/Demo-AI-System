'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchResults from '../components/searchResults';
import GoHomeHeadband from '../components/goHomeHeadband';
import { redirect } from 'next/navigation';

const SearchForm: React.FC = () => {
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [structuredSearchString, setStructuredSearchString] = useState<string>('');
  const [limit, setLimit] = useState<number>(5);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [savedSearch, setSavedSearch] = useState<boolean>(false); // State to track if search is saved

  useEffect(() => {
    const convertSearchText = async () => {
      try {
        const response = await axios.post('http://localhost:4000/convert-text', { searchText });
        setStructuredSearchString(response.data);
      } catch (error) {
        console.error('Error converting search text:', error);
      }
    };

    convertSearchText(); // Call the conversion function when searchText changes
  }, [searchText]);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:4000/new-search', {
        structuredSearchString,
        limit
      });

      setSearchResults(response.data);
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  const handleSaveSearch = async () => {
    try {
      // Make HTTP POST request to save the search in the database
      const response = await axios.post('/api/save-search', {
        searchTitle,
        structuredSearchString, 
        searchResults // Pass the search results to be saved
      });

      console.log('Search saved successfully:', response.data);
      setSavedSearch(true); // Set savedSearch to true after saving
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  const handleCancel = {
    handleClick: () => {
      redirect("/home");
    },
};

  return (
    <div>
      <GoHomeHeadband/>
      <div className='m-7 font-mono font-bold'>
        <div className='text-6xl text-blue-900 text-center m-12'>
          New Search
        </div>
        <div className='text-center justify-center'>
          <input type="text" value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} placeholder='Insert Search Title' className=' p-4 text-sm bg-gray-200 text-center text-blue-900 border-2 border-blue-900 focus:border-3 placeholder:text-gray-500 rounded-xl'/>
        </div>
        <div className="flex items-center justify-center m-5 mt-12 mb-1">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-100 sr-only">Search Title:</label>
          <div className="relative w-3/4">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-blue-900" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input type="text" id="search_input" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full p-4 ps-10 text-sm bg-gray-200 text-blue-900 border-2 border-blue-900 focus:border-3 placeholder:text-gray-500 rounded-xl" placeholder="Search Requirements..." required />
          </div>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="align-center">
            <label htmlFor="resultNumber" className="mb-2 text-sm font-medium text-indigo-500 mr-3 dark:text-white"></label>
            <div className="flex">
              <p className="text-blue-900 font-bold p-4">
                Number Of Candidates Needed =
              </p>
              <input type="number" value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} id="resultNumber" name="resultNumber" defaultValue='5' min="1" max="20" className="block ps-4 text-sm bg-gray-200 text-center text-blue-900 border-2 border-blue-900 focus:border-3 placeholder:text-gray-500 rounded-xl"  placeholder="5"/>
            </div>
          </div>
        </div>
        <div className='mt-5 mb-7 button-container'>
          <button 
            onClick={handleSearch}
            className="flex m-4 justify-center text-lg bg-blue-800 hover:bg-blue-900 text-white shadow-lg shadow-gray-500 font-extrabold h-min w-15 py-3 px-4 rounded-full"
          >
            Search
            <div className="p-1 ps-3 inset-y-0 start-0 flex items-center pointer-events-none">
              <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
          </button>
        </div>
          
        <hr className="max-w mx-8 mt-4 border-blue-950 border-2 m-12"/>
        {/* Render the SearchResults component and pass the searchResults state */}
        <SearchResults results={searchResults} />

        {/* Render the "Save" button if search results are present and not already saved */}
        {searchResults.length > 0 && !savedSearch && (
          <div className='flex flex-row-reverse space-x-4 space-x-reverse mt-7'>
            <button onClick={handleSaveSearch} className='flex m-4 justify-center text-lg bg-blue-800 hover:bg-blue-900 text-white shadow-lg shadow-gray-500 font-extrabold h-min w-15 py-3 px-4 rounded-full'>Save Search</button>
            <button onClick={handleCancel.handleClick} className="w-full p-3 rounded-full bg-gray-500 text-white hover:bg-gray-700 focus:outline-none"> Cancel </button>
          </div>
          
        )}
      </div>
    </div>
  );
};

export default SearchForm;

