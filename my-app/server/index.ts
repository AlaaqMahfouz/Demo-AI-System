const multer=require('multer')
const path=require('path')
import express, { Request, Response } from 'express';
const app = express();
const cors = require('cors');
import{ Parse} from './AI-Parsing'
import * as fsExtra from 'fs-extra'
const bodyParser = require('body-parser');
import {searchDatabase, convertText, saveSearch, newSearch} from './search'
import ExtractText from './Extract-Text/extract_text'



// express cors
app.use(cors())
app.use(bodyParser.json());

let fileName =''
// path of the uploaded file
let completeFilePath =''

// multer config
const storage =multer.diskStorage({
  destination:(req:any,file:any,cb:any)=>{
    // if(file.fieldname==="CV")
    cb(null,'../client/files')

    // else
    // cb(null,'../client/supportingFiles')
  },
  filename: (req:any,file:any,cb:any)=>{
    try {

      console.log(file)
      console.log(file.originalname)
      // Generating Unique name   
      fileName=Date.now() + path.extname(file.originalname);
      
      completeFilePath='../client/files/' + fileName
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

// const upload = multer({ 
//   storage: {
//     fields: [
//       { name: 'CV', storage: storage },
//       { name: 'otherFiles', storage: storage }
//     ]
//   }
// });
 
// app.get('/upload',upload.single('CV') ,async (req:any,res:any)=>{

//   res.send("image uploaded from get")
// }),

// handling request
app.post('/upload', upload.single('CV'),async (req:any,res:any)=>{

  console.log('hi')
  let file =  req.file;

  console.log("FIle:" +file)


  console.log

  
  // variable for extracted text
  let finalText='';
  let TextExtracted:string[]


    console.log("file Name" , file )
  
    
    if (file) {           
            
         await ExtractText(file,completeFilePath).then(async (text)=>{
          
          console.log(text);
        })


       

    }else{
      console.error('file is not valid!');
      res.status(201).json({message : 'file not Valid!'});
    }
    
    return new Promise((resolve, reject) => {
      // Simulate asynchronous data fetching
      setTimeout(async() => {
        if(isEmptyString(finalText))
          return null;
        
          console.log("final text : " , finalText);
          // parse text into a structured JSON template 
        const parsedCV = await Parse(finalText);
        //sending the extracted data from the uploaded CV to supabase database
        // await sendToSupabase(parsedCV);
        console.log("Parsed text is : ", parsedCV)

        res.json(parsedCV);

        // empty temperory saved files and images
          await fsExtra.emptyDir('Images');
          await fsExtra.emptyDir('../client/files')
      }, 20000); // Simulate delay
    });

    
  });



             export function isEmptyString(str: string): boolean {
                // Use a regular expression to match strings containing only whitespace characters
                return /^\s*$/.test(str);
            }


    app.post('/search',async (req:any,res:any)=>{
      const {data} = req.body;
      const limit = data.limitNum;
      console.log("Data :"+data.inputValue);
      console.log("limit :"+limit);
        console.log("searching database...");
        searchDatabase(data.inputValue,data.limitNum, [] ) //new search

      
    })

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
      
    })


              
app.listen(4000);
console.log("running on port 4000");
