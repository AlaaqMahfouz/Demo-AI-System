'use client'

export default function SearchBar(){
    return(
        <form className="form text-center searchbar">
            <div className="flex items-center justify-center m-5 mt-12 mb-1">
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-white sr-only dark:text-white"></label>
                <div className="relative w-2/3">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-blue-600 dark:text-indigo-500" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="text" id="search_input" className="block w-full p-4 ps-10 text-sm text-white border border-white rounded-full bg-white focus:ring-white focus:border-indigo-500 dark:bg-white dark:border-indigo-500 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="Search Requirements..." required />
                </div>
            </div>
            <div className="form flex items-center justify-center h-full">
                <div className="align-center">
                    <label htmlFor="resultNumber" className="mb-2 text-sm font-medium text-indigo-500 mr-3 dark:text-white"></label>
                    <div className="flex">
                        <p className="text-indigo-600 p-4">
                            Enter the number of results needed:
                        </p>
                        <input type="number" id="resultNumber" name="resultNumber" min="1" max="20" className="block ps-4 text-center text-sm text-white border border-white rounded-full bg-white focus:ring-white focus:border-indigo-500 dark:bg-white dark:border-indigo-400 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-indigo-400 dark:focus:border-indigo-400" placeholder="5" required />
                    </div>
                </div>
            </div>
            <button type="button" className="text-white focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 bg-indigo-500 hover:bg-indigo-600 dark:focus:ring-blue-600">Submit</button>
        </form>
    );
}