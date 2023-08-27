import { ClassType } from "@/lib/types";
import {
  cn,
  createAvatarUrl,
  getStatus,
  getUserFirstLetter,
} from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Button from "./Button";
import Edit from "@/assets/edit.svg";
import Delete from "@/assets/delete.svg";
import Link from "next/link";

type Props = {
  data: ClassType;
};

export default async function InstructorClassRow({ data }: Props) {
  const supabase = createServerComponentClient({ cookies });
  const { id, code, name, start_date, end_date, thumbnail } = data;

  const { data: count } = await supabase
    .from("enrollment")
    .select("count")
    .eq("class_id", id);

  const totalStudents: number = count ? count[0].count : 0;
  const status = getStatus(start_date, end_date);

  return (
    // <Link key={data.id} className="w-full" href={`/dashboard/classes/${id}`}>
    <tr className="border-0">
      <td className="invert-[.3]">{code}</td>
      <td className="text-blue-500">
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12 bg-green-800">
              {thumbnail ? (
                <Image
                  src={createAvatarUrl(thumbnail)}
                  alt="cover"
                  height={48}
                  width={48}
                  className="object-cover h-full"
                />
              ) : (
                <div className=" flex items-center justify-center text-2xl h-12 w-12 text-white">
                  {getUserFirstLetter(name)}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="font-semibold text-blue-500">{name}</div>
          </div>
        </div>
      </td>

      <td className="invert-[.3]">{start_date}</td>
      <td className="text-red-500">{end_date}</td>
      <td className=" invert-[.3]">{totalStudents}</td>
      <td className="w-28">
        <Button
          title={status}
          className={cn("h-7 bg-green-800 text-xs", {
            "bg-blue-800": status === "Upcoming",
            "bg-gray-800": status === "Completed",
          })}
        />
      </td>
      <td className="w-28">
        <div className="flex space-x-1.5 items-center">
          <Image src={Edit} alt="edit" />
          <Image height={30} width={30} src={Delete} alt="delete" />
        </div>
      </td>
    </tr>
    // </Link>
  );
}
