'use client'

import { createClient } from '@supabase/supabase-js';
// import fs from 'fs';
// import { MIMEType } from 'util';

const client = createClient("https://oquytlezdjnnavnjwsue.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");

export const downloadFolder= async (folderPath: number) => {

  console.log("dwnlaoading folder.." + folderPath)
  const { data, error } = await client.storage
   .from('Supporting Docs')
   .list(`${folderPath}/`);


   console.log("Data from supabase : " + JSON.stringify(data))

  if (error) {
    console.error('Error downloading file:', error);
    return null;
  }
  else{
    console.log("data ::: " + JSON.stringify(data))
  }


  const promises:any[] = [];


  data.forEach((file) => {
    console.log("file name : " +file.name)
    promises.push(
      client.storage.from('Supporting Docs').download(`${folderPath}/${file.name}`)
    );
  });

  const response = await Promise.allSettled(promises);

  console.log("response ::: " + JSON.stringify(response))

// Map the response to an array of objects containing the file name and blob
const downloadedFiles = response.map((result, index) => {
  if (result.status === "fulfilled") {
    console.log("blob inside :: "+ result.value.data);
    return {
      name: data[index].name,
      blob: result.value.data,
    };
  }
});

for(const file of downloadedFiles){

  const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(file?.blob);
        downloadLink.download = file?.name || " ";

        // Trigger the download
        downloadLink.click();

        // Clean up
        URL.revokeObjectURL(downloadLink.href);

  // const url = URL.createObjectURL(await zipWriter.close());
  // const link = document.createElement("a");
  
  // link.href = url;
  // link.setAttribute("download", "documents.zip");
  
  // document.body.appendChild(link);
  
  // link.click();
}


console.log("downloaded : "+ JSON.stringify(downloadedFiles))

return downloadedFiles;
//   for(const file of data)
//     {

//       const File = file as unknown as FileData;


//       console.log("Downloading files.." + file.name)
//     try {
//       console.log("File's path :" + `${folderPath}/${file.name}`)


//       const mimeType = file.metadata.mimetype;
//       console.log("mimetype to download :" + mimeType)
//       // Download file from Supabase storage
//       const response = await fetch(`${folderPath}/${file.name}`, {
//         headers: {
//           'Content-Type': mimeType
//         }});

 

//       const blob = await response.blob();

//       // console.log("blob : " + JSON.stringify(blob))

//       const downloadLink = document.createElement('a');
//         downloadLink.href = URL.createObjectURL(blob);
//         downloadLink.download = file.name;

//         // Trigger the download
//         downloadLink.click();

//         // Clean up
//         URL.revokeObjectURL(downloadLink.href);
//     } catch (error) {
//       console.error('Error downloading file:', error);
//     }

// };

}


interface FileData {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
    cacheControl: string;
    lastModified: string;
    contentLength: number;
    httpStatusCode: number;
  };
}
