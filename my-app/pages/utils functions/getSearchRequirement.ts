import { createClient } from "@supabase/supabase-js";

//getSearchRequirements: returns search requirements saved in the database
export async function getSearchRequirement(searchID: number): Promise<string> {
    try {
      // Initialize Supabase client
      const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
  
      //query to select search requirements from searchRequirements table
      const {data, error} = await client.from('searchRequirements').select('searchRequirement').eq('searchID', searchID).single();
      if (error) {
        console.error('Error getting search requirements: ', error.message);
        return ''
      } else {
        return data.searchRequirement;
      }
    } catch (error) {
      console.error('Error getting search requirements:', error);
      return ''
    }
  }