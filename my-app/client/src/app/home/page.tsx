'use client'

import { useState } from "react";
import Headband from "../components/headband";
import SearchBar from "../components/searchBar";
import Sidebar from "../components/sidebar";
import Welcome from "../components/welcome";
import FileUpload from "../components/file-upload";

export default function Home(){

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);

    const openFileUpload = () => setIsFileUploadOpen(true);
    const closeFileUpload = () => setIsFileUploadOpen(false);

    return(
        <div>
            <div>
                <Headband
                    onToggle={ () => {
                        setIsSidebarOpen(!isSidebarOpen);
                    } }
                />
                {isSidebarOpen && <Sidebar isSidebarOpen={isSidebarOpen} />}
            </div>
            <div className={` ${ isSidebarOpen ? "sm:ml-56" : "" } `}>
                <Welcome/>
                <div className="button-container mt-12">
                    <button
                        className="dark:bg-indigo-500 hover:bg-indigo-600 text-white font-bold h-14 w-56 py-2 px-4 rounded-full"
                        onClick={openFileUpload}
                    >
                        Upload CV
                    </button>
                </div>
                
                {isFileUploadOpen && <FileUpload onClose={closeFileUpload} />}
                <SearchBar/>
            </div>
            {isFileUploadOpen && ( // Render FileUpload only when open
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50">
            <FileUpload onClose={closeFileUpload} />
            </div>
            )}
        </div>
    );
}