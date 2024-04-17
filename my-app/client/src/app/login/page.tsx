'use client';

import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);


    const supabase = createClientComponentClient();

    useEffect(() => {
        async function getUser(){
            const {data: {user}} = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }

        getUser();
    }, [])


    // const handleSignUp = async () => {
    //     const res = await supabase.auth.signUp({
    //         email,
    //         password,
    //         options: {
    //             emailRedirectTo: `${location.origin}/auth/callback`
    //         }
    //     })
    //     setUser(res.data.user)
    //     router.refresh();
    //     setEmail('')
    //     setPassword('')
    // }

    const handleSignIn = async () => {
        const res = await supabase.auth.signInWithPassword({
            email,
            password
        })
        setUser(res.data.user)
        router.refresh();
        setEmail('')
        setPassword('')
    }

    console.log({loading, user})

    if (loading){
        return <h1>loading..</h1>
    }

    if (user){
        redirect("/home")
    }

    return (
        <main className="h-screen flex items-center justify-center bg-white dark:bg-gray-700 p-6">
        <div className="bg-gray-900 p-8 rounded-lg shadow-md w-96">
        <input 
            type="email" 
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-4 w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        />
                <input 
            type="password" 
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-4 w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        />
        {/* <button 
            onClick={handleSignUp}
            className="w-full mb-2 p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
        >
            Sign Up
        </button> */}
        <button 
            onClick={handleSignIn}
            className="w-full p-3 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white  focus:outline-none"
        >
            Sign In
        </button>
        </div>
        </main>
    )

}