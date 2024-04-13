
import { FilePond } from 'react-filepond'; // library for a UI for file Selection
import 'filepond/dist/filepond.min.css'; // css for the UI 
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';


  //main front end component
  export default async function FileUpload(){

      const handleSubmit= async (event:any) =>{
        event?.preventDefault();

        const form = event.target;

        const formData = new FormData(form);
        const file = formData.get('CV');

      
        try {
          const response = await axios.post('http://localhost:4000/upload', formData);
          console.log('File uploaded:',response.data);
        } catch (error) { 
          console.error(error);
        }
      }
        

  return (
    <div>
        <form  encType='multipart/form-data'   onSubmit={handleSubmit}>
          
      <input type='file' name='CV'/>
      <button > Submit </button>

        </form>
        
    </div>
        
  );

  }

