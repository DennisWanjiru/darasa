import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
      const supabase = createRouteHandlerClient<Database>({ cookies });
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) throw error;
    }

    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
  } catch (error) {
    console.log({ error });
  }
}
