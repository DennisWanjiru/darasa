import { Database } from "@/lib/schema";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const supabase = createRouteHandlerClient<Database>({ cookies });

    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return NextResponse.redirect(requestUrl.origin, {
      status: 301,
    });
  } catch (error) {
    console.log({ error });
  }
}
