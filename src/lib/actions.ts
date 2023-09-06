"use server";

import { CurrentUser, Profile } from "@/lib/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const getCurrentUser = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const { data, error } = await supabase
      .from("profile")
      .select()
      .eq("email", session.user.email);

    if (error) {
      console.log("Something went wrong while fetching user", error);
      throw error;
    }

    const user: Profile | null = data[0] ?? null;

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
