import { NextResponse } from 'next/server';

export function middleware(req) {
  // Get the request URL
  const url = req.nextUrl.clone();

  // Continue to the next middleware or route
  return NextResponse.next();
}