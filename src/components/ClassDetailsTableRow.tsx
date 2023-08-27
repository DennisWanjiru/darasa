import { Enrollment, Grade } from "@/lib/types";
import {
  calculateGrade,
  createAvatarUrl,
  getUserFirstLetter,
} from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Edit from "@/assets/edit.svg";

type Props = {
  data: Enrollment;
};

export default async function ClassDetailsTableRow({ data }: Props) {
  const supabase = createServerComponentClient({ cookies });
  const { data: students } = await supabase
    .from("profile")
    .select("name, avatar_url, email")
    .eq("id", data.student_id);

  const { data: grades, error } = await supabase
    .from("grade")
    .select()
    .eq("student_id", data.student_id)
    .eq("class_id", data.class_id);

  const grade: Grade | null = grades ? grades[0] : null;
  const student = students ? students[0] : null;

  return (
    <tr className="border-0 text-gray-800">
      <td>{grade?.grade}%</td>
      <td className="text-blue-500">
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-circle w-12 h-12 bg-green-800">
              {student?.avatar_url ? (
                <Image
                  src={createAvatarUrl(student.avatar_url)}
                  alt="cover"
                  height={48}
                  width={48}
                  className="object-cover h-full"
                />
              ) : (
                <div className=" flex items-center justify-center text-2xl h-12 w-12 text-white">
                  {getUserFirstLetter(student?.name ?? "")}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="font-semibold text-blue-500">{student?.name}</div>
          </div>
        </div>
      </td>
      {student ? <td>{student.email}</td> : null}
      {grade ? <td>{calculateGrade(grade.grade)}</td> : null}
      <td>
        <Image src={Edit} alt="edit" />
      </td>
    </tr>
  );
}
