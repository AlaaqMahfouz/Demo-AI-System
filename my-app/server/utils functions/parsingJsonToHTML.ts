import { GoogleGenerativeAI } from '@google/generative-ai';
import {isEmptyString} from '../index'
import { getResumeInfo } from './getResumeInfo';

export async function ParsingJsonToHTML(resumeInfo: string): Promise<string> {

  const jsonToParse = resumeInfo;

  if (isEmptyString(jsonToParse)) {
    console.error("json is empty and couldn't be parsed!");
    return '';
  }

  const jsonTemplate: string =
   `{
    'name' : '' ,
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
}`;

  console.log("text to parse :" + jsonToParse);
  const genAI = new GoogleGenerativeAI("AIzaSyBDojqEFTP5MbdXksNPUgh6a1vq84VDIgw"); // your gemini AI API key

  try {
    const generationConfig = {
      maxOutputTokens: 1000,
      temperature: 0.9,
      topP: 0.1,
      topK: 16,
    };

    const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });

    const prompt = `This is a json type text:\n${jsonToParse}\nFollowing the following template:\n${jsonTemplate}\nPlease parse the information into a structured HTML format using only div, ul, ol, li, b, u; while making sure that all missing or null places and information are not included`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let parsedHTML = response.text();
    console.log("parsed text before return it :" + parsedHTML);

    const pattern = /^```HTML|^```html/;
    if(pattern.test(parsedHTML)){
      console.log("html word detected!2")
      parsedHTML = parsedHTML.replace(/^```html\s*|\s*```$/g, '');
      parsedHTML = parsedHTML.replace(/^```HTML\s*|\s*```$/g, '');
    }


    return parsedHTML;

  } catch (error) {
    console.error('Error parsing JSON to HTML:', error);
    return ''; 
  }

}
