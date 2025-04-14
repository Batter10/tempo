import React from "react";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log('[Root Middleware] Pathname:', pathname);

  // Als het een API route is, doe niets en ga door
  if (pathname.startsWith('/api')) {
    console.log('[Root Middleware] API route gedetecteerd, doorsturen...');
    return NextResponse.next();
  }

  // Anders, pas originele logica toe (of doe niets als er geen andere logica was)
  console.log('[Root Middleware] Geen API route, doorsturen...');
  return NextResponse.next();
}

export const config = {
  // Aangepaste matcher om API routes expliciet uit te sluiten van complexe logica
  // maar we laten ze wel door de middleware gaan voor logging
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
