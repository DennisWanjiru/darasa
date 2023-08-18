import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";

type Props = {
  thumbnail: any;
  code: string;
  name: string;
  instructorId: string;
};

export default async function ClassCard({
  thumbnail,
  name,
  code,
  instructorId,
}: Props) {
  const supabase = createServerComponentClient({ cookies });
  const { data: instructors } = await supabase
    .from("profile")
    .select()
    .eq("id", instructorId);

  const instructor = instructors ? instructors[0] : null;

  return (
    <div className="card card-side shadow-md bg-secondary h-40">
      <figure className="w-1/3">
        <Image
          width={100}
          height={100}
          src={thumbnail}
          alt="cover"
          className="object-cover h-full"
        />
      </figure>
      <div className="card-body">
        <h4 className="invert-[.3]">{code}</h4>
        <h3 className="card-title truncate invert-[.2]">{name}</h3>
        {instructor ? (
          <p className="text-sm truncate">
            Instructor:{" "}
            <span className="text-blue-500">
              {instructor.prefix}. {instructor.name}{" "}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
