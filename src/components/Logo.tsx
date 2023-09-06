import Image from "next/image";

import LogoIcon from "@/assets/logo.svg";
import LogoIconDark from "@/assets/logo-dark.svg";
import { cn } from "@/lib/utils";

type Props = {
  theme: "dark" | "light";
  className?: string;
};

export default function Logo({ theme, ...props }: Props) {
  return (
    <div className="flex px-6 space-x-4 items-center">
      <Image
        alt="darasa-logo"
        src={theme === "dark" ? LogoIconDark : LogoIcon}
        {...props}
        height={42}
        width={39}
      />
      <h1
        className={cn("text-2xl font-semibold", {
          "text-primary": theme === "light",
        })}
      >
        Darasa
      </h1>
    </div>
  );
}
