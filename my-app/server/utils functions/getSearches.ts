import { createClient } from "@supabase/supabase-js";

//getSearches: returns all the search titles and searches' IDs saved in the database from newest to oldest
export async function getSearches(): Promise<any[]> {
    try {
      // Initialize Supabase client
      const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
      
      //query to select all the searchID and title from table searches in database sorted from newest to oldest
      const {data, error} = await client.from('searches').select('searchID, title').order('dateOfCreation', {ascending: false});
      if (error) {
        //error handeling
        console.error('Error getting searches: ',error);
        return [];
      } else {
        console.log('Successfully getting searches from db');
        return data
        
      }
    } catch (error) {
      console.error('Error getting saved searches:', error);
      return []
    }
  }