

import { GoogleGenerativeAI } from '@google/generative-ai';
// import React, { useState, useEffect } from 'react';


export async function Parse(textToParse:String){

    let parsedYaml = ''



const yamlTemplate = `
name: ''
phoneNumbers:
  - ''
websites:
  - ''
emails:
  - ''
dateOfBirth: ''
addresses:
  - street: ''
    city: ''
    state: ''
    zip: ''
    country: ''
summary: ''
education:
  - school: ''
    degree: ''
    fieldOfStudy: ''
    startDate: ''
    endDate: ''
workExperience:
  - company: ''
    position: ''
    startDate: ''
    endDate: ''
projects:
  - name: ''
    languages: ''
    startDate: ''
    endDate: ''
skills:
  - name: ''
certifications:
  - name: ''
languages:
  - name: ''
    proficiency: ''
`;

// const CvParser: React.FC = () => {
//   const [parsedYaml, setParsedYaml] = useState<string>('');
//   const [isLoading, setIsLoading] = useState(false);

  const genAI = new GoogleGenerativeAI("AIzaSyBDojqEFTP5MbdXksNPUgh6a1vq84VDIgw"); // Replace with your Google Gemini API key

//   useEffect(() => {
    // const parseCv = async () => {
    //   setIsLoading(true);

      try{
        const generationConfig = {
        stopSequences: ["red"],
        maxOutputTokens: 1000,
        temperature: 0.9,
        topP: 0.1,
        topK: 16,
      };    

      // For text-only input, use the gemini-pro model
      const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig});



      
      const prompt = `This is a resume:\n${textToParse}\nPlease parse the information into a YAML format following the structure:\n${yamlTemplate}`;
      
      
      const result = await model.generateContent(prompt);
      
      const response = await result.response;

      const parsedYaml = response.text();
      try{
          const jsonParsedYaml = JSON.parse(parsedYaml);
          console.log('json parsed : ', jsonParsedYaml);
      }catch(error)
      {
        console.error('error while parsing to JSON : ' , error);
      }
      
      

      return parsedYaml ;

        // setParsedYaml(parsedContent);

        console.log("Parsed YAML:", parsedYaml);

      } catch (error) {
        console.error('Error parsing CV:', error);
      } 

    }

    // parseCv(); // Call parsing function on component mount
//   }, []); // Empty dependency array to run parsing only once


