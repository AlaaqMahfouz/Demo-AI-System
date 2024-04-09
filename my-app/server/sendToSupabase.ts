import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");

//resume content parsed into a json template through AI-Parsing2.ts
const resumeData: string =  `{
  "name": "Jane Joseph Beyrouthy",
  "phoneNumbers": [
    {
      "phoneNumber": "+96176460295"
    }
  ],
  "websites": [],
  "emails": [
    {
      "email": "janebeyrouthy@gmail.com"
    }
  ],
  "dateOfBirth": "",
  "addresses": [
    {
      "street": "",
      "city": "Lebanon",
      "state": "",
      "zip": "",
      "country": ""
    }
  ],
  "summary": "My main objective is to secure an internship where I can learn and grow my skills enabling me to kickstart my career in data science.",
  "education": [
    {
      "school": "Lebanese University Faculty of Sciences Second Branch (ULFS2) – Fanar",
      "degree": "Computer Science",
      "fieldOfStudy": "",
      "startDate": "2022",
      "endDate": "2025"
    },
    {
      "school": "Lebanese University Faculty of Engineering Second Branch (ULFG2) – Roumieh",
      "degree": "Electrical Engineering",
      "fieldOfStudy": "",
      "startDate": "2019",
      "endDate": "2022"
    },
    {
      "school": "Lebanese University Faculty of Arts and Architecture (FBAA2) – Furn el Chebbak",
      "degree": "Architecture",
      "fieldOfStudy": "",
      "startDate": "2018",
      "endDate": "2019"
    },
    {
      "school": "Collège des Sœurs des Saints Cœurs – Ain Saadeh, Ain Najem",
      "degree": "French Baccalaureate",
      "fieldOfStudy": "Mathematics",
      "startDate": "2003",
      "endDate": "2018"
    }
  ],
  "workExperience": [],
  "projects": [],
  "skills": [
    {
      "skillName": "Object-Oriented Programming"
    },
    {
      "skillName": "design patterns"
    },
    {
      "skillName": "database"
    },
    {
      "skillName": "coding skills"
    },
    {
      "skillName": "problem-solving skills"
    },
    {
      "skillName": "C++"
    },
    {
      "skillName": "Java"
    },
    {
      "skillName": "Python"
    },
    {
      "skillName": "HTML"
    },
    {
      "skillName": "CSS"
    },
    {
      "skillName": "JavaScript"
    },
    {
      "skillName": "SQL"
    },
    {
      "skillName": "Android"
    },
    {
      "skillName": "React"
    },
    {
      "skillName": "NodeJs"
    },
    {
      "skillName": "Slack"
    },
    {
      "skillName": "Notion"
    },
    {
      "skillName": "MS Teams"
    }
  ],
  "certifications": [],
  "languages": [
    {
      "languageName": "Arabic",
      "proficiency": "fluent"
    },
    {
      "languageName": "French",
      "proficiency": "fluent"
    },
    {
      "languageName": "English",
      "proficiency": "fluent"
    }
  ]
}`;



//send to supabase function 
export async function sendToSupabase(parsedJSON: string) {
    try{
        //the Parse function in AI-Parsing2.ts returns a JSON formated string so we should parse it into a JSON object
        const dataJSON = JSON.parse(parsedJSON);
        
        //array of the top-level keys of the dataJSON object -> array of 13 elements
        const keys =Object.keys(dataJSON);

        //insert into resumes table
        let resume: any ={}; //empty JSON object
        resume[keys[0]] = dataJSON[keys[0]]; //keys[0] = "name"
        resume[keys[4]] = dataJSON[keys[4]]; //keys[4] = "dateOfBirth"
        resume[keys[6]] = dataJSON[keys[6]]; //keys[6] = "summary"
        console.log(resume);
        //query to insert into resumes table
        const { data, error } = await client.from('resumes').insert(resume);
        if (error) {
            console.error('Error inserting into resume table:', error.message);
        } else {
        console.log('Data inserted successfully into resume table:', data);
        }
        //query the resumes table to retrieve the resumeID PK
        const {data: resume_ID, error: resume_IDerr} = await client.from('resumes').select('resumeID').eq('name', resume.name).single();
        if (resume_IDerr) {
          console.error('Error fetching ID from resumes table:', resume_IDerr.message);
        } else {
          const resumeID = resume_ID ? resume_ID.resumeID : null;
          resume.resumeID = resumeID;
          console.log('Fetching resume ID successfully from resumes table:', resume);
        }
        

        // Iterate over the keys of the JSON object
        for (const key of Object.keys(dataJSON)) {
          switch (key) {
            case 'name':
            case 'dateOfBirth':
            case 'summary':
              continue; //skip the keys already stored in resumes table
            default:
              for (const value of dataJSON[key]) {  //value corresponds to 1 row entree 
                value.resumeID=resume.resumeID;     //appending resumeID into value
                //insert the value of the row in it's corresponding table
                const{data: rowData, error: rowError} = await client.from(key).insert(value);
                if (rowError) {
                  console.error(`Error inserting new row in '${key}' table:`, rowError.message);
                } else {
                  console.log(`New row  inserted successfully in '${key}' table:`, rowData);
                }
              }
          }
        }
        console.log("Data successfully sent to Supabase");
    }catch(error){
        console.error('Error sending to the DB:', error);
    }
}
<<<<<<< Updated upstream
// splitJSON(resumeData); //call function
=======
sendToSupabase(resumeData); //call function
>>>>>>> Stashed changes
