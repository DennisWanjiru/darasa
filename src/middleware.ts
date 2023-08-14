import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if user is signed in and the current path is /auth/signin redirect the user to /auth/account
  if (user && req.nextUrl.pathname === "/auth/signin") {
    return NextResponse.redirect(new URL("/auth/account", req.url));
  }

  // if user is not signed in and the current path is not /auth/signin redirect the user to /auth/signin
  if (!user && req.nextUrl.pathname !== "/auth/signin") {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/auth/signin", "/auth/account"],
};
