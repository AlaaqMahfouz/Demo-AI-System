import { createClient } from "@supabase/supabase-js";

//this function saves the search we performed using searchDatabase function in the searches and searchRequirements tables in the database
//as paramerters this function takes the search title (user input), the structured search string (result of convertText) and the search data (result of searchDatabase)
export async function saveSearch(searchTitle: string, structuredSearchString:string, searchData: any[]) {
    try {
      
      // Initialize Supabase client
      const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
      console.log("search Data" + JSON.stringify(searchData))
      console.log("structured string from save search :" + structuredSearchString)
      let search: any={}; //empty JSON object
      search.title = searchTitle; //appending the title to search 
      search.dateOfCreation = new Date().toLocaleString('en-US', { timeZone: 'Asia/Beirut' })
      let searchResult : number[] = []; //array to store the resume IDs of the search results
      for(const resume of searchData){
        // const keys = Object.keys(searchData); //keys = ['resumeID','name'] 
        // console.log("keys :" +JSON.stringify(keys))
        console.log("value of first key :" + resume[0])
        searchResult.push(resume['resumeID']); //resume[resumeID]
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

// format date to match the format of Date field of saved search in supabase
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const timezoneOffset = date.getTimezoneOffset();
  const timezoneOffsetSign = timezoneOffset > 0 ? '-' : '+';
  const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffset / 60)).toString().padStart(2, '0');
  const timezoneOffsetMinutes = Math.abs(timezoneOffset % 60).toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}${timezoneOffsetSign}${timezoneOffsetHours}-${timezoneOffsetMinutes}`;
}