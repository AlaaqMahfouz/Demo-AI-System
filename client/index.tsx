import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'
import Link from 'next/link';

export default async function Login() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({cookies: () => cookieStore});

 

  return (
    <div>
        <p> hello to AI</p>
    </div>
  )
}