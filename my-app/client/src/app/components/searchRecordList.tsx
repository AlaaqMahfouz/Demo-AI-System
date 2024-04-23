'use-client'

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
          const response = await axios.get<SearchRecord[]>('/api/searches');
          if (response.status === 200) {
            setSearches(response.data);
          } else {
            throw new Error('Failed to fetch searches');
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
        <h1 className="text-3xl font-bold mb-4">Searches</h1>
        <ul>
          {searches.map((search: SearchRecord) => (
            <li key={search.searchID} className="mb-2">
              <span
                onMouseEnter={() => handleHover(search.searchID)}
                onClick={() => handleClick(search.searchID)}
                className="cursor-pointer text-blue-500 hover:text-blue-700"
              >
                {search.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default SearchRecordList;
