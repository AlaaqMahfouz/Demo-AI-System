'use-client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchResults from './searchResults'; // Import the SearchResults component

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

  return (
    <div>
      <div>
        <label>Search Title:</label>
        <input
          type="text"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
      </div>

      <div>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div>
        <label>Limit:</label>
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value))}
        />
      </div>

      {/* Render the SearchResults component and pass the searchResults state */}
      <SearchResults results={searchResults} />

      {/* Render the "Save" button if search results are present and not already saved */}
      {searchResults.length > 0 && !savedSearch && (
        <button onClick={handleSaveSearch}>Save Search</button>
      )}
    </div>
  );
};

export default SearchForm;

