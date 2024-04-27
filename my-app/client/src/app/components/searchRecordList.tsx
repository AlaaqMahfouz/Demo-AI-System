'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SearchRecord{
    searchID: number;
    title: string;
}

const SearchRecordList: React.FC = () => {

    const [searches, setSearches] = useState<SearchRecord[]>([]);
  
    useEffect(() => {
      const getSearches = async () => {
        try {
          const response = await axios.get<SearchRecord[]>('http://localhost:4000/get-searches');
          if (response.status === 200) {
            setSearches(response.data);
          } else {
            throw new Error('Failed to get searches from backend');
          }
        } catch (error) {
          console.error(error);
        }
      };
  
      getSearches();
    }, []);
  
    const handleHover = (searchId: number) => {
      console.log(`Hovered over search with ID: ${searchId}`);
      // You can perform any action you want when hovering over a search
    };
  
    const handleClick = (searchId: number) => {
      console.log(`Clicked on search with ID: ${searchId}`);
      // You can perform any action you want when clicking on a search
    };
  
    return (
      <div className="container mx-auto">
        <div className="text-3xl text-center font-semibold mb-7">Searches</div>
        <ul>
          {searches.map((search: SearchRecord) => (
            <li key={search.searchID} className="mb-2">
              <span
                onMouseEnter={() => handleHover(search.searchID)}
                onClick={() => handleClick(search.searchID)}
                className="cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2"
              >
                {search.title}
              </span>
            </li>
          ))}
        </ul>
        {/* example */}
        <div className=''>
          <span className='cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'>
            Software Engineer<br></br>
          </span>
        </div>
        <div className=''>
          <span className='cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'>
            Software Engineer<br></br>
          </span>
        </div>
        <div className=''>
          <span className='cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'>
            Software Engineer<br></br>
          </span>
        </div>
        <div className=''>
          <span className='cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'>
            Software Engineer<br></br>
          </span>
        </div>
        <div className=''>
          <span className='cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'>
            Software Engineer<br></br>
          </span>
        </div>
        <div className=''>
          <span className='cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'>
            Software Engineer<br></br>
          </span>
        </div>
      </div>
    );
  };
  
  export default SearchRecordList;
