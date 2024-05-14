
'use client'


import React, { useState, useEffect, useRef, Suspense } from 'react';
import axios from 'axios';
import SearchResults from '../components/searchResults';
import GoHomeHeadband from '../components/goHomeHeadband';
import { redirect, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SearchRecord from '../components/searchRecord';
import { NextPage } from 'next';

import { useRouter } from 'next/router';

type SearchRecordProps = {
  searchID: number;
  title: string;
};



const SearchRecordPage = () => {

  //extracting searchID and search title from the url
  const searchParams = useSearchParams()!;
  const hasMounted=useRef(false);

  // if (!searchParams.has('searchID') || !searchParams.has('title')) {
  //   return null; // or return a custom message component
  // }
  

  const searchID = searchParams.get('searchID') as unknown as number;
  const title = searchParams.get('title') as unknown as string;

  // if(searchID==null || title == null)
  //   {
  //     return null;
  //   }
  // const [searchID, setSearchID] = useState<number>(parseInt(searchParams.get('searchID') || '0'));
  // const [title, setTitle] = useState<string>(searchParams.get('title')!);

 
  // 
    return (

      <div>
        {/* Pass the searchID and title props to the SearchFormAgain component */}
        <SearchRecord searchID={searchID} title={title} />
      </div>
    );

 
};



export default SearchRecordPage;

