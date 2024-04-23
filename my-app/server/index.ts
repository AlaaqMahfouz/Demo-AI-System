import mammoth from "mammoth"
const Tesseract = require('tesseract.js');
const multer=require('multer')
const path=require('path')
import express, { Express, Request, Response } from 'express';
const app = express();
const cors = require('cors');
const  fs = require('fs').promises;
import{ Parse} from './utils functions/AI-Parsing'
import {sendToSupabase} from './utils functions/sendToSupabase'
import {convertText} from './utils functions/convertText'
import {searchDatabase} from './utils functions/searchDatabase'
import {saveSearch} from './utils functions/saveSearch'
import {searchAgain} from './utils functions/searchAgain'
import {newSearch} from './utils functions/newSearch'
import {getSearches} from './utils functions/getSearches'
import {getResumeInfo} from './utils functions/getResumeInfo'
import {getSearchResult} from './utils functions/getSearchResult'
import {getSearchRequirement} from './utils functions/getSearchRequirement'
import {saveSearchAgain} from './utils functions/saveSearchAgain'
import { convert } from "pdf-img-convert";
import { writeFileSync } from "fs"
const PDFParser=require('pdf2json')
import extractDocImages from './extractImageDoc'
import * as fsExtra from 'fs-extra'
const bodyParser = require('body-parser');
// express cors
app.use(cors())
app.use(bodyParser.json());

let fileName =''
// path of the uploaded file
let completeFilePath =''

// multer config
const storage =multer.diskStorage({
  destination:(req:any,file:any,cb:any)=>{
    if(file.fieldname==="CV")
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
  let file =  req.files['CV'];

  console.log("FIle:" +file)

  // let supportingFiles = req.files['otherFiles']

  console.log

  
  // variable for extracted text
  let finalText='';
  let TextExtracted:string[]
  // let parsedCV :string;


        console.log("file Name" , file )
  
    
    if (file) {           
            
      
          const ImageExtensions = ['png', 'jpg', 'jpeg'];
          const docExtensions = ['doc' , 'docx'];

          // extract extension from file's name
          const extension =  file[0]?.originalname.split('.').pop()?.toLowerCase() || '';

          console.log("extesnion is  :" + extension)

          if( ImageExtensions.includes(extension))  // file is an image
          {
            console.log("this is an image file ");


            finalText =await OCR();

          }
          else if(docExtensions.includes(extension))  // file is a doc | docx
          {

          
            console.log("this is a doc file ");
            
            try{
              finalText   = await docxToHtml();
 
              let textDone:string;

              // check if extracted text is empty 
              // doc is scannned
              if (isEmptyString(finalText)){

                console.log("this is a scanned doc");


                await extractDocImages(completeFilePath)
                .then((Buffers)=>{
                  Buffers.forEach(async (Buffer)=>{
                    const Path='Images/FromDocs' + Date.now() +".jpg"; 
                    // save buffers as images in Path
                    await fs.writeFile(Path , Buffer)

                    // handle extracted images with Tesseract
                    finalText+= await OCR2(Path);
                  })
                });

              }
            }catch(error){
              console.log("couldnt do : ",error);
            }

          }
          
          
      
          else if(extension=='pdf'){  // file is a pdf

            console.log("this is a pdf file ");

            handleAllPdfs()
            .then(async (text)=>{
              finalText=text;
            })
      
          }
          else{
            console.log("error : File is not in the expected format!")
          }

    }else{
      console.error('file is not valid!');
      res.status(201).json({message : 'file not Valid!'});
    }
    
    return new Promise((resolve, reject) => {
      // Simulate asynchronous data fetching
      setTimeout(async() => {
        
          console.log("final text : " , finalText);
          // parse text into a structured JSON template 
        const parsedCV = await Parse(finalText);
        //sending the extracted data from the uploaded CV to supabase database
        await sendToSupabase(parsedCV);
        console.log("Parsed text is : ", parsedCV)

        res.json(parsedCV);

        // empty temperory saved files and images
          await fsExtra.emptyDir('Images');
          await fsExtra.emptyDir('../client/files')
      }, 20000); // Simulate delay
    });

    
  });


export async function docxToHtml(): Promise<string> { // handle doc files with mammoth
  const RawTextPromise = await mammoth.extractRawText({ path:completeFilePath});
  const value = RawTextPromise.value;
  console.log("text : " + value);
  return value;
}

async function OCR (){  // handle images with tesseract
  try{
  
    const { data: { text } } = await Tesseract.recognize(completeFilePath, 'eng');
    console.log(text);

    return text;
  }catch(error)
  {
    console.error(error)
  }
}

async function OCR2 (path:string){ // handle images with tesseract from a specific path
  try{
    // console.log("file path from image handler :" , fileName)
    const { data: { text } } = await Tesseract.recognize(path, 'eng');
    console.log("text extracted from image :",text);

    return text;
  }catch(error)
  {
    console.error(error)
  }
}




async function handlePDF():Promise<string>{   // handle pdf


  return new Promise<string> ((resolve , reject)=>{

  
  const pdfParser = new (PDFParser)(null, 1);

  let Text='';

  
  pdfParser.on('pdfParser_dataError', (errData:any) => // handle error while extracting 
    console.log("error" ,errData.parserError),
  
    
  );

  pdfParser.on('pdfParser_dataReady', async (pdfData:any) => {   // handle data when ready
    
   let Text = (pdfParser).getRawTextContent();

    resolve(Text);
 
  });

  pdfParser.loadPDF(completeFilePath);

})



}

  

async function handleAllPdfs(){ // handle scanned/text pdfs

  let textDone:string;
  return new Promise<string>(async (resolve,reject)=>{

     await handlePDF()
    .then(async (text) =>{
                

                if(text.length<100){ // check for scanned pdf

                  console.log("this is a scanned pdf");
                  
                  
                  let TextExtracted : string[] = [];
                  
                  const outputImages = await convert(completeFilePath,{ // convert pdf to image
                    scale:3, // specify scale for better image's resolution
                  });
                  
                  const imagePaths = outputImages.map(async(image, i) => {
                    const path = "images/output" + i + ".png";
                    writeFileSync(path, image); // save images to unique path
                    
                    
                    return await OCR2(path);
                    
                  });
      
                
                
                  
                  await Promise.all(imagePaths) // All promises are resolved, 'texts' contains the extracted text from each image
                  .then((texts) => {
                    
                    // Save the 'texts' array to 'TextExtracted'
                    TextExtracted.push(...texts);
                    console.log("TextExtracted array:", TextExtracted);
                      
                      let i=0;

                      while(TextExtracted[i]!=null)
                      {
                        textDone+=TextExtracted[i];
                        i++;
                      }
                      
                      return text;
                      
                    })
                    .catch((error) => {
                      console.error("Error while processing images:", error);
                    });
                    
                  }
                  else{  // pdf is not scanned
                    textDone=text;
                  }
                  
                  
                })
                .catch((error) => {
                  console.error("Error:", error);
                })
                
                resolve(textDone);
              })
                
              }




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
      try {
        const {searchTitle, limit} = req.body;
        const searchAgainResult = await searchAgain(searchTitle, limit);
        res.status(200).json(searchAgainResult);
      } catch (error) {
        console.error('Error searching again:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    })

    app.post('/save-search-again', async (req:Request, res: Response) => {
      try {
        const {searchTitle, newResults} = req.body;
        saveSearchAgain(searchTitle, newResults);
        res.status(200).json({message: 'Search Result succesfully saved'})
      } catch (error) {
        console.error('Error saving search again:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    })

    app.get('/get-searches'), async (req: Request, res: Response) => {
      try {
        const searches = await getSearches();
        res.status(200).json(searches);
      } catch (error) {
        console.error('Error getting search titles:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }

    app.get('/get-search-result', async (req: Request, res: Response) => {
      try {
        const {searchID} = req.body;
        const searchResults = await getSearchResult(searchID);
        res.status(200).json(searchResults);
      } catch (error) {
        console.error('Error getting search results:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    })

    app.get('/get-search-requirement', async (req:Request, res: Response) => {
      try {
        const {searchID} = req.body;
        const searchRequirement = await getSearchRequirement(searchID);
        res.status(200).json(searchRequirement);
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

              
app.listen(4000);
console.log("running on port 4000");
