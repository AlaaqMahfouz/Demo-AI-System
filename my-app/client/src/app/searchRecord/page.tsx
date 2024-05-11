'use client'



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchResults from '../components/searchResults';
import GoHomeHeadband from '../components/goHomeHeadband';
import { redirect, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SearchRecord from '../components/searchRecord';


const SearchRecordPage: React.FC = () => {
  //extracting searchID and search title from the url
  const searchParams = useSearchParams()!;
  const [searchID, setSearchID] = useState<number>(parseInt(searchParams.get('searchID') || '0'));
  const [title, setTitle] = useState<string>(searchParams.get('title')!);
  

  return (
    <div>
      {/* Pass the searchID and title props to the SearchFormAgain component */}
      <SearchRecord searchID={searchID} title={title} />
    </div>
  );
};
export default SearchRecordPage;

