import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import type { Database } from "@/types/schema";

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const requestUrl = new URL(request.url);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/onboarding/signin");
  }

  return redirect("/onboarding/account");
}
