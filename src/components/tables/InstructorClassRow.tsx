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
import Link from "next/link";
import Button from "../Button";
import ClassActions from "../ClassActions";
import Avatar from "../Avatar";

type Props = {
  data: ClassType;
};

export default async function InstructorClassRow({ data }: Props) {
  const supabase = createServerComponentClient({ cookies });
  const { id, code, name, start_date, end_date, thumbnail, instructor_id } =
    data;

  const { data: count } = await supabase
    .from("enrollment")
    .select("count")
    .eq("class_id", id);

  const totalStudents: number = count ? count[0].count : 0;
  const status = getStatus(start_date, end_date);

  return (
    <tr className="border-0">
      <td className="invert-[.3]">{code}</td>
      <td className="text-blue-500">
        <Link
          className="flex items-center space-x-3"
          href={`/dashboard/classes/${id}`}
        >
          <Avatar name={name} url={thumbnail ?? undefined} variant="square" />
          <div>
            <div className="font-semibold text-blue-500">{name}</div>
          </div>
        </Link>
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
        <ClassActions id={id} instructor_id={instructor_id} />
      </td>
    </tr>
  );
}
