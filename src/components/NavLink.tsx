import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type Props = {
  active?: boolean;
  title: string;
  Icon: any;
  to: string;
};

export default function NavLink({ to, title, active, Icon }: Props) {
  return (
    <Link
      href={to}
      className={cn(
        "h-12 flex items-center space-x-4 px-6 cursor-pointer group hover:text-secondary text-[16px]",
        {
          "text-white": active,
          "text-[#4D4D4D]": !active,
        }
      )}
    >
      <Image
        alt={title}
        src={Icon}
        className={cn("group-hover:filter-none", { "invert-[.7]": !active })}
      />
      <p>{title}</p>
    </Link>
  );
}
