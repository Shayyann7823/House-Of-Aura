import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("heemia_session")?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout", "/account/orders"],
};