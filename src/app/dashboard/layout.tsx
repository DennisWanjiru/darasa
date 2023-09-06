import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

import "../globals.css";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Darasa | Dashboard",
  description: "Darasa a school management system",
};

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
      <div className="hidden sm:flex">
        <Sidebar />
      </div>

      <main className="bg-tertiary mt-0 sm:mt-4 w-full sm:rounded-tl-[20px] px-5 py-2 sm:p-10  text-primary overflow-scroll">
        <div className="drawer mb-2 sm:hidden">
          <input id="sidebar" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="sidebar" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>

          <div className="drawer-side z-50">
            <label htmlFor="sidebar" className="drawer-overlay"></label>

            <div className="menu p-4 min-h-full bg-primary text-white">
              <Sidebar />
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
