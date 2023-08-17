import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import "../globals.css";
import DashIcon from "@/assets/dashboard.svg";
import Pile from "@/assets/pile.svg";
import Explore from "@/assets/explore.svg";
import Logo from "@/components/Logo";
import Image from "next/image";
import NavLink from "@/components/NavLink";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Darasa | Dahsboard",
  description: "Darasa a school management system",
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session) {
    redirect("/");
  }

  const { data: users } = await supabase
    .from("profile")
    .select("email")
    .eq("email", session.user.email);

  if (!users?.length) {
    redirect("/account");
  }

  return (
    <div className="bg-primary h-screen text-secondary flex">
      <Sidebar />
      <main className="bg-tertiary mt-4 w-full rounded-t-[20px] py-10 px-10 text-primary">
        {children}
      </main>
    </div>
  );
}
