import Image from "next/image";
import UpDown from "@/assets/up-down.svg";
import { getUserFirstLetter } from "@/lib/utils";
import ViewProfileLink from "./ViewProfileLink";
import ProfileModal from "./ProfileModal";
import { CurrentUser } from "@/lib/types";

type Props = {
  user?: CurrentUser;
};

export default function SidebarFooter({ user }: Props) {
  return (
    <footer className="dropdown dropdown-top">
      <label
        tabIndex={0}
        className="px-6 flex items-center justify-between cursor-pointer"
      >
        {user?.avatar_url ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_STORAGE_BUCKET_URL}/avatars/${user.avatar_url}`}
            alt={user.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-xl"
          />
        ) : (
          <div className=" flex items-center justify-center text-2xl w-12 text-white rounded-xl bg-green-800">
            {getUserFirstLetter(user?.name ?? "U")}
          </div>
        )}

        <div className="flex flex-col">
          <p>
            {user?.prefix ? `${user?.prefix}.` : ""} {user?.name}
          </p>
          <p>{user?.role === "student" ? "Student" : "Instuctor"} Account</p>
        </div>
        <Image src={UpDown} alt="more" />
      </label>

      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 bg-secondary rounded-box w-52 text-primary shadow-md mb-5 m-7"
      >
        <ViewProfileLink />
        <form action="" method="post">
          <li>
            <button formAction="/auth/signout">Signout</button>
          </li>
        </form>
      </ul>

      {user ? <ProfileModal user={user} /> : null}
    </footer>
  );
}
