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
import { differenceInDays, format } from "date-fns";
import Button from "../Button";
import Avatar from "../Avatar";

type Props = {
  data: ClassType;
};

export default async function ClassRow({ data }: Props) {
  const supabase = createServerComponentClient({ cookies });
  const { instructor_id, code, name, start_date, end_date } = data;

  const { data: instructors } = await supabase
    .from("profile")
    .select()
    .eq("id", instructor_id);

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

      <td className="invert-[.3]">-</td>
      <td className="invert-[.3]">-</td>
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
