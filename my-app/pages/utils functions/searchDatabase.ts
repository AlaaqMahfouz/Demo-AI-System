import {isEmptyString} from '../index';
import { createClient } from "@supabase/supabase-js";
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
      console.log('SearchJSON string: ', structuredSearchString);
      const searchJSON = JSON.parse(structuredSearchString);
      console.log('Search JSON: ', searchJSON);
      // Initialize Supabase client
      const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
      
      //let selectedResumes: number[] = [];
      // Use Set to store selected resume IDs (avoids duplicates)
      const selectedResumes = new Set<number>();

      const tables = Object.keys(searchJSON); //the top-level keys of our JSON object matches the tables' titles we want to search through in the database
      //we iterate through each table 
      for (const table of tables) {
        if (searchJSON[table].length > 0) {
          for (let index = 0; index < searchJSON[table].length; index++) {
            const columns = Object.keys(searchJSON[table][index]);
            console.log('Columns: ',columns);
            for(let i = 0; i < columns.length; i++){
              //in some cases, the searches values in the requirements are arrays 
              //i.g. "degree" : [Bachelor's, Master's]
              const searchValue = searchJSON[table][index][columns[i]]; // Access value for current column
              console.log('search value: ', searchValue);
              if(Array.isArray(searchValue)){
                //so we have to perform the select query for each value of this array
                for(const value of searchValue){
                  console.log(`Comparing with ${value}.....`);
                  const { data, error } = await client.from(table).select('resumeID').ilike(columns[i], `%${value}%`).neq(columns[i], null);
                  if (error) {
                    console.error(`Error searching ${table} inside ${columns[i]}: `, error);
                    continue;
                  } else {
                    //data is an array of JSON objects with resumeID as the key
                    for(const resume of data){
                      console.log(`select resume ID: ${resume.resumeID}`);
                      //for each resume we make sure this resume was not selected previously using the selectResume function
                      if (!previouslySelectedResumes.includes(resume.resumeID)) {
                        console.log(`resume ID inside result array: ${resume.resumeID}`);
                        //selectResume(selectedResumes, resume.resumeID);
                        selectedResumes.add(resume.resumeID);
                      }
                    }
                  }
                }
              }else{
                console.log(`Comparing with ${searchValue}.....`);
                  const { data, error } = await client.from(table).select('resumeID').ilike(columns[i], `%${searchValue}%`).neq(columns[i], null);
                  if (error) {
                    console.error(`Error searching ${table} inside ${columns[i]}: `, error);
                    continue;
                  } else {
                    //data is an array of JSON objects with resumeID as the key
                    for(const resume of data){
                      console.log(`select resume ID: ${resume.resumeID}`);
                      //for each resume we make sure this resume was not selected previously using the selectResume function
                      if (!previouslySelectedResumes.includes(resume.resumeID)) {
                        console.log(`resume ID inside result array: ${resume.resumeID}`);
                        //selectResume(selectedResumes, resume.resumeID);
                        selectedResumes.add(resume.resumeID);
                      }
                    }
                  }
              }
            }
          }
        }
      }
      console.log(selectedResumes);
      return getResumes(Array.from(selectedResumes), inputNumber);
    } catch (error) {
      console.error('Error searching through the database:', error);
      return [];
    }  
  }