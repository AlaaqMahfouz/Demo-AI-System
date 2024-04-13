'use client'

// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'
import Link from 'next/link';

export default async function Login() {
  // const cookieStore = cookies();
  // const supabase = createServerComponentClient({cookies: () => cookieStore});

  // const {data: {user}} = await supabase.auth.getUser()

  // if (!user){
  //   return (
  //     <main className="flex min-h-screen flex-col items-center justify-between p-24">
  //       <Link href={'/login'}>
  //         You are not logged in. Click here to go login.
  //       </Link>
  //     </main>
  //   )
  // }

  return (
    <main>
      <div>
        <Link href={'/home'}>go home</Link>
      </div>
    </main>
  )
}