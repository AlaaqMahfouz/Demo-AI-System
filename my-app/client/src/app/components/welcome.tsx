'use client'

export default function Welcome(){
    return(
        <div className="border-gray-200 dark:bg-indigo-500 content-center font-mono w-auto h-auto pt-7 pb-10">
            <div className="max-w-screen-xl mx-auto">
                <p className="text-gray-300 text-center sm:text-8xl text-6xl">
                    AI
                </p>
                <p className="text-gray-300 text-center sm:text-7xl text-4xl">
                    Recruitment System
                </p>
                <p className="p-12 text-gray-300 text-center pt-7 pb-10 sm:text-base text-xs">
                    Faster and more efficient way to recruit your desired candidates based on the desired qualifications.
                </p>
            </div>
        </div>
    );
}