import { GoogleGenerativeAI } from '@google/generative-ai';
import {isEmptyString} from '../index';


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