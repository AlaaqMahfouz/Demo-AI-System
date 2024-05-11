'use client'

import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import Link from 'next/link';
import UrlComponent from './urlComponent';

interface SearchRecordDetails {
  searchID: number,
  title: string;
}

const SearchRecordList: React.FC = () => {

  const [searches, setSearches] = useState<SearchRecordDetails[]>([]);
  
  useEffect(() => {
    const getSearches = async () => {
      try {
        const response = await axios.get('http://localhost:4000/get-searches');
        
        const searchesList: SearchRecordDetails[] =  await response.data;
        setSearches(searchesList);
      } catch (error) {
        console.error(error);
      }
    };

    getSearches();
  }, []);

  
    return (
          <Suspense>
      <div className="container mx-auto">
        <div className="text-3xl text-center font-semibold mb-7">Searches</div>
        <ul>
          {searches.length > 0 ? (searches.map((search) => (

            <li key={search.searchID} className="mb-2">
              <UrlComponent searchID={search.searchID} title={search.title}/>
            </li>
          ))) : (
            <li>
              <Link href={'/newSearch'} passHref>
                <span className="flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 text-blue-900 hover:shadow-xl hover:shadow-blue-900  font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2">
                  0 Saved Searches 
                </span>
              </Link>
            </li>
          )}
        </ul>
      </div>
          </Suspense>
    );
  };
  
  export default SearchRecordList;
