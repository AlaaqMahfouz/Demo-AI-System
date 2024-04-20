'use client'

import React, { use, useRef, useState } from 'react';
import axios from 'axios';
import { Island_Moments } from 'next/font/google';

interface FileUploadProps {
  onClose: () => void;
}



const FileUpload: React.FC<FileUploadProps> = ({ onClose }) => {
  const [file, setCvFile] = useState<File | null>(null);
  const [otherFiles, setOtherFiles] = useState<FileList | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCvFile(event.target.files?.[0] ?? null);
  };

  const handleOtherFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtherFiles(event.target.files); // Allows selecting multiple files
  };

  const handleUpload = async () => {
    setUploadError(null); // Clear previous error messages

    if (!file && !otherFiles?.length) {
      setUploadError('Please select at least one file to upload.');
      return;
    }
    const formData = new FormData();
    
    if (file) {
      formData.append('CV', file);
    }
    if (otherFiles) {
      for (let i = 0; i < otherFiles.length; i++) {
        formData.append('otherFiles', otherFiles[i]);
      }
    }
     
    try {
      const response = await axios.post<any>( // Update response type based on server response
        'http://localhost:4000/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Required header for file uploads
          },
        }
      );
      console.log('Files uploaded:', response.data);
      
      onClose(); // Close the popup after successful upload
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadError('An error occurred during upload. Please try again.');
    }
  };

  const otherFilesHandle = useRef<HTMLInputElement>(null); 

  // Check if at least one file (CV or other) is selected for disabling the upload button
  const hasSelectedFiles = file || (otherFiles && otherFiles.length > 0);


  return ( 
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h5 className="text-center text-xl font-medium mb-4">Upload CV</h5>
        <div>
          <label htmlFor="file" className="block mb-2 text-sm font-medium">
            CV Upload (Single File)
          </label>
          <input
            type="file"
            id="file"
            name="CV"
            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={handleCvChange}
          />
          {file && <p className="mt-2 text-gray-600">{file.name}</p>}
        </div>
        <div className="mt-4">
          <label htmlFor="otherFiles" className="block mb-2 text-sm font-medium">
            Supporting Documents (Multiple Files)
          </label>
          <input
            type="file"
            id="otherFiles"
            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={handleOtherFilesChange}
            multiple
            ref={otherFilesHandle}
          />
        </div>
        {uploadError && <p className="text-red-500 text-sm mb-2">{uploadError}</p>}
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="dark:bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
            onClick={handleUpload}
            disabled={!hasSelectedFiles} // Disable upload button if no file selected
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
 
};

export default FileUpload;
