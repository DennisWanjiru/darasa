"use client";

import Logo from "./Logo";
import NavLink from "./NavLink";
import DashIcon from "@/assets/dashboard.svg";
import Explore from "@/assets/explore.svg";
import Pile from "@/assets/pile.svg";
import SidebarFooter from "./SidebarFooter";
import { getCurrentUser } from "@/lib/actions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CurrentUser } from "@/lib/types";

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | undefined>();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  return (
    <aside className="w-80 pt-12 h-scren ">
      <Logo theme="dark" />

      <nav className="mt-20 flex flex-grow col-span-full flex-col justify-between h-[calc(100%-140px)]">
        <ul>
          <NavLink
            to="/dashboard"
            title="Home"
            active={pathname === "/dashboard"}
            Icon={DashIcon}
          />

          {user?.role === "instructor" ? (
            <NavLink
              title="Classes"
              to="/dashboard/classes"
              active={pathname.includes("/dashboard/classes")}
              Icon={Pile}
            />
          ) : (
            <NavLink
              title="Explore"
              to="/dashboard/explore"
              active={pathname === "/dashboard/explore"}
              Icon={Explore}
            />
          )}
        </ul>
        {user ? <SidebarFooter user={user} /> : null}
      </nav>
    </aside>
  );
}
