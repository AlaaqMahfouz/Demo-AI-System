import mammoth from "mammoth"
import Pdfparser from "pdf2json"
const Tesseract = require('tesseract.js');
const multer=require('multer')
const path=require('path')
const express = require('express')
const app = express();
const cors = require('cors');
const  fs = require('fs').promises;
import{ Parse} from './AI-Parsing2T'
import { PDFDocumentProxy } from 'pdfjs-dist';
import { convert } from "pdf-img-convert";
import { writeFileSync } from "fs"
import { error } from "console";
const PDFParser=require('pdf2json')
import * as pdfjs from 'pdfjs-dist';
import extractDocImages from './extractImageDoc'
import * as fsExtra from 'fs-extra'



app.use(cors())


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
  let TextExtracted:string[]
  // let parsedCV :string;

  try {

        console.log("file Name" , file )
  
    } catch (error) {
      console.error(error);
    }
    
    if (file) {           
            
      
          const ImageExtensions = ['png', 'jpg', 'jpeg'];
          const docExtensions = ['doc' , 'docx'];

          const extension =  file?.originalname.split('.').pop()?.toLowerCase() || '';

          console.log("extesnion is  :" + extension)
      
          if( ImageExtensions.includes(extension))
          {
            console.log("this is an image file ");


            finalText =await OCR();

          }
          else if(docExtensions.includes(extension))
          {

          
            console.log("this is a doc file ");
            
            try{
              finalText   = await docxToHtml();
 
              let textDone:string;

              if (isEmptyString(finalText)){

                console.log("this is a scanned doc");


                await extractDocImages(completeFilePath)
                .then((Buffers)=>{
                  Buffers.forEach(async (Buffer)=>{
                    const Path='Images/FromDocs' + Date.now() +".jpg"; 
                
                    await fs.writeFile(Path , Buffer)

                    finalText+= await OCR2(Path);
                  })
                });

               

                // console.log("images extracted" , Images);

                
              }
            }catch(error){
              console.log("couldnt do : ",error);
            }

          }
          
          
      
          else if(extension=='pdf'){

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
        const parsedCV = await Parse(finalText);
        console.log("Parsed text is : ", parsedCV)
         res.json(parsedCV);
          await fsExtra.emptyDir('Images');
      }, 20000); // Simulate delay
    });

    
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

async function OCR2 (path:string){
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


app.listen(4000);
console.log("running on port 4000");


async function handlePDF():Promise<string>{


  return new Promise<string> ((resolve , reject)=>{

  
  const pdfParser = new (PDFParser)(null, 1);

  let Text='';

  pdfParser.on('pdfParser_dataError', (errData:any) =>
    console.log("error" ,errData.parserError),
  
    
  );

  pdfParser.on('pdfParser_dataReady', async (pdfData:any) => {   
    
   let Text = (pdfParser).getRawTextContent();


    resolve(Text);
 
  });

  pdfParser.loadPDF(completeFilePath);

})



}



async function handleAllPdfs(){

  let textDone:string;
  return new Promise<string>(async (resolve,reject)=>{

    await handlePDF()
    .then(async (text) =>{
                

                if(text.length<100){

                  console.log("this is a scanned pdf");
                  
                  
                  let TextExtracted : string[] = [];
                  
                  const outputImages = await convert(completeFilePath,{
                    scale:3,
                  });
                  
                  const imagePaths = outputImages.map(async(image, i) => {
                    const path = "images/output" + i + ".png";
                    writeFileSync(path, image);
                    
                    
                    
                    // await page.render(renderContext).promise;
                    return await OCR2(path);
                    // TextExtracted.push(await OCR2(path));
                  });
                  // console.log("all extracted text :", TextExtracted);
                
                
                  
                  await Promise.all(imagePaths)
                  .then((texts) => {
                    // All promises are resolved, 'texts' contains the extracted text from each image
                    // Save the array 'texts' or do any other processing here
                    
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
                  else{
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




            async function extractImagesFromDocx(): Promise<string[]> {


              let Paths:string[]=[]
              try{

                const { messages } = await mammoth.convertToHtml({ path: completeFilePath });
                                    
                setTimeout(async() => {

                  if(messages==null)
                  {
                    console.warn("extracting data is not done!");
                  }
                  else{
                    
                  
                  console.log("messages : " , messages[0]);
                  
                messages.forEach((message: any) => {
                  if (message.part && message.part.contentType.startsWith('image/')) {
                    const { extension, content } = message.part;
                    console.log("extension :",extension)
                    // Write the image content to a file
                    let path = `output/image${Date.now()}.${extension}`
                    
                    fs.writeFileSync(path, content);
                    Paths.push(path);
                  }else{
                    console.log("content is not of type image!");
                  }
                });
                
                return Paths;

              }


              }, 5000);
                
              }catch(error)
              {
                console.log("Error while extracting images :" , error);
              }


              return Paths;

              }