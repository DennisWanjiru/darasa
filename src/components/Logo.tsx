import React from "react";

import SvgIcon from "@/assets/logo.svg";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center space-x-4">
      <Image src={SvgIcon} height={30} width={38} alt="darasa-logo" />
      <h1 className="text-[24px] font-semibold">Darasa</h1>
    </div>
  );
}
