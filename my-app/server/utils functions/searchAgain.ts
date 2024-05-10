import { createClient } from "@supabase/supabase-js";
import { searchDatabase } from './searchDatabase';

//this function generate new search results to a previous search 
//for the same search requirements it select resumes not previously selected
export async function searchAgain(searchID: number, inputNumber: number): Promise<any> {
    try {
      // Initialize Supabase client
      const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
    
      let previouslySelectedResumes: number []=[];
      //using the search title passed as parameters to the function we select the searchID 
      const {data,error} = await client.from('searches').select('searchResult').eq('searchID',searchID).single()
      if (error) {
        console.error('Error selecting searchID: ',error.message);
        return { resumes: [], searchResult: [] }
      } else {
        previouslySelectedResumes = data.searchResult;
      }
  
      let structuredSearchString: string = "";
      //using the searchID we get the structured search string (result of the convertText function)
      const {data:selectSearchReq, error: selectSearchReqError} =await client.from('searchRequirements').select('searchRequirement').eq('searchID', searchID).single()
      if (selectSearchReqError) {
        console.error('Error selecting search requirement from searchRequirements table: ', selectSearchReqError.message);
        return { resumes: [], searchResult: [] }
      } else {
        structuredSearchString = selectSearchReq.searchRequirement;
      }
      
      //we call searchDatabase function passing the structured search string, the input number and the selectedResumes array 
      //in this case the selectedResumes array is non-empty; it has the previously selected resumes in the previous search 
      //so the returned resumes from this function were not previously selected
      // Call searchDatabase function passing the structured search string and input number
      const resumesResult = await searchDatabase(structuredSearchString, inputNumber, previouslySelectedResumes);

      // Extract resume IDs from the search result
      let resultArray: number[] =[];
      resumesResult.forEach(resume => {
        resultArray.push(resume.resumeID);
      })

      // Construct the response object
      const result = {
        resumes: resumesResult,
        searchResult: resultArray
      };
      return result;
    } catch (error) {
      console.error('Error searching again: ',error)
      return []
    }
  }