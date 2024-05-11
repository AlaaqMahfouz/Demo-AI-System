import { createClient } from "@supabase/supabase-js";

//saveSearchAgain: updates the search result array in the database after searching again
export async function saveSearchAgain(searchID: number, newResults: number[]) {
    try {
      // Initialize Supabase client
      const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
      
      let previousSearchResult: number[] = [];
      //select searchResult from searches
      const {data: selectData, error: selectError} = await client.from('searches').select('searchResult').eq('searchID', searchID).single();
      if ( selectError ) {
        console.error('Error selecting search result from searches table', selectError.message)
      } else {
        previousSearchResult = selectData.searchResult;
      }
  
      const searchResultUpdate = previousSearchResult.concat(newResults); //concat old search results with new search results
      
      //update searchResult in searches
      const{data: updatedata, error: updateError} = await client.from('searches').update({searchResult: searchResultUpdate}).eq('searchID', searchID);
      if (updateError) {
        console.error('Error updating search results in searches: ', updateError.message);
      } else {
        console.log('Update search result successfull ', updatedata);
      }
  
  
    } catch (error) {
      console.error('Error saving search again:', error);
    }
  }