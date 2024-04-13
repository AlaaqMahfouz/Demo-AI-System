'use client'

//to retrieve old records from supabase

export default function GetOldRecords(){
    return(
        <div>
            <p className='text-center font-bold mb-4'>
                Old Records
            </p>
            <div className="outer-container">
                <div className="w-48 h-36 bg-white m-4 p-4 rounded-3xl">
                    <p className="text-indigo-500 text-center justify-center">Old record title
                        <br></br>//actual results nb//
                        <br></br>Date
                        <br></br>...
                    </p>
                </div>
                <div className="w-48 h-36 bg-white m-4 p-4 rounded-3xl">
                    <p className="text-indigo-500 text-center justify-center">Old record title
                        <br></br>//actual results nb//
                        <br></br>Date
                        <br></br>...
                    </p>
                </div>
                <div className="w-48 h-36 bg-white m-4 p-4 rounded-3xl">
                    <p className="text-indigo-500 text-center justify-center">Old record title
                        <br></br>//actual results nb//
                        <br></br>Date
                        <br></br>...
                    </p>
                </div>
            </div>
        </div>
    );
}