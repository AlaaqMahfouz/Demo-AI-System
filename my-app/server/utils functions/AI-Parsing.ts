import { GoogleGenerativeAI } from '@google/generative-ai';
import {isEmptyString} from '../index'
import { parse } from 'path';
/*
this code takes the extracted content of the inserted CV as a string and parses it into a given JSON format
the returned formated string is then sent to Supabase by sendToSupabase.ts
*/


export async function Parse(textToParse: string): Promise<string> {

  if(isEmptyString(textToParse))
  {
    console.error("text is null and couldn't be parsed!");
    return '';
  }

//   const jsonTemplate: string =
//    "{
//     'name' : '' ,
//     "phoneNumbers": [
//       {
//         "phoneNumber": ""
//       }
//     ],
//     "websites": [
//       {
//         "url": ""
//       }
//     ],
//     "emails": [
//       {
//         "email": ""
//       }
//     ],
//     "dateOfBirth": "",
//     "addresses": [
//       {
//         "street": "",
//         "city": "",
//         "state": "",
//         "zip": "",
//         "country": ""
//       }
//     ],
//     "summary": "",
//     "education": [
//       {
//         "school": "",
//         "degree": "",
//         "fieldOfStudy": "",
//         "startDate": "",
//         "endDate": ""
//       }
//     ],
//     "workExperience": [
//       {
//         "company": "",
//         "position": "",
//         "startDate": "",
//         "endDate": ""
//       }
//     ],
//     "projects": [
//       {
//         "projectName": "",
//         "languages": "",
//         "startDate": "",
//         "endDate": ""
//       }
//     ],
//     "skills": [
//       {
//         "skillName": ""
//       }
//     ],
//     "certifications": [
//       {
//         "certificationName": ""
//       }
//     ],
//     "languages": [
//       {
//         "languageName": "",
//         "proficiency": ""
//       }
//     ]
// }";

const jsonTemplate: string = 
  '{' +
  '"name": "",' +
  '"phoneNumbers": [' +
    '{' +
      '"phoneNumber": ""' +
    '}' +
  '],' +
  '"websites": [' +
    '{' +
      '"url": ""' +
    '}' +
  '],' +
  '"emails": [' +
    '{' +
      '"email": ""' +
    '}' +
  '],' +
  '"dateOfBirth": "",' +
  '"addresses": [' +
    '{' +
      '"street": "",' +
      '"city": "",' +
      '"state": "",' +
      '"zip": "",' +
      '"country": ""' +
    '}' +
  '],' +
  '"summary": "",' +
  '"education": [' +
    '{' +
      '"school": "",' +
      '"degree": "",' +
      '"fieldOfStudy": "",' +
      '"startDate": "",' +
      '"endDate": ""' +
    '}' +
  '],' +
  '"workExperience": [' +
    '{' +
      '"company": "",' +
      '"position": "",' +
      '"startDate": "",' +
      '"endDate": ""' +
    '}' +
  '],' +
  '"projects": [' +
    '{' +
      '"projectName": "",' +
      '"languages": "",' +
      '"startDate": "",' +
      '"endDate": ""' +
    '}' +
  '],' +
  '"skills": [' +
    '{' +
      '"skillName": ""' +
    '}' +
  '],' +
  '"certifications": [' +
    '{' +
      '"certificationName": ""' +
    '}' +
  '],' +
  '"languages": [' +
    '{' +
      '"languageName": "",' +
      '"proficiency": ""' +
    '}' +
  ']' +
'}';

// console.log(jsonTemplate);

  console.log("text to parse :" + textToParse);
  const genAI = new GoogleGenerativeAI("AIzaSyBDojqEFTP5MbdXksNPUgh6a1vq84VDIgw"); // your gemini AI API key

  try {
    const generationConfig = {
      stopSequences: ["red"],
      maxOutputTokens: 1000,
      temperature: 0.9,
      topP: 0.1,
      topK: 16,
    };

    const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });

    const prompt = `This is a resume:\n${textToParse}\nPlease parse the information into a JSON format following the structure:\n${jsonTemplate} while making sure that all missing information are set to null`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let parsedJSON = response.text();
    const pattern = /^```JSON|^```json/;
    if(pattern.test(parsedJSON)){
      console.log("json word detected!")
      parsedJSON = parsedJSON.replace(/^```json\s*|\s*```$/g, '');
      parsedJSON = parsedJSON.replace(/^```JSON\s*|\s*```$/g, '');
    }
    console.log("parsed text before return it :" + parsedJSON);
    return parsedJSON;

  } catch (error) {
    console.error('Error parsing CV:', error);
    return ''; 
  }
}


