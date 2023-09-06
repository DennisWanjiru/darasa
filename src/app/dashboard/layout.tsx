import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

import "../globals.css";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions";

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
  const currentUser = await getCurrentUser();
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";

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

  const instructorOnly =
    currentUser?.role === "student" && pathname === "/dashboard/classes";

  const studentOnly =
    currentUser?.role === "instructor" && pathname === "/dashboard/explore";

  if (instructorOnly || studentOnly) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-primary h-screen text-secondary flex">
      <Sidebar />
      <main className="bg-tertiary mt-4 w-full rounded-tl-[20px] py-10 px-10 text-primary overflow-scroll">
        {children}
      </main>
    </div>
  );
}
