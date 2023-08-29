"use client";

import Image from "next/image";
import Edit from "@/assets/edit.svg";
import Delete from "@/assets/delete.svg";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ClassActions({
  id,
  instructor_id,
}: {
  id: string;
  instructor_id: string;
}) {
  const supabase = createClientComponentClient();

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
      //TODO: show success message
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <div className="flex space-x-1.5 items-center">
      <Image src={Edit} alt="edit" className="cursor-pointer" />
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
