import { cookies, headers } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import Logo from "./Logo";
import NavLink from "./NavLink";
import DashIcon from "@/assets/dashboard.svg";
import Explore from "@/assets/explore.svg";
import SidebarFooter from "./SidebarFooter";

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
            title="Explore"
            to="/dashboard/explore"
            active={pathname === "/dashboard/explore"}
            Icon={Explore}
          />
        </ul>
        <SidebarFooter user={user} />
      </nav>
    </aside>
  );
}
