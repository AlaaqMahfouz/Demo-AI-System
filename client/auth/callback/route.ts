import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs'
import {cookies} from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';


// export async function GET(request: { url: string | URL; }){
//     const requestUrl = new URL(request.url);
//     const code = requestUrl.searchParams.get('code');
//     if (code){
//         const cookieStore = cookies();
//         const supabase = createRouteHandlerClient({cookies: () => cookieStore})
//         await supabase.auth.exchangeCodeForSession(code);
//     }
//     return NextResponse.redirect(requestUrl.origin)
// }


export async function GET(request:Request | NextRequest){
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    if (code){
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({cookies: () => cookieStore})
        await supabase.auth.exchangeCodeForSession(code);
    }
    return NextResponse.redirect(requestUrl.origin)
}