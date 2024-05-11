import { createClient } from "@supabase/supabase-js";
import { getResumes } from './getResumes';

//getSearchResult: return the result of the saved search
export async function getSearchResult(searchID: number): Promise<any[]> {
    try {
      // Initialize Supabase client
      const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
  
      let searchResult: number[] = [];
      //query to get the result array from searches
      const {data:selectData, error: selectError} = await client.from('searches').select('searchResult').eq('searchID', searchID).single();
      if (selectError) {
        console.error('Error getting search result array: ', selectError.message);
      } else {
        searchResult = selectData.searchResult;
      }
  
      return getResumes(searchResult, searchResult.length); //call getResumes to return the resumesID and name 
  
    } catch (error) {
      console.error('Error getting search results: ', error);
      return [];
    }
    
  }