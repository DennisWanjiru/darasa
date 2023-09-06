"use client";

import Image from "next/image";
import Edit from "@/assets/edit.svg";
import Delete from "@/assets/delete.svg";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { notify } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  id: string;
  instructor_id: string;
};

export default function ClassActions({ id, instructor_id }: Props) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();

  const handleDeleteClass = async () => {
    try {
      const { error } = await supabase
        .from("class")
        .delete()
        .eq("id", id)
        .eq("instructor_id", instructor_id);

      if (error) {
        throw error;
      }
      notify("Classes has been deleted!");
      router.refresh();
    } catch (error) {
      notify("Something went wrong!");
    }
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

      <Image
        height={30}
        width={30}
        src={Delete}
        alt="delete"
        onClick={handleDeleteClass}
        className="cursor-pointer"
      />
    </div>
  );
}
