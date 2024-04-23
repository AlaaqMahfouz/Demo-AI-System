export function selectResume(selectedResumes: number[], ID: number){
    //to prevent duplicate IDs in the selectedResumes array 
    if (!selectedResumes.includes(ID)) {
      selectedResumes.push(ID);
    }  
}