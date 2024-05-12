'use client';

import React, { use, useRef, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';





interface FileUploadProps {
  onClose: (result : string) => void;
}



const FileUpload: React.FC<FileUploadProps> = ({ onClose }) => {
  const [file, setCvFile] = useState<File | null>(null);
  const [otherFiles, setOtherFiles] = useState<FileList | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false); // State for upload progress
  const [isUploading, setIsUploading] = useState(false); // State to prevent multiple clicks
  const[toastIsVisible,setToastIsVisible]=useState(false);

  const handleCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCvFile(event.target.files?.[0] ?? null);
  };

  const handleOtherFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtherFiles(event.target.files); // Allows selecting multiple files
  };

  const handleUpload = async () => {
    if (isUploading) return;

    setUploadError(null); // Clear previous error messages
    setUploading(true); // Set uploading state to true
    setIsUploading(true); // Set uploading flag to prevent further clicks

    if (!file && !otherFiles?.length) {
      setUploadError('Please select at least one file to upload.');
      setUploading(false); // Reset uploading state on error
      setIsUploading(false); // Reset uploading flag
      return;
    }

    try {
      const formData = new FormData();

      if (file) {
        formData.append('CV', file);
      }

      if (otherFiles) {
        for (let i = 0; i < otherFiles.length; i++) {
          formData.append('otherFiles', otherFiles[i]);
        }
      }
      console.log(process.env.BACK_END_URL);
      try { 
        const response = await axios.post<any>( // Update response type based on server response
        "https://ai-back-end.netlify.app/upload",
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data', // Required header for file uploads
            },
          }
        );
        
        // handle successful upload
        if (response.status < 200 || response.status > 300) 
          {
            onClose("failed")

            throw ErrorEvent;
          }
          
        
        
        
        setToastIsVisible(true);

        console.log('Files uploaded:', response.data);
        onClose("success"); // Close the popup after successful upload
        setIsUploading(false); // Reset uploading flag
      } catch (error) {
        console.error('Error uploading files:', error);
        setUploadError('An error occurred during upload. Please try again.');

        setIsUploading(false); // Reset uploading flag
      } finally {
        setUploading(false); // Reset uploading state regardless of success or error
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadError('An error occurred during upload. Please try again.');
      setUploading(false); // Reset uploading state on error
      setIsUploading(false); // Reset uploading flag
    }
  };

  const otherFilesHandle = useRef<HTMLInputElement>(null);

  // Check if at least one file (CV or other) is selected for disabling the upload button
  const hasSelectedFiles = file || (otherFiles && otherFiles.length > 0);


  

  

  return (
    <div className="fixed bg-opacity-75 inset-0 z-50 flex justify-center items-center">
      <div className="bg-gray-300 rounded-lg p-4 shadow-md">
        <h5 className="text-center text-3xl text-blue-900 font-medium mb-4">Upload CV</h5>
        <div>
          <label htmlFor="file" className="block mb-2 text-sm text-blue-900 font-medium">
            CV Upload (Single File)
          </label>
          <input
            type="file"
            id="file"
            name="CV"
            required
            className="block w-full p-3 border border-gray-500 bg-gray-100 rounded-lg focus:outline-none focus:ring-blue-800 focus:border-blue-800"
            onChange={handleCvChange}
          />
          {file && <p className="mt-2 text-gray-600">{file.name}</p>}
        </div>
        <div className="mt-4">
          <label htmlFor="otherFiles" className="block mb-2 text-sm text-blue-900 font-medium">
            Supporting Documents (Multiple Files)
          </label>
          <input
            type="file"
            id="otherFiles"
            className="block w-full p-3 border border-gray-500 bg-gray-100 rounded-lg focus:outline-none focus:ring-blue-800 focus:border-blue-800"
            onChange={handleOtherFilesChange}
            multiple
            ref={otherFilesHandle}
          />
        </div>
        {uploadError && <p className="text-red-500 text-sm mb-2">{uploadError}</p>}
        <div className="flex justify-center mt-4">
          <button
            className="p-3 w-36 m-4 rounded-full bg-gray-500 text-white hover:bg-gray-700 focus:outline-none"
            onClick={()=>onClose("")}
          >
            Cancel
          </button>
          <button
          className="w-36 m-4 p-3 bg-blue-800 hover:bg-blue-900 text-white font-medium py-2 px-4 rounded-full"
          onClick={handleUpload}
          disabled={!hasSelectedFiles || isUploading}
        >
          {uploading ? (
            <div>
              <div className="flex items-center justify-center">
                <span>Uploading...</span>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
              </div>
              
            </div>
          ) : (
            'Upload'
          )}
        </button>
        </div>
      </div>

    </div>
  );
};

export default FileUpload;
