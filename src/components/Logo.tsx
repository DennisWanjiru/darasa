import Image from "next/image";

import LogoIcon from "@/assets/logo.svg";
import LogoIconDark from "@/assets/logo-dark.svg";
import { ComponentProps } from "react";

type Props = {
  theme?: "dark" | "light";
  className?: string;
};

export default function Logo({ theme, ...props }: Props) {
  return (
    <Image
      alt="darasa-logo"
      src={theme === "dark" ? LogoIconDark : LogoIcon}
      {...props}
    />
  );
}
