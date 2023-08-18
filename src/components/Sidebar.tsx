import { headers } from "next/headers";

import Logo from "./Logo";
import NavLink from "./NavLink";
import DashIcon from "@/assets/dashboard.svg";
import Explore from "@/assets/explore.svg";
import SidebarFooter from "./SidebarFooter";
import getCurrentUser from "@/actions/getCurrentUser";

export default async function Sidebar() {
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";

  const user = await getCurrentUser();

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
