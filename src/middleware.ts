/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from "next/server";
import { NextResponse, userAgent } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
