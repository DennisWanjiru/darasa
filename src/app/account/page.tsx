import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import AccountForm from "./AccountForm";
import Logo from "@/components/Logo";
import { Major, Role } from "@/lib/types";

export default async function Account() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const { data: users, error: userError } = await supabase
    .from("profile")
    .select("email")
    .eq("email", session.user.email);

  if (userError) throw userError;

  if (users?.length) {
    redirect("/dashboard");
  }

  const res = await supabase.from("major").select("*");
  if (res.error) throw res.error;
  const majors = res.data as Major[] | null;

  const rolesRes = await supabase.from("role").select("*");
  if (rolesRes.error) throw rolesRes.error;
  const roles = rolesRes.data as Role[] | null;

  return (
    <main className="flex flex-col h-screen w-screen items-center justify-center px-16 md:p-0">
      <Logo />
      <AccountForm
        session={session}
        roles={roles ?? []}
        majors={majors ?? []}
      />
    </main>
  );
}
