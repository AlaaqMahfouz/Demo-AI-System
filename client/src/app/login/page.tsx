'use client';

import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [loginError, setLoginError] = useState("");


    const supabase = createClientComponentClient();

    useEffect(() => {
        async function getUser(){
            const {data: {session}} = await supabase.auth.getSession()
            setUser(session?.user)
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

    const handleLogIn = async () => {

        if (!email || !password) {
            setLoginError("Email and/or Password not detected");
            return; // Prevent login attempt with empty fields
        }

        const res = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (res.error) {
            setLoginError("Failed: " + res.error.message);
            return; // Handle login error
        }

        setUser(res.data.user)
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
        <main className="h-screen flex items-center justify-center ">
            <div className="bg-gray-300 p-8 rounded-lg shadow-md w-96">
                <div className="text-6xl text-center text-blue-900 font-bold mb-2">Log In</div>
                <div className="text-sm text-center text-blue-900 font-semibold mb-7">AI Recruitment System</div>
                <div>
                    <input 
                        type="email" 
                        name="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className={`mb-4 w-full p-3 rounded-md border border-gray-400 bg-gray-200 text-blue-900 placeholder-gray-400 focus:outline-none focus:border-blue-800 ${
                            !email
                          }`}
                    />
                    <input 
                        type="password" 
                        name="password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className={`mb-4 w-full p-3 rounded-lg border border-gray-400 bg-gray-200 text-blue-900 placeholder-gray-400 focus:outline-none focus:border-blue-800 ${
                            !password
                          }`}
                    />
                    {/* <button 
                        onClick={handleSignUp}
                        className="w-full mb-2 p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
                    >
                        Sign Up
                    </button> */}
                    <button 
                        onClick={handleLogIn}
                        className="w-full p-3 mt-4 rounded-full bg-blue-800 hover:bg-blue-900 text-white  focus:outline-none"
                    >
                        Log In
                    </button>
                    {loginError && (
                        <div className="text-red-700 text-center mt-4">{loginError}</div>
                    )}
                </div>
            </div>
        </main>
    )

}