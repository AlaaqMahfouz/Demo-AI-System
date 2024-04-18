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
                        //  router.replace('/login')
                    //   return NextResponse.redirect("https://localhost:3000/login")
                        
                    }
            // }catch(error)
            // {
            //     console.log("error while authenticating user :"+error);
              
            // }
            
        }

        fetchUser();
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.replace('/login')
        // return NextResponse.redirect("https://localhost:3000/login")
    }

    const redirection = async ()=>{
        //  router.replace('/login')
        return NextResponse.redirect("https://localhost:3000/login")
    }

    const handleCancel = {
        handleClick: () => {
          window.history.back();
        },
    };


    if (user){
        return (
        <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-96 text-center">
            <h1 className="mb-4 text-xl font-bold text-gray-700 dark:text-gray-300">
                LOG OUT
            </h1>
            <h1 className="mb-4 text-xl font-bold text-gray-700 dark:text-gray-300">
                Do you surely want to log out ?
            </h1>
            <div className='flex flex-row-reverse space-x-4 space-x-reverse'>
                <button
                    onClick={handleLogout}
                    className="w-full p-3 rounded-md bg-indigo-500 text-white hover:bg-red-600 focus:outline-none"
                >
                    Logout
                </button>
                <button
                    onClick={handleCancel.handleClick}
                    className="w-full p-3 rounded-md bg-gray-500 text-white hover:bg-gray-700 focus:outline-none"
                >
                    Cancel
                </button>
            </div>
            
        </div>
    </div>
    )}
   

}