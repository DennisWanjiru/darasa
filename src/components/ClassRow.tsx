import { Class } from "@/lib/types";
import { createAvatarUrl, getUserFirstLetter } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Supa from "@/assets/supaman.jpeg";
import Image from "next/image";
import Button from "./Button";

type Props = {
  data: Class;
};

export default async function ClassRow({ data }: Props) {
  const supabase = createServerComponentClient({ cookies });
  const { instructor_id, code, name } = data;

  const { data: instructors } = await supabase
    .from("profile")
    .select()
    .eq("id", instructor_id);

  const instructor = instructors ? instructors[0] : null;

  return (
    <tr className="border-0">
      <td className="invert-[.3]">{code}</td>
      <td className="text-blue-500">{name}</td>
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-circle w-12 h-12 bg-green-800">
              {instructor.avatar_url ? (
                <Image
                  src={createAvatarUrl(instructor.avatar_url)}
                  alt="cover"
                  height={48}
                  width={48}
                  className="object-cover h-full"
                />
              ) : (
                <div className=" flex items-center justify-center text-2xl h-12 w-12 text-white">
                  {getUserFirstLetter(instructor.name)}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="font-semibold text-blue-500">
              {instructor?.prefix}. {instructor?.name}
            </div>
          </div>
        </div>
      </td>

      <td className="invert-[.3]">91</td>
      <td className="invert-[.3]">A</td>
      <td className="w-28">
        <Button title="Active" className="h-7 bg-green-800 text-xs" />
      </td>
    </tr>
  );
}
