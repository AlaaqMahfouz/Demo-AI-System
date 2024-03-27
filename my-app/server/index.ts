import mammoth from "mammoth"
import Pdfparser from "pdf2json"
const Tesseract=require('tesseract.js')
const multer=require('multer')
const path=require('path')
const express = require('express')
const app = express();
const cors = require('cors');
const  fs = require('fs').promises;
import{ Parse} from './AI-Parsing'
import {SendToGoogle} from './sendToGoogle'
app.use(cors())

const PDFParser=require('pdf2json')
async function readFileAsArrayBuffer(filepath:String) {
  try {
     return fs.readFile(filepath)
     .then((buffer:any)=>{
      return buffer;
     })
} catch (error) {
    throw error;
}
}
let fileName =''
let completeFilePath =''
const storage =multer.diskStorage({
  destination:(req:any,file:any,cb:any)=>{
    cb(null,'C:/Users/user/Desktop/My Stuffs/Questa-Pro/AI-Recruitment-SYS/my-app/client/files')
  },
  filename: (req:any,file:any,cb:any)=>{
    console.log(file)
        fileName=Date.now() + path.extname(file.originalname);
        completeFilePath='C:/Users/user/Desktop/My Stuffs/Questa-Pro/AI-Recruitment-SYS/my-app/client/files/' + fileName
        cb(null,fileName)
    
    console.log("filepath : " , fileName)
  }
})

const upload = multer({storage : storage})

app.get('/upload',upload.single('CV') ,async (req:any,res:any)=>{

  res.send("image uploaded from get")
}),


app.post('/upload',upload.single('CV') ,async (req:any,res:any)=>{


  let file =  req.file;
  let finalText='';
  // let parsedCV :string;

  try {

        console.log("file Name" , file )
  
    } catch (error) {
      console.error(error);
    }
    
    if (file) {           
            
      
          const validImageExtensions = ['png', 'jpg', 'jpeg'];
          const validOtherThanPdfExtensions = ['doc' , 'docx'];
          const extension =  file?.originalname.split('.').pop()?.toLowerCase() || '';

          console.log("extesnion is  :" + extension)
      
          if( validImageExtensions.includes(extension))
          {
            console.log("this is an image file ");


            finalText =await OCR();

            await OCR();
          }
          else if(validOtherThanPdfExtensions.includes(extension))
          {

          
            console.log("this is a doc file ");
            
            try{
              finalText   = await docxToHtml();
            }catch(error){
              console.log("couldnt do : ",error);
            }

          }
          
          
      
          else if(extension=='pdf'){

            console.log("this is a pdf file ");

            const tempFilePath =completeFilePath;

            const pdfParser = new (PDFParser)(null, 1);
      
            pdfParser.on('pdfParser_dataError', (errData:any) =>
              console.log("error" ,errData.parserError)
            );
      
            pdfParser.on('pdfParser_dataReady', () => {   
              // console.log("parsed text " , (pdfParser ).getRawTextContent());
             finalText = (pdfParser).getRawTextContent();
              console.log("parsed text " , (pdfParser ).getRawTextContent());
             const parsedText = (pdfParser).getRawTextContent();
            });

          
            pdfParser.loadPDF(tempFilePath);
      
          }
          else{
            console.log("error : File is not in the expected format!")
          }

    }else{
      console.error('file is not valid!');
      res.status(201).json({message : 'file not Valid!'});
    }
    
    // return new Promise((resolve, reject) => {
      // Simulate asynchronous data fetching
      setTimeout(async() => {
        const parsedCV = await Parse(finalText);
        console.log("final text is : ", parsedCV)
        // SendToGoogle(parsedCV as string);
        res.json(parsedCV);
     
      }, 2000); // Simulate delay
    });

    


export async function docxToHtml(): Promise<string> {
  const RawTextPromise = await mammoth.extractRawText({ path:completeFilePath});
  const value = RawTextPromise.value;
  console.log("text : " + value);
  return value;
}

async function OCR (){
  try{
    // console.log("file path from image handler :" , fileName)
    const { data: { text } } = await Tesseract.recognize(completeFilePath, 'eng');
    console.log(text);

    return text;
  }catch(error)
  {
    console.error(error)
  }
}


app.listen(4000);
console.log("running on port 4000");


