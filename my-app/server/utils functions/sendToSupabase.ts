import { createClient } from "@supabase/supabase-js";
import fs from 'fs'
import {v4 as uuidv4} from 'uuid'
import { arrayBuffer } from "stream/consumers";
/*
sendToSupabase function handles storing the extracted data from the uploaded cv into the supabase database 
the content of the json object which structures the extracted data is split into multiple tables and not stored in a single table. 
*/

//send to supabase function 
export async function sendToSupabase(parsedJSON: string ,supportingFiles:any): Promise<void> {

    // Initialize Supabase client
    const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
    
    try{
        //check if the resume is already uploaded and saved in the database
        const {data: selectData, error: selectError} = await client.from('resumes').select('name').eq('resumeInfo', parsedJSON);
        if (selectError) {
          console.error('Error checking if resume is already uploaded and saved in the database: ', selectError);
          return; //stop the code
        } else {
          if (selectData.length > 0) {
            console.error('Error resume already uploaded and saved in the database');
            return; //stop the code
          }
        }

        //the Parse function in AI-Parsing.ts returns a JSON formated string so we should parse it into a JSON object
        const dataJSON = JSON.parse(parsedJSON);
        
        //array of the top-level keys of the dataJSON object -> array of 13 elements keys=['name', 'phoneNumbers','websites', ...]
        const keys =Object.keys(dataJSON);

         
        //insert into resumes table: we need to fill the resumes table with the name, date of birth and summary values
        let resume: any ={}; //empty JSON object
        resume[keys[0]] = dataJSON[keys[0]]; //keys[0] = "name"
        resume[keys[4]] = dataJSON[keys[4]]; //keys[4] = "dateOfBirth"
        resume[keys[6]] = dataJSON[keys[6]]; //keys[6] = "summary"
        resume.resumeInfo = parsedJSON;      // appending resume info to resume 
        /*
          resume = {
            "name": "CVname",
            "dateOfBirth": "CVdateOfBirth",
            "summary": "CVsummary",
            "resumeInfo": parsedJSON
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
        const {data: resume_ID, error: resume_IDerr} = await client.from('resumes').select('resumeID').eq('resumeInfo', resume.resumeInfo).single();
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
              "resumeInfo": parsedJSON,
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

        if(supportingFiles!=null)
          {
            
            let SupportingFilesIds :string[] =[];
            
            supportingFiles.forEach(async (file:any) => {
              
              console.log("FIle to be uploaded :" + file)
              let fileType=determineFileType(file.originalname);
              const extension =  file?.originalname.split('.').pop()?.toLowerCase() || '';
              let path =  resume.resumeID + '/' + uuidv4();
              const fileData = fs.readFileSync(file.path)
              const { data , error } = await client.storage
              .from('Supporting Docs') // Specify the name of your storage bucket
              .upload(path, fileData,{ contentType: fileType}); // Upload the file to the specified path

              let Data = data as  { path: string; id: string; fullPath: string };
              console.log("data after send to supabase " + Data?.id);
              SupportingFilesIds.push(Data?.id)
            });
            
            // const { data , error } = await client.storage
            //   .from('Supporting Docs') // Specify the name of your storage bucket
            //   .download('Supporting Docs/42.txt'); // Upload the file to the specified path

              // if(data!=null)
              // {
              //   console.log("Data downloaded :" + data);
              //   const ArrayBuffer = await data.arrayBuffer();
              //   fs.writeFileSync('./supporting Files/file.txt',Buffer.from(ArrayBuffer))

              //   const fileInfo = fs.statSync('./supporting Files/file.txt');
              //   console.log('File type:', fileInfo.isFile() ? 'File' : 'Directory');
              // }
          }
        console.log("Data successfully sent to Supabase");


        //  await client.storage
        // .from('Supporting Docs')
        // .upload(supportingFiles.originalname, supportingFiles);

        
    }catch(error){
        console.error('Error sending to the DB:', error);
        return;
    }


}
function determineFileType(fileName: string): string {
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  switch (fileExtension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
          return 'image/' + fileExtension;
      case 'pdf':
          return 'application/pdf';
      case 'doc':
      case 'docx':
          return 'application/msword';
      // Add more cases as needed for other file types
      default:
          return 'application/octet-stream'; // Default content type for unknown file types
  }
}

