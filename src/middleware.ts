import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@/lib/schema";

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient<Database>({ req, res });
    const { error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }

    return res;
  } catch (error) {
    console.log({ error });
  }
}
