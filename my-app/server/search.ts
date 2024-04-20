import { GoogleGenerativeAI } from '@google/generative-ai';
import {isEmptyString} from './index';
import { createClient } from "@supabase/supabase-js";

/*
    this code should handle the search through the database based on the user's requirements
    1st we should use Gemini AI to  convert the request into structured data and a query
    then based on this query we search the database, and return the results as a list of candidates
*/

//convertText takes the search string text and converts it into a structured JSON object defined inside the code
//this function returns the JSON object as string to be then used search through the database using searchDatabase function
//the result should be passed to a const variable to be also stored in the database after the user saves his search -> saveSearch
export async function convertText(searchString:string): Promise<string> {

    if(isEmptyString(searchString))
    {
        console.error("text is null and couldn't be converted!");
        return '';
    }
    
    const jsonTemplate: string = `
      {
          "addresses": 
            {
              "city": "",
              "state": "",
              "country": ""
            }
          ,
          "education": [
            {
              "school": [""],
              "degree": [""],
              "fieldOfStudy": [""],
              "startDate": "",
              "endDate": ""
            }
          ],
          "workExperience": [
            {
              "company": "",
              "position": "",
              "startDate": "",
              "endDate": ""
            }
          ],
          "projects": [
            {
              "projectName": "",
              "languages": "",
              "startDate": "",
              "endDate": ""
            }
          ],
          "skills": [
            {
              "skillName": ""
            }
          ],
          "certifications": [
            {
              "certificationName": ""
            }
          ],
          "languages": [
            {
              "languageName": "",
              "proficiency": ""
            }
          ]
      }
      `;
      
    const genAI = new GoogleGenerativeAI("AIzaSyBDojqEFTP5MbdXksNPUgh6a1vq84VDIgw"); // config gemini AI 
      
    try {
        const generationConfig = {
            stopSequences: ["red"],
            maxOutputTokens: 1000,
            temperature: 0.9,
            topP: 0.1,
            topK: 16,
        };
      
        const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });
      
        const prompt = `This is the job requirements:\n${searchString}\nPlease parse the information into this JSON template:\n${jsonTemplate} while making sure that all missing information are set to null.\nRespect the template only and include all requirements.`;
      
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const parsedJSON = response.text();
      
        return parsedJSON;
      
    } catch (error) {
          console.error('Error converting request:', error);
          return ''; 
    }
}

//this function takes the structured search text as string and the number of results desired 
//using the structured JSON object we perform the searching using a select query that passes through the entire database
//we store the selected resumes' IDs in an array and make sure that we dont have duplicates ids
//using this array we would select all the resumes' names
//the return of this function is an array of JSON objects
export async function searchDatabase(structuredSearchString: string, inputNumber: number): Promise<any[]> {

  //call convertText to structure the search text into a JSON format
  //const structuredString = await convertText(searchText);

  if(isEmptyString(structuredSearchString))
    {
        console.error("search is null and couldn't be converted!");
        return [];
    }
  try {
    //the convertText function returns JSON format as a string so we have to parse it into JSON
    const searchJSON = JSON.parse(structuredSearchString);

    // Initialize Supabase client
    const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
    
    const selectedResumes : number[] = []; //initializing the array of the selected resumes' IDs 
    const tables = Object.keys(searchJSON); //the top-level keys of our JSON object matches the tables' titles we want to search through in the database
    //we iterate through each table 
    for (const table of tables) {
      const columns = Object.keys(searchJSON[table]); //the 2nd-level keys of the JSON object matches the columns of each table
      //for each column we select the resume's ID at the row where the value in the database matches the value in the JSON object
      for(const column of columns){
        //in some search cases we can have values as arrays in the JSON object which holds the search requirements 
        if (Array.isArray(searchJSON[table][column])) {
          //so we have to perform the select query for each value of this array 
          for(const value of searchJSON[table][column]){
            //the select query returns the resume ID of the row that matches the requirement making sure we don't match null values together
            const { data, error } = await client.from(table).select('resumeID').ilike(column,`%${value}%`).neq(column,null);
            if (error) {
              //error handeling
              console.error(`Error searching ${table} at ${column}:`, error.message);
              break;
            } else {
              //data is an array of JSON objects with resumeID as the key 
              for(const resume of data){
                //for each resume we make sure this resume was not selected previously using the selectResume function
                selectResume(selectedResumes, resume.resumeID);
             } 
            }
          }
        } else {
          //the case where the value in the JSON object are not an array
          const { data, error } = await client.from(table).select('resumeID').ilike(column,`%${searchJSON[table][column]}%`).neq(column, null);
          if (error) {
              //error handeling
              console.error(`Error searching ${table} at ${column}:`, error.message);
              break;
          } else {
            //data is an array of JSON objects with resumeID as the key
            for(const resume of data){
              //for each resume we make sure this resume was not selected previously using the selectResume function
              selectResume(selectedResumes, resume.resumeID);
            } 
          }
        }
      }
    }

    //from the resume table we select the rows of the resumes that matches the search requirements 
    //we make sure to limit the number of selected rows to the desired number of results and we order ascendently by their IDs
    const {data , error} = await client.from('resumes').select().in('resumeID',selectedResumes).limit(inputNumber).order('resumeID');
    if(error){
      //error handeling
      console.error('Error selecting resumes: ',error);
      return [];
    }else{
      console.log('Successfully selecting resumes');
      return data;
    }
  } catch (error) {
    console.error('Error searching through the database:', error);
    return [];
  }
}

export async function saveSearch(structuredSearchString:string, searchData: any[]) {

  
}

function selectResume(selectedResumes: number[], ID: number){
  //to prevent duplicate IDs in the selectedResumes array 
  if (!selectedResumes.includes(ID)) {
    selectedResumes.push(ID);
  }  
}