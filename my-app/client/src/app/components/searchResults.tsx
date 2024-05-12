import React, { useState, FC, FormEvent, useEffect } from 'react';
import CandidateCard from './candidateCard';
import { downloadFolder } from './util_downloadFile';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");


interface SearchResultProps {
  results: any[];
}
// var Results;
const SearchResults:FC<SearchResultProps> = ({ results }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [Results,setResults]=useState<any>();
  // Results=results;

  const handleClick = async (e:FormEvent, result: any) => {

    
    e.preventDefault();
    setSelectedResult(result);
    setIsOpen(true);
    setResults(result);
    console.log("selected files 2 :" + JSON.stringify(result));
    // Send candidateID to backend for parsing
    const response = await fetch('http://localhost:4001/parsing-JSON-To-HTML', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ candidateID: result.resumeID }),
    });

    if (response.ok) {
      const resumeHTML =await  response.text();
    //   Update state with the parsed HTML

    //   Get the files for the selected result
    const files =  await listFiles(result.resumeID);
    console.log("files selected :" + JSON.stringify(files))
    console.log("html : "+ resumeHTML)
    setSelectedResult((prevResult: any) => ({...prevResult, files ,resumeHTML}));
    } else {
      console.error('Error fetching parsed resume information:', response.statusText);
    }
  }
  
  // const fetchParsedResumeHTML=(async (ID:any)=>{
    //    const response = await fetch('http://localhost:4001/parsing-JSON-To-HTML', {
  //     method: 'POST',
  //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ candidateID: ID }),
    //   }).then()
    //   {
      //     return await response.text();
      //     // console.log("response ya 3me : " + await response.text())
      //   };
      // })
    
      
      const handleClose = (): void => {
        setIsOpen(false);
        setSelectedResult(null); // Reset selected result on close
      };
      
      // useEffect(()=>{
        
  // useEffect(() => {

  //   console.log("selected files :" + JSON.stringify(selectedResult?.files))
  //   if (isOpen && selectedResult) {
  //     // Update state with the parsed HTML and files
  //     const parsedResumeHTML =  fetchParsedResumeHTML(selectedResult.resumeID);
  //     console.log("parsed eshya : " + JSON.stringify(parsedResumeHTML))
  //     const files =  listFiles(selectedResult.resumeID);
  //     setSelectedResult((prevResult:any) => ({ ...prevResult, files, resumeInfo: parsedResumeHTML }));
  //   }
  // }, [isOpen]);

    const listFiles = async (resumeID: string): Promise<any[]> => {
      const { data, error } = await supabase.storage
      .from('Supporting Docs')
      .list(`${resumeID}/`);
      
      if (error) {
        console.error('Error listing files:', error);
        return [];
      }
      
      return data || [];
    };
    
  // })

  return (
    <div>
      <div className='container mx-auto flex flex-wrap justify-around'>
        {results.map((result, index) => (
          <div
          key={index}
          className='w-60 cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2'
          onClick={(e) => handleClick(e,result)}
          >
            <p>{result.name}</p>
          </div>
        ))}
      </div>

      {isOpen && selectedResult && (
        <div>
          <div className='fixed top-0 left-0 right-0 bottom-0 bg-gray-500 opacity-75 z-40'>
          </div>
          <div> 
            <CandidateCard isOpen={isOpen} onClose={handleClose} data={selectedResult} resumeInfo={undefined} files={selectedResult} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
