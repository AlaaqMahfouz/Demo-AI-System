import { GoogleGenerativeAI } from '@google/generative-ai';
import {isEmptyString} from './index'
/*
this code takes the cv parsed content as a string and parse it into a given JSON format
the returned JSON object should be send to Supabase through sendToSupabase.ts
*/

const textToParse: string = `
Curriculum Vitae
Gebran Elias Nemes
Personal Information
• Full Name: Gebran Elias Nemes • Phone Number: +9617777777 • E-mail: gebrannemes2003@gmail.com • Birthdate: 4 sept 2003 • Adress: Beirut,Lebanon
Academics
• School: Collège St. Elie Btina, Beirut, Lebanon (2006-2021)
• University: 3rd year Bachelor in Computer Science, Lebanese University, Faculty of Science II, Fanar, Lebanon (2021 - Present)
• Relevant Coursework: React, HTML/CSS/JavaScript, SQL.
• Other Coursework: C, C++, Java, Assembly, Prolog, Networking, MATLAB, Android.
• Platforms: VScode, Eclipse, Android Studio, VS2022, Oracle, ide68000, MATLAB, Packet Tracer, Visual Paradigm, 
GitHub.
Experience & Certifications
• Developed a front-end website project during the second year of university, utilizing HTML, CSS, and JavaScript. 
(https://github.com/GN1370/Better-Mental-State.git)
• Developed a React-based online marketplace project during the current third year of university, utilizing React (libraries axios,
react router dom, express, cors), JavaScript, HTML, CSS, Tailwind CSS, Flowbite-React, MySQL.
• Developed a project during the current third year of university, utilizing Android (Asynctask), PhpMyAdmin.
• Obtained the Lebanese Civil Defence Certificate. (2023)
• Attended the IEEE Clustering Techniques Certificate program. (January 2022)
• Provided private tutoring in all subjects for school students in Arabic, French and English (2014 - Present).
Personal Traits
• Problem Solving
• Attention to Detail
• Responsibility
• Team Spirit
• Sportsmanship
• Leadership Skills
• Helping Others
Skills and Hobbies
• Scout. (2009 - Present)
• Film-Making/Acting.
• Photography.
• Arts & Crafts.
• Drawing/Painting.
• Cooking/Baking.
• Swimming/Shallow Diving
Languages
• Arabic (Native, Fluent) • French (Fluent) • English (Fluent)
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
    "phoneNumbers": [""],
    "websites": [""],
    "emails": [""],
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
