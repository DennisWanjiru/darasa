import { CurrentUser, Profile } from "@/lib/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getCurrentUser = async () => {
  "use server";

  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  try {
    if (session) {
      const { data: users, error } = await supabase
        .from("profile")
        .select("*")
        .eq("email", session.user.email);

      if (error) throw error;

      const user: Profile | null = users[0] ?? null;

      if (user) {
        const { data: roles, error } = await supabase
          .from("role")
          .select("name")
          .eq("id", user.role_id);

        const currentUser: CurrentUser = {
          ...user,
          role: roles ? roles[0].name : "",
        };

        return currentUser;
      }
    }
  } catch (error) {
    console.log({ error });
  }
};

export default getCurrentUser;
