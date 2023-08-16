import {
  createPagesBrowserClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import "../globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { cookies } from "next/headers";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Darasa | Dahsboard",
  description: "Darasa a school management system",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

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
    <html lang="en">
      <h1>Dashboard</h1>
      <body className={nunito.className}>{children}</body>
    </html>
  );
}
