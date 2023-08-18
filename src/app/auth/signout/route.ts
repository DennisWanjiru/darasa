import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const supabase = createRouteHandlerClient({ cookies });

    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return NextResponse.redirect(requestUrl.origin, {
      status: 301,
    });
  } catch (error) {
    console.log({ error });
  }
}
