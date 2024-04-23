'use client'

import { useState } from "react";
import Headband from "../components/headband";
import SearchBar from "../components/searchBar";
import Sidebar from "../components/sidebar";
import Welcome from "../components/welcome";
import FileUpload from "../components/file-upload";
import newSearch from "../components/newSearch";
import SearchForm from "../components/newSearch";

import { createClient } from '@supabase/supabase-js'; // Import Supabase client

const supabase = createClient('NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'); //values in env.local


export default function Home(){

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);

    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const openFileUpload = () => setIsFileUploadOpen(true);
    const closeFileUpload = () => setIsFileUploadOpen(false);

    const openSearch = () => setIsSearchOpen(true);

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
            <div className={` ${ isSidebarOpen ? "sm:ml-56" : "" }  justify-self-center mt-20`}>
                <div >

                
                {/* <Welcome/> */}
                <div className="max-w-screen-xl mx-auto items-center">
                <p className="text-black text-center text-6xl ">
                    AI
                </p>
                <p className="text-black text-center text-4xl">
                    Recruitment System
                </p>
                <p className="text-center"> _________________________________________________________________ </p>
                <p className="p-12 text-black text-center pt-7 pb-10 sm:text-base text-xs h-min max-w-2xl">
                    Faster and more efficient way to recruit your desired candidates based on the desired qualifications.<br/>upload a new CV or search for an existing one.
                </p>
            </div>
            <div className="flex flex-row justify-evenly mt-10">

                <div className="button-container">
                    <button 
                        className="dark:bg-indigo-500 hover:bg-indigo-600 text-black font-bold h-min w-15 py-2 px-4 rounded-full"
                        onClick={openFileUpload}
                        >
                        Upload CV
                    </button>
                </div>

                <div className="button-container">
                    <button 
                        className="dark:bg-indigo-500 hover:bg-indigo-600 text-black font-bold h-min w-min py-2 px-4 rounded-full"
                        onClick={openSearch}
                        >
                        Search
                    </button>
                </div>
             </div>
                
                {isFileUploadOpen && <FileUpload onClose={closeFileUpload} />}
                {/* <SearchBar/> */}
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
