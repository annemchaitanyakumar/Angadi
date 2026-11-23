import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  try {
    return await updateSession(request);
  } catch (err) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - photos / fonts / textures (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|photos/|fonts/|textures/|assets/).*)',
  ],
};
