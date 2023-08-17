import Image from "next/image";
import { cookies, headers } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import Logo from "./Logo";
import NavLink from "./NavLink";
import Pile from "@/assets/pile.svg";
import DashIcon from "@/assets/dashboard.svg";
import Explore from "@/assets/explore.svg";
import UpDown from "@/assets/up-down.svg";

export default async function Sidebar() {
  const supabase = createServerComponentClient({ cookies });
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const getUser = async () => {
    try {
      if (session) {
        const email = session.user.email;
        const { data: users, error } = await supabase
          .from("profile")
          .select("*")
          .eq("email", session.user.email);

        if (error) throw error;

        if (users[0]) {
          const { data: roles, error } = await supabase
            .from("role")
            .select("name")
            .eq("id", users[0].role_id);

          return { ...users[0], role: roles ? roles[0].name : "" };
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const user: any = await getUser();

  return (
    <aside className="w-80 pt-12 h-scren ">
      <Logo theme="dark" className="px-6" />

      <nav className="mt-20 flex flex-grow col-span-full flex-col justify-between h-[calc(100%-140px)]">
        <ul>
          <NavLink
            to="/dashboard"
            title="Home"
            active={pathname === "/dashboard"}
            Icon={DashIcon}
          />
          <NavLink
            to="/dashboard/classes"
            active={pathname === "/dashboard/classes"}
            title="Classes"
            Icon={Pile}
          />
          <NavLink
            title="Explore"
            to="/dashboard/explore"
            active={pathname === "/dashboard/explore"}
            Icon={Explore}
          />
        </ul>
        <footer className="px-6 flex items-center justify-between">
          {user?.avatar_url ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_STORAGE_BUCKET_URL}/avatars/${user.avatar_url}`}
              alt={user.name}
              width={44}
              height={44}
              className="h-11 w-11 rounded-xl"
            />
          ) : null}

          <div className="flex flex-col">
            <p>{user?.name}</p>
            <p>{user?.role === "student" ? "Student" : "Instuctor"} Account</p>
          </div>
          <Image src={UpDown} alt="more" />
        </footer>
      </nav>
    </aside>
  );
}
