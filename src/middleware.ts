import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return NextResponse.redirect('/login');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/newlisting'],
};
