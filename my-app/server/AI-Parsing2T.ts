import { GoogleGenerativeAI } from '@google/generative-ai';
import {isEmptyString} from './index'
/*
this code takes the cv parsed content as a string and parse it into a given JSON format
the returned formated string should be send to Supabase through sendToSupabase.ts
*/


export async function Parse(textToParse: string): Promise<string> {

  if(isEmptyString(textToParse))
  {
    console.error("text is null and couldn't be parsed!");
    return '';
  }

  const jsonTemplate: string = `
{
    "name": "",
    "phoneNumbers": [
      {
        "phoneNumber": ""
      }
    ],
    "websites": [
      {
        "url": ""
      }
    ],
    "emails": [
      {
        "email": ""
      }
    ],
    "dateOfBirth": "",
    "addresses": [
      {
        "street": "",
        "city": "",
        "state": "",
        "zip": "",
        "country": ""
      }
    ],
    "summary": "",
    "education": [
      {
        "school": "",
        "degree": "",
        "fieldOfStudy": "",
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

    const prompt = `This is a resume:\n${textToParse}\nPlease parse the information into a JSON format following the structure:\n${jsonTemplate} while replacing all null values with empty strings`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const parsedJSON = response.text();

    return parsedJSON;

  } catch (error) {
    console.error('Error parsing CV:', error);
    return ''; 
  }
}


