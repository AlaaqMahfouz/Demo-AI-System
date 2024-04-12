import { createClient } from "@supabase/supabase-js";

/*
sendToSupabase function handles storing the extracted data from the uploaded cv into the supabase database 
the content of the json object which structures the extracted data is split into multiple tables and not stored in a single table. 
*/

//send to supabase function 
export async function sendToSupabase(parsedJSON: string) {

    // Initialize Supabase client
    const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
    
    try{
        //the Parse function in AI-Parsing2.ts returns a JSON formated string so we should parse it into a JSON object
        const dataJSON = JSON.parse(parsedJSON);
        
        //array of the top-level keys of the dataJSON object -> array of 13 elements keys=['name', 'phoneNumbers','websites', ...]
        const keys =Object.keys(dataJSON);

         
        //insert into resumes table: we need to fill the resumes table with the name, date of birth and summary values
        let resume: any ={}; //empty JSON object
        resume[keys[0]] = dataJSON[keys[0]]; //keys[0] = "name"
        resume[keys[4]] = dataJSON[keys[4]]; //keys[4] = "dateOfBirth"
        resume[keys[6]] = dataJSON[keys[6]]; //keys[6] = "summary"
        /*
          resume = {
            "name": "CVname",
            "dateOfBirth": "CVdateOfBirth",
            "summary": "CVsummary"
          }
         */
        //query to insert into resumes table
        const { data, error } = await client.from('resumes').insert(resume);
        if (error) {
            console.error('Error inserting into resume table:', error.message);
        } else {
        console.log('Data inserted successfully into resume table:', data);
        }
        //query the resumes table to retrieve the resumeID PK: we need the resumeID value to be added to the rest of the tables for referencing FK
        const {data: resume_ID, error: resume_IDerr} = await client.from('resumes').select('resumeID').eq('name', resume.name).single();
        if (resume_IDerr) {
          console.error('Error fetching ID from resumes table:', resume_IDerr.message);
        } else {
          const resumeID = resume_ID ? resume_ID.resumeID : null;
          resume.resumeID = resumeID; //appending resumeID into the json obj resume to be accessible outside this scope
          /*
            resume = {
              "name": "CVname",
              "dateOfBirth": "CVdateOfBirth",
              "summary": "CVsummary",
              "resumeID": resumeID
            }
          */
          console.log('Fetching resume ID successfully from resumes table:', resume);
        }       
        // Iterate over the keys of the JSON object
        for (const key of Object.keys(dataJSON)) {  //each key corresponds to the table name which we want to insert the values in
          switch (key) {
            case 'name':
            case 'dateOfBirth':
            case 'summary':
              continue; //skip the keys already stored in resumes table
            default:
              for (const value of dataJSON[key]) {  //value corresponds to 1 row entree; value is also a json object
                value.resumeID=resume.resumeID;     //appending resumeID into value since each row needs to reference the cv it belongs to
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


