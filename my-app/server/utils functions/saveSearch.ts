import { createClient } from "@supabase/supabase-js";

//this function saves the search we performed using searchDatabase function in the searches and searchRequirements tables in the database
//as paramerters this function takes the search title (user input), the structured search string (result of convertText) and the search data (result of searchDatabase)
export async function saveSearch(searchTitle: string, structuredSearchString:string, searchData: any[]) {
    try {
      
      // Initialize Supabase client
      const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");

      let search: any={}; //empty JSON object
      search.title = searchTitle; //appending the title to search 
      let searchResult : number[] = []; //array to store the resume IDs of the search results
      for(const resume of searchData){
        const keys = Object.keys(searchData); //keys = ['resumeID','name'] 
        searchResult.push(resume[keys[0]]); //resume[resumeID]
      }
      search.searchResult = searchResult; //appending searchResult array to search 

      /*
        search = {
          "title": "",
          "searchResult": []
        }
       */

      //query to insert into searches table
      const { data: saveSearch, error:insertError } = await client.from('searches').insert(search);
      if (insertError) {
          console.error('Error inserting into searches table:', insertError.message);
      } else {
      console.log( 'Successfully saving search into searches table:', saveSearch);
      }
      let searchID: number = 0;
      //query to select searchID from searches
      const {data, error} = await client.from('searches').select('searchID').eq('title',search.title).single();
      if (error) {
        console.error('Error selecting searchID: ',error.message);
      } else {
        searchID =data.searchID;
      }

      //query to insert into searchRequirements table
      const { data: saveSearchReq, error:insertSearchReqError } = await client.from('searchRequirements').insert({
        "searchRequirement" : structuredSearchString,
        "searchID" : searchID
      });
      if (insertSearchReqError) {
          console.error('Error inserting into searches table:', insertSearchReqError.message);
      } else {
      console.log( 'Successfully saving search into searches table:', saveSearchReq);
      }
    } catch (error) {
      console.error('Error saving search:', error);
    }
}