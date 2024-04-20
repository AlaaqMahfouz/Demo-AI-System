import { GoogleGenerativeAI } from '@google/generative-ai';
import {isEmptyString} from './index';
import { createClient } from "@supabase/supabase-js";

/*
    functions found in this file:
    -convertText : convertes the search text into a structured requirements using GEMINI AI
    -searchDatabase: performs the search in the database
    -saveSearch: stores the search requirements and the search result in the database
    -searchAgain: returns search results not previously given  
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
  
    const jsonTemplate: string = `{
      "addresses": {
          "city": "",
          "state": "",
          "country": ""
      },
      "education": 
          {
              "school": [""],
              "degree": [""],
              "fieldOfStudy": [""],
              "startDate": "",
              "endDate": ""
          }
      ,
      "workExperience": 
          {
              "company": "",
              "position": "",
              "startDate": "",
              "endDate": ""
          }
      ,
      "projects": 
          {
              "projectName": "",
              "languages": "",
              "startDate": "",
              "endDate": ""
          }
      ,
      "skills": {
          "skillName": ""
      },
      "certifications": 
          {
              "certificationName": ""
          }
      ,
      "languages": 
          {
              "languageName": "",
              "proficiency": ""
          }
      
  }`;
    
      
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
//this function takes the structured search string (returned by convertText) and the number of results wanted and an array of selected resumes
//for new searches this array should be empty
//for searching again we should pass the already 
//it performs a search query in the database based of this structure and returns an array of the selected resumes as JSON objects
export async function searchDatabase(structuredSearchString: string, inputNumber: number, selectedResumes: number[]): Promise<any[]> {

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
                selectResume(selectedResumes, resume.resumeID);
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
              selectResume(selectedResumes, resume.resumeID);
            } 
          }
        }
      }
    }

    //from the resume table we select the rows of the resumes that matches the search requirements 
    //we make sure to limit the number of selected rows to the desired number of results and we order ascendently by their IDs
    const {data , error} = await client.from('resumes').select('resumeID, name').in('resumeID',selectedResumes).limit(inputNumber).order('resumeID');
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
    console.error('Error searching through the database:', error);
    return [];
  }

  
}
export async function newSearch(structuredSearchString: string, inputNumber: number): Promise<any[]> {
  return searchDatabase(structuredSearchString, inputNumber, [])
}
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

//this function generate new search results to a previous search 
//for the same search requirements it select resumes not previously selected
export async function searchAgain(searchTitle: string, inputNumber: number): Promise<any[]> {
  try {
    // Initialize Supabase client
    const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
  
    let searchID: number = 0;
    let selectedResumes: number []=[];
    //using the search title passed as parameters to the function we select the searchID 
    const {data,error} = await client.from('searches').select('searchID, searchResult').eq('title',searchTitle).single()
    if (error) {
      console.error('Error selecting searchID: ',error.message)
    } else {
      searchID = data.searchID;
      selectedResumes = data.searchResult;
    }

    let structuredSearchString: string = "";
    //using the searchID we get the structured search string (result of the convertText function)
    const {data:selectSearchReq, error: selectSearchReqError} =await client.from('searchRequirements').select('searchRequirement').eq('searchID', searchID).single()
    if (selectSearchReqError) {
      console.error('Error selecting search requirement from searchRequirements table: ', selectSearchReqError.message);
    } else {
      structuredSearchString = selectSearchReq.searchRequirement;
    }

    //we call searchDatabase function passing the structured search string, the input number and the selectedResumes array 
    //in this case the selectedResumes array is non-empty; it has the previously selected resumes in the previous search 
    //so the returned resumes from this function were not previously selected
    return searchDatabase(structuredSearchString, inputNumber,selectedResumes)
  } catch (error) {
    console.error('Error searching again: ',error)
    return []
  }
}

function selectResume(selectedResumes: number[], ID: number){
  //to prevent duplicate IDs in the selectedResumes array 
  if (!selectedResumes.includes(ID)) {
    selectedResumes.push(ID);
  }  
}