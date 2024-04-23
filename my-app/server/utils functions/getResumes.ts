import { createClient } from "@supabase/supabase-js";

export async function getResumes(selectedResumes: number[], limit: number): Promise<any[]> {
    try {
      // Initialize Supabase client
      const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
  
      //query to select resumeID and name of the search result
      const {data , error} = await client.from('resumes').select('resumeID, name').in('resumeID',selectedResumes).limit(limit).order('resumeID');
      if(error){
        //error handeling
        console.error('Error selecting resumes: ',error);
        return [];
      }else{
        console.log('Successfully selecting resumes');
        data.forEach(element => {
          console.log(" Resumes found :" +element.name)
        });
        //data is an array of JSON objects with the keys being 
        return data;
      }
    } catch (error) {
      console.error('Error getting resumes: ', error);
      return []
    }
  }