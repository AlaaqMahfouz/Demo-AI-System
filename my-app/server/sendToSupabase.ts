import { TaskType } from '@google/generative-ai';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");

//resume content parsed into a json template through AI-Parsing2.ts
const resumeData: any =  {
    "name": "Gebran Elias Nemes",
    "phoneNumbers": ["+9617777777"],
    "websites": [],
    "emails": ["gebrannemes2003@gmail.com"],
    "dateOfBirth": "4 sept 2003",
    "addresses": [
      {
        "street": "",
        "city": "Beirut",
        "state": "",
        "zip": "",
        "country": "Lebanon"
      }
    ],
    "summary": "",
    "education": [
      {
        "school": "Collège St. Elie Btina",
        "degree": "",
        "fieldOfStudy": "",
        "startDate": "2006",
        "endDate": "2021"
      },
      {
        "school": "Lebanese University, Faculty of Science II",
        "degree": "Bachelor in Computer Science",
        "fieldOfStudy": "",
        "startDate": "2021",
        "endDate": ""
      }
    ],
    "workExperience": [],
    "projects": [
      {
        "projectName": "Front-end website project",
        "languages": "HTML, CSS, JavaScript",
        "startDate": "",
        "endDate": ""
      },
      {
        "projectName": "React-based online marketplace project",
        "languages": "React, JavaScript, HTML, CSS, Tailwind CSS, Flowbite-React, MySQL",
        "startDate": "",
        "endDate": ""
      },
      {
        "projectName": "Android project",
        "languages": "Android, PhpMyAdmin",
        "startDate": "",
        "endDate": ""
      }
    ],
    "skills": [
      {
        "skillName": "Problem Solving"
      },
      {
        "skillName": "Attention to Detail"
      },
      {
        "skillName": "Responsibility"
      },
      {
        "skillName": "Team Spirit"
      },
      {
        "skillName": "Sportsmanship"
      },
      {
        "skillName": "Leadership Skills"
      },
      {
        "skillName": "Helping Others"
      }
    ],
    "certifications": [
      {
        "certificationName": "Lebanese Civil Defence Certificate"
      },
      {
        "certificationName": "IEEE Clustering Techniques Certificate"
      }
    ],
    "languages": [
      {
        "languageName": "Arabic",
        "proficiency": "Native, Fluent"
      },
      {
        "languageName": "French",
        "proficiency": "Fluent"
      },
      {
        "languageName": "English",
        "proficiency": "Fluent"
      }
    ]
};



//splitting the json 
export async function splitJSON(parsedJSON: any) {
    
    try{
        //insert JSON data into Supabase table
        const { data, error } = await client.from('documents').insert(parsedJSON);
        if (error) {
            console.error('Error inserting data:', error.message);
        } else {
        console.log('Data inserted successfully:', data);
        }

        

       
        
        console.log("Successfully send to DB");
    }catch(error){
        console.error('Error sending to the DB:', error);
    }
}
// splitJSON(resumeData); //call function
