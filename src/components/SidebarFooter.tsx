import Image from "next/image";
import UpDown from "@/assets/up-down.svg";
import { getUserFirstLetter } from "@/lib/utils";
import ViewProfileLink from "./ViewProfileLink";
import ProfileModal from "./modals/ProfileModal";
import { CurrentUser } from "@/lib/types";
import Avatar from "./Avatar";
import { useState } from "react";

type Props = {
  user: CurrentUser;
};

export default function SidebarFooter({ user }: Props) {
  return (
    <footer className="dropdown dropdown-top">
      <label
        tabIndex={0}
        className="px-6 flex items-center justify-between cursor-pointer"
      >
        <Avatar
          variant="square"
          name={user.name}
          url={user.avatar_url ?? undefined}
        />

        <div className="flex flex-col">
          <p className="truncate">
            {user.prefix ? `${user.prefix}.` : ""} {user?.name}
          </p>
          <p className="truncate">
            {user.role === "student" ? "Student" : "Instuctor"} Account
          </p>
        </div>
        <Image src={UpDown} alt="more" />
      </label>

      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 bg-secondary rounded-box w-52 text-primary shadow-md mb-5 m-7"
      >
        <ViewProfileLink user={user} />
        <form action="" method="post">
          <li>
            <button formAction="/auth/signout">Signout</button>
          </li>
        </form>
      </ul>
    </footer>
  );
}
