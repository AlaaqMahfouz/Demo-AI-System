'use client'

import React, { FC } from 'react';
import { downloadFolder } from './util_downloadFile';
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import NoFiles from '../toast-Components/noFilesToast';
import { TIMEOUT } from 'dns';
const supabase = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");


interface CandidateProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  resumeInfo: any;
  files: any[];
}

interface ResumeInfo{
  resumeID:number;
  name:string;
  resumeHTML:any;
}

let resumeHTML;
const CandidateCard: FC<CandidateProps> =  ({ isOpen, onClose, data, resumeInfo, files }) => {
  const [isAlertOpen, setisAlertOpen] = useState(false);

  // console.log("files reception from card : " + JSON.stringify(files))
  const Files = files as unknown as ResumeInfo;
  resumeHTML= Files.resumeHTML;
  console.log("files to card : " + JSON.stringify(Files.resumeHTML))
  console.log("files structure: " + JSON.stringify(Files))
  console.log("resume info : " + JSON.stringify(resumeInfo))


  
  const handleDownloadFile = async (fileId: number) => {

    const files = await downloadFolder(fileId) ;

    console.log("files sent :" + JSON.stringify(files))


    if(files?.length==0)
      {
        setisAlertOpen(true);
        let timer;
        timer = setTimeout(()=>{
          setisAlertOpen(false)
        },3000);
      }

      

  };

  return (
    <div className={`popup ${isOpen ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : ''} bg-gray-200 inset-0 z-50 p-5 min-w-96 cardHeight h-fit rounded-2xl`}>
        <div className='cursor-pointer w-5 text-blue-900 float-right' onClick={onClose}>
          <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m20.48 3.512c-2.172-2.171-5.172-3.514-8.486-3.514-6.628 0-12.001 5.373-12.001 12.001 0 3.314 1.344 6.315 3.516 8.487 2.172 2.171 5.172 3.514 8.486 3.514 6.628 0 12.001-5.373 12.001-12.001 0-3.314-1.344-6.315-3.516-8.487zm-1.542 15.427c-1.777 1.777-4.232 2.876-6.943 2.876-5.423 0-9.819-4.396-9.819-9.819 0-2.711 1.099-5.166 2.876-6.943 1.777-1.777 4.231-2.876 6.942-2.876 5.422 0 9.818 4.396 9.818 9.818 0 2.711-1.099 5.166-2.876 6.942z"/>
              <path d="m13.537 12 3.855-3.855c.178-.194.287-.453.287-.737 0-.603-.489-1.091-1.091-1.091-.285 0-.544.109-.738.287l.001-.001-3.855 3.855-3.855-3.855c-.193-.178-.453-.287-.737-.287-.603 0-1.091.489-1.091 1.091 0 .285.109.544.287.738l-.001-.001 3.855 3.855-3.855 3.855c-.218.2-.354.486-.354.804 0 .603.489 1.091 1.091 1.091.318 0 .604-.136.804-.353l.001-.001 3.855-3.855 3.855 3.855c.2.218.486.354.804.354.603 0 1.091-.489 1.091-1.091 0-.318-.136-.604-.353-.804l-.001-.001z"/>
          </svg>
        </div>
        <div className='p-2'>
            <div className='text-center text-blue-900 text-2xl'>Candidate Details</div>
            <p className='text-center text-blue-900'>{data.name} Info</p>
            <div className='bg-gray-300 overflow-auto min-h-2/3 max-h-96 w-full text-blue-900 rounded-lg p-4'
            dangerouslySetInnerHTML={{ __html: resumeHTML  }}
            >
                {/* {parsedHTML} */}
            </div>
            <hr className="w-72 mx-auto mb-4 mt-4 border-blue-900 border-2" />
            <div className='bg-gray-300 rounded-3xl text-center'>
              {Files &&(
                <button key={Files.name} onClick={() => handleDownloadFile(Files.resumeID)} className='sm:flex-row flex items-center'>
                  <div className='text-blue-800 mr-2'>CLICK HERE</div><div> to download {`${Files.name}'s`} documents</div>
                </button>
              )}
            </div>
        </div>
        {isAlertOpen && 
          <NoFiles
          onToggle={ () => {
            setisAlertOpen(false);
          } }
        />}
    </div>
  );
};

export default CandidateCard;
