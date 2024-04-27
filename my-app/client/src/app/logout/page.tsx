'use client'

import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { redirect, useRouter } from "next/navigation";
import { NextResponse } from 'next/server';
import { useEffect, useState } from 'react';

export default function LogoutPage(){
    const router = useRouter();
    const supabase = createClientComponentClient();

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            // try{
                const {data: {session}} = await supabase.auth.getSession()
                setUser(session?.user)
                if(user==null)
                    {
                        console.log("no user found");
                        await redirection()
                        
                    }
            
        }

        fetchUser();
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.replace('/login')
    }

    const redirection = async ()=>{
        return NextResponse.redirect("https://localhost:3000/login")
    }

    const handleCancel = {
        handleClick: () => {
          window.history.back();
        },
    };


    if (user){
        return (
        <div className="h-screen flex flex-col font-mono justify-center items-center">
            <div className="bg-gray-300 p-8 rounded-lg shadow-md w-96 text-center">
                <h1 className="mb-4 text-5xl font-bold text-blue-900">
                    LOG OUT
                </h1>
                <h1 className="mb-4 text-lg font-bold text-blue-900">
                    Do you surely want to log out?
                </h1>
            <div className='flex flex-row-reverse space-x-4 space-x-reverse mt-7'>
                <button
                    onClick={handleLogout}
                    className="w-full p-3 rounded-full bg-blue-800 text-white hover:bg-red-800 focus:outline-none"
                >
                    Logout
                </button>
                <button
                    onClick={handleCancel.handleClick}
                    className="w-full p-3 rounded-full bg-gray-500 text-white hover:bg-gray-700 focus:outline-none"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
    )}
   

}