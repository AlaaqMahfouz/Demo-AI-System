import { createClient } from "@supabase/supabase-js";

//getResumeInfo: returns the parsed resumeInfo
export async function getResumeInfo(resumeID: number): Promise<string> {
    try {
      // Initialize Supabase client
      const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
      
      
      //query to select resume info from resumes tables
      const {data, error} = await client.from('resumes').select('resumeInfo').eq('resumeID', resumeID).single();
      if (error) {
        //error handeling
        console.error('Error getting searches: ',error);
        return '';
      } else {
        return data.resumeInfo;
      }
    } catch (error) {
      console.error('Error getting resume information:', error);
      return ''
    }
  }