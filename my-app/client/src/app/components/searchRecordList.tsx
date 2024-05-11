'use client'

import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { stringify } from 'querystring';
import Link from 'next/link';

interface SearchRecord {
  searchID: number,
  title: string;
}

const SearchRecordList: React.FC = () => {

  const [searches, setSearches] = useState<SearchRecord[]>([]);
  
  useEffect(() => {
    const getSearches = async () => {
      try {
        const response = await axios.get('http://localhost:4000/get-searches');
        
        const searchesList: SearchRecord[] =  await response.data;
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
              <Link href={{
                pathname: '/searchRecord',
                query:{
                  searchID: search.searchID,
                  title: search.title
                }
              }}  passHref>
                <span className="cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2">
                  {search.title}
                </span>
              </Link>
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
