'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchResults from '../components/searchResults';
import GoHomeHeadband from '../components/goHomeHeadband';
import { redirect, useSearchParams } from 'next/navigation';
import Link from 'next/link';


const SearchFormAgain: React.FC = () => {

  //extracting searchID and search title from the url
  const searchParams = useSearchParams()!;
  const [searchID, setSearchID] = useState<number>(parseInt(searchParams.get('searchID') || '0'));
  const [title, setTitle] = useState<string>(searchParams.get('title')!);
  
  //to display search details 
  const [searchRequirements, setSearchRequirements] = useState<any>();
  const [keys, setKeys] = useState<string[]>([]);
  const [previousSearchResults, setPreviousSearchResults] = useState<any[]>([]);

  //for search again
  const [limit, setLimit] = useState<number>(5);
  const [newSearchResults, setNewSearchResults] = useState<any[]>([]);

  //for save again
  const [savedSearch, setSavedSearch] = useState<boolean>(false); // State to track if search is saved
  const [newResults, setNewResults] = useState<number[]>([]);

  const getSearchRequirements = async () => {
    try {
      // Make HTTP GET request to retrieve the search requirements from the database
      const response = await axios.get('http://localhost:4000/get-search-requirement', {params: {
        searchID: searchID
      }});

      const requirements = await response.data; //the response is a string
      const reqJSON = JSON.parse(requirements); //parsing the string into a JSON object
      const array = Object.keys(reqJSON);       //array holds all the top-level keys of the JSON object
      setKeys(array);                           //keys is an array of the top-level keys of the JSON object
      setSearchRequirements(reqJSON);           //search requirements saved in the database after the 1st search
    } catch (error) {
      console.error('Error getting search requirements:', error);
    }
  };

  const getSearchResults = async () => {
    try {
      // Make HTTP GET request to retrieve the saved search results from the database
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

  useEffect(() => {
    console.log('Keys:', keys); //control results
  }, [keys]);
  
  useEffect(() => {
    console.log('Search Requirements:', searchRequirements); //control results
  }, [searchRequirements]);

  const renderJSON = (searchRequirements: any) => {  //this function renders the JSON object searchRequirements to a customized display
    const elements: any[] = []; // Array to store JSX elements
    for (const key of keys) {   // Iterate over each key in the 'keys' array
      let keyHeading;           // Variable to store the heading for the key
      let itemsList;            // Variable to store the list of items for the key

      // Check if the array of items for the current key is not empty
      if (searchRequirements[key] && searchRequirements[key].length > 0) {
        // Depending on the key, set the heading and itemsList accordingly
        switch (key) {
          case 'addresses':
            keyHeading = 'Addresses';
            itemsList = (
              <ul>
                {searchRequirements[key].map((address: any, index: number) => (
                  <li key={index}>
                    {address.city}, {address.state}, {address.country}
                  </li>
                ))}
              </ul>
            );
            break;
          case 'education':
            keyHeading = 'Education';
            itemsList = (
              <ul>
                {searchRequirements[key].map((education: any, index: number) => (
                  <li key={index}>
                    {education.school} - {education.degree}
                  </li>
                ))}
              </ul>
            );
            break;
          case 'workExperience':
            keyHeading = 'Work Experience';
            itemsList = (
              <ul>
                {searchRequirements[key].map((workExp: any, index: number) => (
                  <li key={index}>
                    {workExp.position} at {workExp.company}
                  </li>
                ))}
              </ul>
            );
            break;
          case 'projects':
            keyHeading = 'Projects';
            itemsList = (
              <ul>
                {searchRequirements[key].map((project: any, index: number) => (
                  <li key={index}>
                    {project.projectName} ({project.startDate} - {project.endDate})
                  </li>
                ))}
              </ul>
            );
            break;
          case 'skills':
            keyHeading = 'Skills';
            itemsList = (
              <ul>
                {searchRequirements[key].map((skill: any, index: number) => (
                  <li key={index}>
                    {skill.skillName}
                  </li>
                ))}
              </ul>
            );
            break;
          case 'certifications':
            keyHeading = 'Certifications';
            itemsList = (
              <ul>
                {searchRequirements[key].map((certification: any, index: number) => (
                  <li key={index}>{certification.certificationName}</li>
                ))}
              </ul>
            );
            break;
          case 'languages':
            keyHeading = 'Languages';
            itemsList = (
              <ul>
                {searchRequirements[key].map((language: any, index: number) => (
                  <li key={index}>
                    {language.languageName} ({language.proficiency})
                  </li>
                ))}
              </ul>
            );
            break;
        }
        
        // Push JSX elements for the current key and its items to the 'elements' array
        elements.push(
          <div key={key}>
            {/* Display the heading for the key */}
            <p className="sm:text-3xl text-3xl text-blue-900 text-center m-4">
              {keyHeading}
            </p>
            {/* Display the list of items for the key */}
            {itemsList}
          </div>
        );
      } 
    }
    // Return the array of JSX elements
    return elements;
  };
  

  const handleSearchAgain = async () => {
    try {
      const response = await axios.post('http://localhost:4000/search-again', {
        searchID,
        limit
      });
      let result: any = await response.data;
      console.log('Resumes found: ', result.resumes);
      setNewSearchResults(result.resumes);
      console.log('Result array: ', result.searchResult);
      setNewResults(result.searchResult);
    } catch (error) {
      console.error('Error performing search again:', error);
    }
  };

  const handleSaveAgain = async () => {
    try {
      // Make HTTP POST request to save the search in the database
      const response = await axios.post('http://localhost:4000/save-search-again', {
        searchID,
        newResults
      });

      console.log('Search saved successfully:', response.data);
      setSavedSearch(true); // Set savedSearch to true after saving

      // Combine the new search results with the previous ones
      setPreviousSearchResults(prevResults => [...prevResults, ...newSearchResults]);
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
          {title}
        </div>
        <div className="max-w-screen-xl mx-auto">
          <p className="sm:text-3xl text-3xl text-blue-900 text-center m-4">
            Search Requirements:
          </p>
          <div className='text-blue-900 p-4 text-center'>
            {/*JSON.stringify(searchRequirements)*/}
            {renderJSON(searchRequirements)}
          </div>
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
        {/* Render the "Save" button if search results are present and not already saved */}
        {newSearchResults.length > 0 && !savedSearch && (
          <div>
            {/* Render the SearchResults component and pass the searchResults state */}
            <div className="sm:text-6xl text-5xl text-blue-900 text-center m-12">
              New Search Results
            </div>
            <SearchResults results={newSearchResults} />
            <div className='flex flex-row-reverse justify-center space-x-4 space-x-reverse mt-7'>
              <button onClick={handleSaveAgain} className=' m-3 text-lg bg-blue-800 hover:bg-blue-900 text-white shadow-lg shadow-gray-500 font-extrabold h-14 w-44 py-3 px-4 rounded-full'>Save Search</button>
              <Link href="/home">
                <button className="w-44 p-3 m-3 h-14 rounded-full bg-gray-500 text-white font-extrabold hover:bg-gray-700 focus:outline-none"> Cancel </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFormAgain;
