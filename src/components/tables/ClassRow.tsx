import { ClassType, Grade } from "@/lib/types";
import {
  calculateGrade,
  cn,
  createAvatarUrl,
  getStatus,
  getUserFirstLetter,
} from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import { differenceInDays, format } from "date-fns";
import Button from "../Button";
import Avatar from "../Avatar";
import { getCurrentUser } from "@/lib/actions";

type Props = {
  data: ClassType;
};

export default async function ClassRow({ data }: Props) {
  const supabase = createServerComponentClient({ cookies });
  const { id, instructor_id, code, name, start_date, end_date } = data;
  const currentUser = await getCurrentUser();

  const { data: instructors } = await supabase
    .from("profile")
    .select()
    .eq("id", instructor_id);

  const { data: grades } = await supabase
    .from("grade")
    .select()
    .eq("student_id", currentUser?.id ?? "")
    .eq("class_id", id);

  const grade: Grade | null = grades ? grades[0] : null;
  const instructor = instructors ? instructors[0] : null;
  const status = getStatus(start_date, end_date);

  return (
    <tr className="border-0">
      <td className="invert-[.3]">{code}</td>
      <td className="text-blue-500">{name}</td>
      <td>
        <div className="flex items-center space-x-3">
          <Avatar name={instructor.name} url={instructor.avatar_url} />
          <div>
            <div className="font-semibold text-blue-500">
              {instructor?.prefix}. {instructor?.name}
            </div>
          </div>
        </div>
      </td>

      <td className="invert-[.3]">
        {grade ? calculateGrade(grade.grade) : "-"}
      </td>
      <td className="invert-[.3]">{grade?.grade ? `${grade?.grade}%` : "-"}</td>

      <td className="w-28">
        <Button
          title={status}
          className={cn("h-7 bg-green-800 text-xs", {
            "bg-blue-800": status === "Upcoming",
            "bg-gray-800": status === "Completed",
          })}
        />
      </td>
    </tr>
  );
}
