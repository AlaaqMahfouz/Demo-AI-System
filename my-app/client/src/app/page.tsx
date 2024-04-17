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
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Link href={'/login'} className='bg-indigo-500 hover:bg-indigo-600 rounded-full text-white p-5'>
          You are not logged in.<br></br> <b>CLICK HERE</b> to go login.
        </Link>
      </main>
    )
  }

  return (
    redirect("/home")
  )
}