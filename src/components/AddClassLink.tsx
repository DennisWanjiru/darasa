"use client";

import Image from "next/image";
import Add from "@/assets/add.svg";
import { cn } from "@/lib/utils";
import ProfileModal from "./modals/ProfileModal";
import { Category, CurrentUser } from "@/lib/types";
import CreateClassModal from "./modals/CreateClassModal";
import { useState } from "react";

type Props = {
  className: string;
  categories: Category[];
  currentUser?: CurrentUser;
};

export default function AddClassLink({
  className,
  currentUser,
  categories,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={cn(
          "flex items-center justify-center bg-primary text-white h-12 px-2.5 rounded-[10px] w-full",
          className
        )}
        // @ts-ignore
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image src={Add} alt="Plus Icon" className="mr-2.5" />
        Add Class
      </button>

      {currentUser ? (
        <CreateClassModal
          isOpen={isOpen}
          categories={categories}
          currentUser={currentUser}
          closeModal={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );
}
