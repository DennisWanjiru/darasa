"use server";

import { CurrentUser, Profile } from "@/lib/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notify } from "./utils";

export const getCurrentUser = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const { data, error } = await supabase
      .from("profile")
      .select()
      .match({ email: session.user.email })
      .single();

    if (error) {
      notify("Something went wrong while fetching user", "error");
      throw error;
    }

    const user: Profile | null = data ?? null;

    if (user) {
      const { data: role } = await supabase
        .from("role")
        .select("name")
        .match({ id: user.role_id })
        .single();

      const currentUser: CurrentUser = {
        ...user,
        role: role?.name ?? "",
      };

      return currentUser;
    }
  }
};
