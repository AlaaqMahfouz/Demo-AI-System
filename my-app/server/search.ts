import { GoogleGenerativeAI } from '@google/generative-ai';
import {isEmptyString} from './index';
import { createClient } from "@supabase/supabase-js";

/*
    this code should handle the search through the database based on the user's requirements
    1st we should use Gemini AI to  convert the request into structured data and a query
    then based on this query we search the database, and return the results as a list of candidates
*/

const request = `
Bachelor's degree in Computer Science, Software Engineering, or a related field
Proven experience in software development, with a focus on back-end technologies
Strong proficiency in programming languages such as Java, C++, or Python
Knowledge of software development methodologies, tools, and frameworks
Familiarity with databases, SQL, and data modeling
Experience with version control systems, such as Git
Understanding of Agile development methodologies and practices
Excellent problem-solving and analytical skills
Strong communication and interpersonal skills
Ability to work collaboratively in a team environment
`;

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
      
        const prompt = `This is the job requirements:\n${searchString}\nPlease parse the information into this JSON template:\n${jsonTemplate} while replacing all null values with empty strings.\nRespect the template only and include all requirements.`;
      
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const parsedJSON = response.text();
      
        return parsedJSON;
      
    } catch (error) {
          console.error('Error converting request:', error);
          return ''; 
    }
}
//searchDatabase(convertRequest(searchText))
export async function searchDatabase(searchText: string): Promise<any[]> {

  //call convertText to structure the search text into a JSON format
  const structuredString = await convertText(searchText);

  if(isEmptyString(structuredString))
    {
        console.error("search is null and couldn't be converted!");
        return [];
    }
  try {
    const searchJSON = JSON.parse(structuredString);

    // Initialize Supabase client
    const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");

    const selectedResumes : number[] = []; //array of the selected resumes' IDs 
    const tables = Object.keys(searchJSON); 
    for (const table of tables) {
      const columns = Object.keys(searchJSON[table]);
      for(const column of columns){
        if (Array.isArray(searchJSON[table][column])) {
          for(const value of searchJSON[table][column]){
            const { data, error } = await client.from(table).select('resumeID').ilike(column,`%${value}%`);
            if (error) {
              console.error(`Error searching ${table} at ${column}:`, error.message);
              break;
            } else {
             for(const resume of data){
              selectResume(selectedResumes, resume.resumeID);
             } 
            }
          }
        } else {
          const { data, error } = await client.from(table).select('resumeID').ilike(column,`%${searchJSON[table][column]}%`);
            if (error) {
              console.error(`Error searching ${table} at ${column}:`, error.message);
              break;
            } else {
             for(const resume of data){
              selectResume(selectedResumes, resume.resumeID);
             } 
            }
        }
      }
    }
    const {data , error} = await client.from('resumes').select('name').in('resumeID',selectedResumes);
    if(error){
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

function selectResume(selectedResumes: number[], ID: number){
  //to prevent duplicate IDs in the selectedResumes array 
  if (!selectedResumes.includes(ID)) {
    selectedResumes.push(ID);
  }  
}