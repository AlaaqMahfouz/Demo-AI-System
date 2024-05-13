'use client'

import { useState } from "react";
import Headband from "../components/headband";
import Sidebar from "../components/sidebar";
import Welcome from "../components/welcome";
import FileUpload from "../components/file-upload";
import Link from "next/link";
import { createContext } from 'react';
import Success from "../toast-Components/success-toast";
import Fail from "../toast-Components/failed-toast";

// import { createClient } from '@supabase/supabase-js'; // Import Supabase client

// const supabase = createClient('NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'); //values in env.local

const PopupContext = createContext(null);



export default function Home(){

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
    const [isSuccessToastOpen, setSuccessToastOpen] = useState(false);
    const [isFailedToastOpen, setFailedToastOpen] = useState(false);

    const openFileUpload = () => setIsFileUploadOpen(true);
    const closeFileUpload = (result:string) => {
        setIsFileUploadOpen(false);
        console.log("res : " + result)
        let timer;
        switch(result){

        case "success":
            setSuccessToastOpen(true)
            
            timer = setTimeout(() => {
                setSuccessToastOpen(false);
              }, 5000); // 3000ms = 3s
        
            break;
        case "failed":
            setFailedToastOpen(true);
            break;
        default:

                
            }
        
    }

    //pop up 
// const PopupProvider = () => {
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupMessage, setPopupMessage] = useState('');

//   const handleShowPopup = (message:any) => {
//     setShowPopup(true);
//     setPopupMessage(message);
//   };

//   const handleHidePopup = () => {
//     setShowPopup(false);
//   };
// }

    return(
        <div className="grid h-3/4">
            <div>
             <Headband
                    onToggle={ () => {
                        setIsSidebarOpen(!isSidebarOpen);
                    } }
                    />
                {isSidebarOpen && <Sidebar isSidebarOpen={isSidebarOpen} />}
                {/* {isSearchOpen && <SearchForm isSearchOpen={isSearchOpen} />} */}
            </div>
                    {isSuccessToastOpen && 
                            <Success  

                                 onToggle={ () => {
                                    setSuccessToastOpen(false);
                                } }
                            />
                }
                {isFailedToastOpen && 
                            <Fail 
                                 onToggle={ () => {
                                    setFailedToastOpen(false);
                                } }
                                
                            />
                }
            <div className={` ${ isSidebarOpen ? "sm:ml-56" : "" }  justify-self-center mt-20`}>
                <div>
                    <Welcome/>
                    <div className="flex sm:flex-row flex-col justify-evenly mt-10">
                        <div className="button-container">
                            <button 
                                className="flex m-4 w-64 justify-center bg-gray-200 hover:bg-blue-900 text-lg text-blue-900 hover:text-white shadow-lg shadow-gray-500 border-blue-800 border-2 hover:border-1 font-extrabold h-min w-15 py-3 px-4 rounded-full"
                                onClick={openFileUpload}
                                >
                                Upload CV
                                <div className="p-1 inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 24 24">
                                    <path d="m8 8 4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 4v12M19 17v.6c0 1.33-1.07 2.4-2.4 2.4H7.4C6.07 20 5 18.93 5 17.6V17" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"/>
                                </svg>
                                </div>
                            </button>
                        </div>
                        <div className="button-container">
                            <Link href="/newSearch" passHref>
                                <button 
                                    className="flex m-4 w-64 justify-center text-lg bg-gray-200 hover:bg-blue-900 text-blue-900 hover:text-white shadow-lg shadow-gray-500 border-blue-800 border-2 hover:border-1 font-extrabold h-min w-15 py-3 px-4 rounded-full"
                                    >
                                    Create New Search
                                    <div className="p-1 ps-3 inset-y-0 start-0 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                        </svg>
                                    </div>
                                </button>
                            </Link>
                        </div>

                    </div>
                    {isFileUploadOpen && 
                    
                    <FileUpload onClose={closeFileUpload} />

                    }
                </div>
            </div>
            {isFileUploadOpen && ( // Render FileUpload only when open
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50">
                         

                    <FileUpload onClose={closeFileUpload} />

                </div>
            )}
       
        </div>
    );
}


