import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'
import Link from 'next/link';

export default async function Login() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({cookies: () => cookieStore});

  const {data: {user}} = await supabase.auth.getUser()
  
  if (!user){
    return (
      <main className="bg-gray-300 flex min-h-screen flex-col items-center justify-center p-24">
        <Link href={'/login'} className='bg-blue-800 hover:bg-blue-900 rounded-full text-white p-5'>
          You are not logged in.<br></br> <b>CLICK HERE</b> to go login.
        </Link>
      </main>
    )
  }

  return (
    redirect("/home")
  )
}