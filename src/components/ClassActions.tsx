"use client";

import Image from "next/image";
import Edit from "@/assets/edit.svg";
import Delete from "@/assets/delete.svg";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { notify } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  instructor_id: string;
};

export default function ClassActions({ id, instructor_id }: Props) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClass = async () => {
    setIsDeleting(true);
    const { error } = await supabase
      .from("class")
      .delete()
      .match({ id })
      .match({ instructor_id });

    if (error) {
      notify("Something went wrong!");
      return;
    }

    notify("Classes has been deleted!");
    router.refresh();
  };

  const handleEditClass = () => {
    router.push(`${pathname}?id=${id}`);
  };

  return (
    <div className="flex space-x-1.5 items-center">
      <Image
        src={Edit}
        alt="edit"
        className="cursor-pointer"
        onClick={handleEditClass}
      />

      <button
        disabled={isDeleting}
        className="cursor-pointer disabled:cursor-not-allowed"
        onClick={handleDeleteClass}
      >
        <Image height={30} width={30} src={Delete} alt="delete" />
      </button>
    </div>
  );
}
