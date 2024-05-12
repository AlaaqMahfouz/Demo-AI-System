const multer=require('multer')
const path=require('path')
import express, { Request, Response } from 'express';
const app = express();
const cors = require('cors');
import{ Parse} from './utils functions/AI-Parsing'
import * as fsExtra from 'fs-extra'
const bodyParser = require('body-parser');
import ExtractText from './Extract-Text/extract_text'
import {sendToSupabase} from './utils functions/sendToSupabase'
import {getSearchResultArray} from './utils functions/getSearchResultArray'
import {getResumeInfo} from './utils functions/getResumeInfo'
import {convertText} from './utils functions/convertText'
import {getSearches} from './utils functions/getSearches'
import {getSearchRequirement} from './utils functions/getSearchRequirement'
import {getSearchResult} from './utils functions/getSearchResult'
import {newSearch} from './utils functions/newSearch'
import {saveSearch} from './utils functions/saveSearch'
import {saveSearchAgain} from './utils functions/saveSearchAgain'
import {searchAgain} from './utils functions/searchAgain'
import {searchDatabase} from './utils functions/searchDatabase'
import { ParsingJsonToHTML } from './utils functions/parsingJsonToHTML';


// express cors
app.use(cors())
app.use(bodyParser.json());

app.post('/convert-text', async (req:Request, res: Response) => {
      try {
        const {searchText} = req.body;
        const structuredSearchString = await convertText(searchText);

        res.status(200).json(structuredSearchString);
      } catch (error) {
        console.error('Error converting search text:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

app.post('/parsing-JSON-To-HTML', async (req: Request, res: Response) => {
  try {
    const { candidateID } = req.body; // Assuming candidateID is sent in the request body

    if (!candidateID) {
      return res.status(400).json({ error: 'Missing candidate ID in request body' });
    }

    // Fetch resume information using getResumeInfo function
    const resumeInfo = await getResumeInfo(candidateID);

    if (!resumeInfo) {
      return res.status(404).json({ error: 'No resume found for the provided candidate ID' });
    }

    // Parse the fetched resume information
    const structuredHTML = await ParsingJsonToHTML(resumeInfo);

    res.status(200).json(structuredHTML);
  } catch (error) {
    console.error('Error converting search text:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/new-search', async (req: Request, res: Response)=>{
      try {
        const {structuredSearchString, limit} = req.body;
        const searchResult = await newSearch(structuredSearchString, limit); //new search

        res.status(200).json(searchResult);
      } catch (error) {
        console.error('Error performing new search:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

app.post('/save-search', async (req: Request, res: Response) => {
      try {
        const {searchTitle, structuredSearchString, searchResults} = req.body;
        saveSearch(searchTitle, structuredSearchString, searchResults);

        res.status(200).json({message: 'Search Result succesfully saved'})
      } catch (error) {
        console.error('Error saving search:', error);
        res.status(500).json({ error: 'Internal server error' });
      }

})

app.post('/search-again', async (req: Request, res: Response) => {
      try {
        const {searchID, limit} = req.body;
        const searchAgainResult = await searchAgain(searchID, limit);
        res.status(200).json(searchAgainResult);
      } catch (error) {
        console.error('Error searching again:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

app.post('/save-search-again', async (req:Request, res: Response) => {
      try {
        const {searchID, newResults} = req.body;
        saveSearchAgain(searchID, newResults);
        res.status(200).json({message: 'Search Result succesfully saved'})
      } catch (error) {
        console.error('Error saving search again:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

app.get('/get-searches', async (req: Request, res: Response) => {
      try {
        const searches = await getSearches();
        res.status(200).json(searches);
      } catch (error) {
        console.error('Error getting search titles:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

app.get('/get-search-result', async (req: Request, res: Response) => {
      try {
        // Extract searchID from the request query parameters
        const searchIDParam = req.query.searchID;
        // Check if searchIDParam is defined and not null
        if (typeof searchIDParam === 'string') {
          // Convert searchIDParam to a number
          const searchID = parseInt(searchIDParam);
          // Call getSearchResult with the parsed searchID
          const searchResults = await getSearchResult(searchID);
          // Send the searchRequirement as a JSON response
          res.status(200).json(searchResults);
        } else {
          // If searchIDParam is undefined or null, return an error response
          res.status(400).json({ error: 'Search ID is missing or invalid' });
        }
      } catch (error) {
        console.error('Error getting search results:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

app.get('/get-search-requirement', async (req:Request, res: Response) => {
      try {
        // Extract searchID from the request query parameters
        const searchIDParam = req.query.searchID;
        // Check if searchIDParam is defined and not null
        if (typeof searchIDParam === 'string') {
          // Convert searchIDParam to a number
          const searchID = parseInt(searchIDParam);
          // Call getSearchRequirement with the parsed searchID
          const searchRequirement = await getSearchRequirement(searchID);
          // Send the searchRequirement as a JSON response
          res.status(200).json(searchRequirement);
        } else {
          // If searchIDParam is undefined or null, return an error response
          res.status(400).json({ error: 'Search ID is missing or invalid' });
        }
      } catch (error) {
        console.error('Error getting search requirements:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

app.get('/get-resume-info', async (req:Request, res: Response) => {
      try {
        const resumeID = req.body;
        const resumeInfo = await getResumeInfo(resumeID);
        res.status(200).json(resumeInfo);
      } catch (error) {
        console.error('Error getting resume information:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

app.get('/get-search-result-array', async (req: Request, res: Response) => {
      try {
        const searchID = req.body;
        const searchResult = await getSearchResultArray(searchID);
        res.status(200).json(searchResult)
      } catch (error) {
        console.error('Error getting search result array:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

    let fileName =''
    // path of the uploaded file
    let completeFilePath =''
    
    // multer config
    const storage =multer.diskStorage({
      destination:(req:any,file:any,cb:any)=>{
        if(file.fieldname==="CV")
        cb(null,'../client/files')
        else
        cb(null,'../client/supporting Files')
    
      },
      filename: (req:any,file:any,cb:any)=>{
        try {
          
          console.log(file)
          console.log(file.originalname)
          fileName=Date.now() + path.extname(file.originalname);
          
          if(file.fieldname=="CV"){
          completeFilePath='../client/files/' + fileName
          }
            console.log("complete file path : " +completeFilePath)
            cb(null,fileName)
            
            console.log("filepath : " , fileName)
          }catch(error)
          {
          console.log("error : " + error)
        }
        }
      })
    
    
    const upload = multer({storage : storage})

// handling request
app.post('/upload', upload.fields([{ name: 'CV' }, { name: 'otherFiles' }]),async (req:any,res:any)=>{

  if(req==null)
    {
      console.log("file is not inserted!")
      return null;
    }
    else{

      let file =  req.files['CV'][0];
      
      let supportingFiles=null;

  // saving supporting files
  if(req.files['otherFiles']!=null)
    supportingFiles=req.files['otherFiles'];
  
  
  // variable for extracted text
  let finalText='';
    
  
    if (file) {           
      
         await ExtractText(file,completeFilePath).then(async (text)=>{
          finalText=text;
          console.log(text);

          return new Promise(async (resolve, reject) => {

          if(isEmptyString(finalText))
            {
              console.log("text extracted is null")
              await fsExtra.emptyDir('Images');
              await fsExtra.emptyDir('../client/files')
              await fsExtra.emptyDir('../client/supporting Files')
              res.status(500).json({message : "due to some error , text couldn't be extracted!"});
              return;
            }
            const pageBreakRegex = /-+Page\s*\(\d+\)\s*Break-+/g
            const pattern = /[^a-zA-Z0-9\s.,!?@#$%^&*();:"'{}[\]|_+=<>~`/-]/g;
  
            finalText = finalText
            .replace(pageBreakRegex, '')
            // .replace(pattern, '')
            // .replace(/\s+/g, ' ')
            // .replace(/\//g, '//')
            // .replace(/-/g, '\\\\-')
            // .replace(/\breduce\b/g, '')
            // .replace(/^|$/g, '"');
            // Replace all occurrences of empty lines with an empty string
    
            // finalText =JSON.parse(finalText)
            console.log("final text : " , finalText);
            // parse text into a structured JSON template 
            const parsedCV = await Parse(finalText);
            //sending the extracted data from the uploaded CV to supabase database
            // console.log("Parsed text is : ", parsedCV)
            let resultFromInserting :string|void = await sendToSupabase(parsedCV,supportingFiles);

            if(resultFromInserting!=null && resultFromInserting=="success")
              res.status(201).json({message : 'Successfully inserting the CV into Database!'});
            else
              res.status(500).json({message : 'An error occured while inserting into supabase !'});
            
  
            
            
            // empty temperory saved files and images
            await fsExtra.emptyDir('Images');
            await fsExtra.emptyDir('../client/files')
            await fsExtra.emptyDir('./supporting Files')
        })
         });
        
    }else{
      console.error('file is not valid!');
      res.status(500).json({message : 'file not Valid!'});
    }
    
    return new Promise((resolve, reject) => {
      // // Simulate asynchronous data fetching
      // setTimeout(async() => {
      //   if(isEmptyString(finalText))
      //     {
      //       console.log("text extracted is null")
      //       await fsExtra.emptyDir('Images');
      //       await fsExtra.emptyDir('../client/files')
      //       await fsExtra.emptyDir('../client/supporting Files')
      //       return null;
      //     }
      //     const pageBreakRegex = /-+Page\s*\(\d+\)\s*Break-+/g
      //     const pattern = /[^a-zA-Z0-9\s.,!?@#$%^&*();:"'{}[\]|_+=<>~`/-]/g;

      //     finalText = finalText
      //     .replace(pageBreakRegex, '')
      //     .replace(pattern, '')
      //     .replace(/\s+/g, ' ')
      //     .replace(/\//g, '//')
      //     .replace(/-/g, '\\\\-')
      //     .replace(/\breduce\b/g, '')
      //     .replace(/^|$/g, '"');
      //     // Replace all occurrences of empty lines with an empty string
  
      //     // finalText =JSON.parse(finalText)
      //     console.log("final text : " , finalText);
      //     // parse text into a structured JSON template 
      //     const parsedCV = await Parse(finalText);
      //     //sending the extracted data from the uploaded CV to supabase database
      //     // console.log("Parsed text is : ", parsedCV)
      //     await sendToSupabase(parsedCV,supportingFiles);
          
      //     res.json(parsedCV);

          
          
      //     // empty temperory saved files and images
      //     await fsExtra.emptyDir('Images');
      //     await fsExtra.emptyDir('../client/files')
      //     await fsExtra.emptyDir('./supporting Files')
      //   }, 10000); // Simulate delay
      });

      
    }
    });
    
export function isEmptyString(str: string): boolean {
  // Use a regular expression to match strings containing only whitespace characters
  return /^\s*$/.test(str);
}

export default app;
              
app.listen(4000);
console.log("running on port 4000");
