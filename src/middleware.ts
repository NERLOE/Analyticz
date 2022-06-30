/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from "next/server";
import { NextResponse, userAgent } from "next/server";

export function middleware(request: NextRequest) {
  console.log("middleware request", request);
  const ua = userAgent(request);
  const ip = request.ip;
  const geo = request.geo;

  console.log("ua", ua);
  console.log("ip", ip);
  console.log("geo", geo);

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
