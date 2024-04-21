'use-client'

import React from 'react';

interface SearchResultProps {
  results: any[]; 
}

const SearchResults: React.FC<SearchResultProps> = ({ results }) => {
  return (
    <div>
      <h2>Search Results</h2>
      <div>
        {results.map((result, index) => (
          <div key={index}>
            <p>Name: {result.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
