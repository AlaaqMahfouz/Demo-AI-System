'use client'

export default function Welcome(){
    return(
        <div className="content-center font-mono w-auto h-auto pt-7 pb-10">
            <div className="max-w-screen-xl mx-auto">
                <p className="text-blue-900 font-extrabold text-center sm:text-8xl text-6xl">
                    AI
                </p>
                <p className="text-blue-900 text-center font-bold sm:text-7xl text-4xl">
                    Recruitment System
                </p>
                <p className="p-12 font-semibold text-blue-900 text-center pt-7 pb-10 sm:text-base text-xs">
                    Faster and more efficient way to recruit your desired candidates based on the desired qualifications.
                </p>
                <hr className="max-w mx-8 mt-4 border-blue-950 border-2" />
            </div>
        </div>
    );
}
