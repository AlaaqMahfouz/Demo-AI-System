import mammoth from "mammoth"
const Tesseract = require('tesseract.js');
const multer=require('multer')
const path=require('path')
const express = require('express')
const app = express();
const cors = require('cors');
const  fs = require('fs').promises;
import{ Parse} from './AI-Parsing2T'
import {sendToSupabase} from './sendToSupabase'
import { convert } from "pdf-img-convert";
import { writeFileSync } from "fs"
const PDFParser=require('pdf2json')
import extractDocImages from './extractImageDoc'
import * as fsExtra from 'fs-extra'


// express cors
app.use(cors())


let fileName =''
// path of the uploaded file
let completeFilePath =''


// multer config
const storage =multer.diskStorage({
  destination:(req:any,file:any,cb:any)=>{
    cb(null,'../client/files')
  },
  filename: (req:any,file:any,cb:any)=>{
    console.log(file)
        // Generating Unique name 
        fileName=Date.now() + path.extname(file.originalname);
        completeFilePath='../client/files/' + fileName
        cb(null,fileName)
    
    console.log("filepath : " , fileName)
  }
})

const upload = multer({storage : storage})

app.get('/upload',upload.single('CV') ,async (req:any,res:any)=>{

  res.send("image uploaded from get")
}),

// handling request
app.post('/upload',upload.single('CV') ,async (req:any,res:any)=>{


  let file =  req.file;
  // variable for extracted text
  let finalText='';
  let TextExtracted:string[]
  // let parsedCV :string;


        console.log("file Name" , file )
  
    
    
    if (file) {           
            
      
          const ImageExtensions = ['png', 'jpg', 'jpeg'];
          const docExtensions = ['doc' , 'docx'];

          // extract extension from file's name
          const extension =  file?.originalname.split('.').pop()?.toLowerCase() || '';

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


              
app.listen(4000);
console.log("running on port 4000");