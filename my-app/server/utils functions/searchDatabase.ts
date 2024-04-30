import {isEmptyString} from '../index';
import { createClient } from "@supabase/supabase-js";
import {selectResume} from './selectResume';
import {getResumes} from './getResumes';

//this function takes the structured search string (returned by convertText) and the number of results wanted and an array of selected resumes
//for new searches this array should be empty
//for searching again we should pass the search result array 
//it performs a search query in the database based of this structure and returns an array of the selected resumes as JSON objects
export async function searchDatabase(structuredSearchString: string, inputNumber: number, previouslySelectedResumes: number[]): Promise<any[]> {


  console.log("string for search :" + structuredSearchString);
    if(isEmptyString(structuredSearchString))
      {
          console.error("search is null and couldn't be converted!");
          return [];
      }
    try {
      //the convertText function returns JSON format as a string so we have to parse it into JSON
      const pattern = /^```JSON|^```json/;
      if(pattern.test(structuredSearchString)){
      console.log("json word detected!")
      structuredSearchString = structuredSearchString.replace(/^```json\s*|\s*```$/g, '');
      structuredSearchString = structuredSearchString.replace(/^```JSON\s*|\s*```$/g, '');
    }
      const searchJSON = JSON.parse(structuredSearchString);
      
      // Initialize Supabase client
      const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
      
      let selectedResumes: number[] = [];
      const tables = Object.keys(searchJSON); //the top-level keys of our JSON object matches the tables' titles we want to search through in the database
      //we iterate through each table 
      for (const table of tables) {
        const columns = Object.keys(searchJSON[table]);
        for(const column of columns){
          //in some cases, the searches values in the requirements are arrays 
          //i.g. "degree" : [Bachelor's, Master's]
          if (Array.isArray(searchJSON[table][column])) {
            //so we have to perform the select query for each value of this array 
            for(const value of searchJSON[table][column]){
              const { data, error } = await client.from(table).select('resumeID').ilike(column,`%${value}%`).neq(column,null);
              if (error) {
                console.error(`Error searching ${table} at ${column}:`, error.message);
                break;
              } else {
                //data is an array of JSON objects with resumeID as the key 
                for(const resume of data){
                  //for each resume we make sure this resume was not selected previously using the selectResume function
                  if (!previouslySelectedResumes.includes(resume.resumeID)) {
                    selectResume(selectedResumes, resume.resumeID);
                  }
               } 
              }
            }
          } else {
            const { data, error } = await client.from(table).select('resumeID').ilike(column,`%${searchJSON[table][column]}%`).neq(column, null);
              if (error) {
                console.error(`Error searching ${table} at ${column}:`, error.message);
                break;
            } else {
              //data is an array of JSON objects with resumeID as the key
              for(const resume of data){
                //for each resume we make sure this resume was not selected previously using the selectResume function
                if (!previouslySelectedResumes.includes(resume.resumeID)) {
                  selectResume(selectedResumes, resume.resumeID);
                }
              } 
            }
          }
        }
      }
  
      return getResumes(selectedResumes, inputNumber);
    } catch (error) {
      console.error('Error searching through the database:', error);
      return [];
    }  
  }