'use client'

import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import SearchResults from '../components/searchResults';
import GoHomeHeadband from '../components/goHomeHeadband';
import { redirect, useSearchParams } from 'next/navigation';

interface SearchRecord {
  searchID: number,
  title: string;
}

const SearchFormAgain: React.FC = () => {
  const searchParams = useSearchParams()!;
  const [searchID, setSearchID] = useState<number>(parseInt(searchParams.get('searchID') || '0'));
  const [title, setTitle] = useState<string>(searchParams.get('title')!);
  const [searchRecord, setSearchRecord] = useState<SearchRecord>();
  //const searchID = parseInt(searchParams.get('searchID')!);
  //const title = searchParams.get('title')!;
  const [previousSearchResults, setPreviousSearchResults] = useState<any[]>([]);
  const [searchRequirements, setSearchRequirements] = useState<any>();
  const [limit, setLimit] = useState<number>(5);

  const getSearchRequirements = async () => {
    try {
      // Make HTTP GET request to retrieve the search requirements from the database
      const response = await axios.get('http://localhost:4000/get-search-requirement', {params: {
        searchID: searchID
      }});

      const requirements = await response.data;
      console.log('Search Requirements: ', requirements);
      const reqJSON = JSON.parse(requirements);
      console.log('Search Requirements JSON: ', reqJSON);
      setSearchRequirements(reqJSON);
      
    } catch (error) {
      console.error('Error getting search requirements:', error);
    }
  };

  const getSearchResults = async () => {
    try {
      // Make HTTP GET request to retrieve the search requirements from the database
      const response = await axios.get('http://localhost:4000/get-search-result', {params: {
        searchID: searchID
      }});

      const oldResults = await response.data;
      console.log('1st Search Results: ', oldResults);
      setPreviousSearchResults(oldResults);
    } catch (error) {
      console.error('Error getting search results:', error);
    }
  }

  useEffect(() => {
    console.log('search id: ', searchID);
    getSearchRequirements();
    getSearchResults();
  }, [])

  const handleSearchAgain = async () => {
    try {
      const response = await axios.post('http://localhost:4000/new-search', {
        limit
      });

    //   setSearchResults(response.data);
    } catch (error) {
      console.error('Error performing search:', error);
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
          {title}
        </div>
        <div className="max-w-screen-xl mx-auto">
          <p className="sm:text-3xl text-3xl text-blue-900 text-center m-4">
            Search Requirements:
          </p>
          <p className="text-blue-900 font-bold p-4">
            {JSON.stringify(searchRequirements)}
          </p>
        </div>

        <hr className="max-w mx-8 mt-4 border-blue-950 border-2 m-12"/>
        {/* Render the SearchResults component and pass the searchResults state */}
        <div className="sm:text-3xl text-3xl text-blue-900 text-center m-12">
           Search Results
        </div>
        <SearchResults results={previousSearchResults} /> 

        <hr className="max-w mx-8 mt-4 border-blue-950 border-2 m-12"/>
        <div className="flex items-center justify-center h-full">
          <div className="align-center">
            <label htmlFor="resultNumber" className="mb-2 text-sm font-medium text-indigo-500 mr-3 dark:text-white"></label>
            <div className="flex">
              <p className="text-blue-900 font-bold p-4">
                Number Of New Candidates Needed =
              </p>
              <input type="number" value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} id="resultNumber" name="resultNumber" defaultValue='5' min="1" max="20" className="block ps-4 text-sm bg-gray-200 text-center text-blue-900 border-2 border-blue-900 focus:border-3 placeholder:text-gray-500 rounded-xl"  placeholder="5"/>
            </div>
          </div>
        </div>
        <div className='mt-5 mb-7 button-container'>
          <button 
            onClick={handleSearchAgain}
            className="flex m-4 justify-center text-lg bg-blue-800 hover:bg-blue-900 text-white shadow-lg shadow-gray-500 font-extrabold h-min w-15 py-3 px-4 rounded-full"
          >
            Search Again
            <div className="p-1 ps-3 inset-y-0 start-0 flex items-center pointer-events-none">
              <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
          </button>
        </div>
          
        <hr className="max-w mx-8 mt-4 border-blue-950 border-2 m-12"/>
        {/* Render the NEW SearchResults component and pass the searchResults state */}
        {/*<div className="sm:text-6xl text-5xl text-blue-900 text-center m-12">
           Search Results
        </div>
        <SearchResults results={previousSearchResults} /> */}

        {/* Render the "Save" button if search results are present and not already saved */}
        {/* {searchResults.length > 0 && !savedSearch && (
          <div className='flex flex-row-reverse space-x-4 space-x-reverse mt-7'>
            <button onClick={handleSaveSearch} className='flex m-4 justify-center text-lg bg-blue-800 hover:bg-blue-900 text-white shadow-lg shadow-gray-500 font-extrabold h-min w-15 py-3 px-4 rounded-full'>Save Search</button>
            <button onClick={handleCancel.handleClick} className="w-full p-3 rounded-full bg-gray-500 text-white hover:bg-gray-700 focus:outline-none"> Cancel </button>
          </div>
          
        )} */}
      </div>
    </div>
  );
};

export default SearchFormAgain;
