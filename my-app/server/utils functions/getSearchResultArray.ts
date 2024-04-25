import { createClient } from "@supabase/supabase-js";

export async function getSearchResultArray(searchID: number): Promise<number[]> {
    try {
      // Initialize Supabase client
      const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
      
      //query to select searchResult array given the searchID from table searches in the database
      const {data, error} = await client.from('searches').select('searchResult').eq('searchID', searchID).single();
      if (error) {
        //error handeling
        console.error('Error getting searches: ',error.message);
        return [];
      } else {
        
        return data.searchResult;
      }  
    } catch (error) {
        console.error('Error getting search result array: ', error);
        return [];
    }
}