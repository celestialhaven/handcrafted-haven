import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

function clearSession(request: Request) {
  const response = NextResponse.redirect(new URL("/sign-in", request.url));
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const secureCookie = forwardedProtocol
    ? forwardedProtocol === "https"
    : new URL(request.url).protocol === "https:";
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: secureCookie, expires: new Date(0), path: "/" });
  return response;
}

export async function GET(request: Request) {
  return clearSession(request);
}

export async function POST(request: Request) {
  return clearSession(request);
}
