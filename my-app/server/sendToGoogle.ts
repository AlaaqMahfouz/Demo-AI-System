
import * as fs from 'fs'
import {google} from 'googleapis';
import { text } from 'stream/consumers';
import { readFile } from 'node:fs';
import keys from "C:/Users/user/Desktop/My Stuffs/Questa-Pro/AI-Recruitment-SYS/my-app/server/key.json";
export async function SendToGoogle(textToSend:string){


    try {


      
        // Authenticate with Google Sheets API (using service account, or environment variable if necessary)
        // const credentialsPath = fs.readFile("C:/Users/user/Desktop/My Stuffs/Questa-Pro/API-key/ai-system-418411-5498e09cf361.json")
        // const credentials = JSON.parse( fs.readFile("C:/Users/user/Desktop/My Stuffs/Questa-Pro/API-key/ai-system-418411-5498e09cf361.json"),'utf8');

        const credentialsPath = process.env.GOOGLE_SHEETS_CREDENTIALS_PATH;
    if (!credentialsPath) {
      throw new Error('GOOGLE_SHEETS_CREDENTIALS_PATH environment variable is not set!');
    }
    const mab3rf = await fs.readFile(credentialsPath,null)
    const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));

        const jwtClient = new google.auth.JWT(
          keys.client_email , keys.private_key , 'https://www.googleapis.com/auth/spreadsheets'
        );
        const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
        await jwtClient.authorize();
        const sheets = google.sheets({ version: 'v4', auth: jwtClient });
    
        // Prepare data and request
        // const range = `${sheetName}!A1`; // Adjust range as needed
        const values = [[textToSend]]; // Wrap the string in a single row

        const spreadsheetID='1rZ51U8DFyM10ZwpScPyVLPoVc_RWNPQI26gL_XMcG_c'
    
        const request = {
          spreadsheetID,
          valueInputOption: 'USER_ENTERED', // Treat data as user-entered text
          values,
        };
    
        // Send data to Google Sheets
        await sheets.spreadsheets.values.append(request);
        console.log('String sent to Google Sheets successfully!');
      } catch (error) {
        console.error('Error sending string to Google Sheets:', error);
      }
    
}