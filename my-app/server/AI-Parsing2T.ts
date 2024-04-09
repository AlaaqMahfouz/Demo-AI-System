import { GoogleGenerativeAI } from '@google/generative-ai';
import {isEmptyString} from './index'
/*
this code takes the cv parsed content as a string and parse it into a given JSON format
the returned formated string should be send to Supabase through sendToSupabase.ts
*/

const textToParse: string = `Jane Joseph Beyrouthy
Computer Science Undergraduate Student
Address: Lebanon| E-mail: janebeyrouthy@gmail.com | Mobile: +96176460295 | Nationality: Lebanese
OBJECTIVE
My main objective is to secure an internship where I can learn and grow my skills enabling me to kickstart my
career in data science.
VOLUNTEERING EXPERIENCE/ MEMBERSHIPS
∙ Active Lead of Google Developer Student Clubs – Lebanese University Faculty of Sciences II Fanar since
Aug 2023.
∙ Active Member in Google Developer Group – Coast Lebanon since Dec 2022.
∙ Active Member in Google Developer Student Clubs – Lebanese University Faculty of Sciences II Fanar since
Jan 2023.
∙ Active Member in Women Techmakers since Mar 2023.
∙ Active Member in UCO Beirut (University Christian Outreach) since 2019.
∙ Volunteered in AIESEC Lebanon in 2019.
∙ Volunteered in St Paul Charity mission from 2015 till 2020.
∙ Participated in Parlement des Jeunes (USJ) 2017.
EDUCATION
2022 - Present (expected to graduate in 2025) Computer Science
Lebanese University Faculty of Sciences Second Branch (ULFS2) – Fanar
2019 – 2022 Electrical Engineering (completed the common trunk program)
Lebanese University Faculty of Engineering Second Branch (ULFG2) – Roumieh
2018-2019 Architecture
Lebanese University Faculty of Arts and Architecture (FBAA2) – Furn el Chebbak
2003 - 2018 French Baccalaureate (specialty Mathematics) With Honors
Collège des Sœurs des Saints Cœurs – Ain Saadeh, Ain Najem
LANGUAGES
Arabic: fluent | French: fluent | English: fluent
COMPUTER SKILLS
Microsoft Office (Word, Excel, PowerPoint).
Google Technologies(Docs, Sheets, Slides, Drive).
Object-Oriented Programming, design patterns, database, coding skills and problem-solving skills.
Programming Languages: C++, Java, Python, HTML, CSS, JavaScript, SQL, Android, React, NodeJs.
Communication and Teamwork: Slack, Notion, MS Teams.
`;

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

  const genAI = new GoogleGenerativeAI("AIzaSyBDojqEFTP5MbdXksNPUgh6a1vq84VDIgw"); // Replace with your Google Gemini API key

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
    return ''; // Or you can handle the error differently as per your requirement
  }
}

// Parse(textToParse);
