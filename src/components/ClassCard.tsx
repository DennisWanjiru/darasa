import { cn } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Button from "./Button";
import ClassInfoModal from "./modals/ClassInfoModal";
import Link from "next/link";
import { enrollToClass, getCurrentUser } from "@/lib/actions";

type Props = {
  id: string;
  thumbnail: any;
  code: string;
  name: string;
  type?: "enroll" | "normal";
  instructorId: string;
  className?: string;
};

export default async function ClassCard({
  thumbnail,
  name,
  code,
  type,
  id,
  className,
  instructorId,
}: Props) {
  const supabase = createServerComponentClient({ cookies });
  const { data: instructors } = await supabase
    .from("profile")
    .select()
    .eq("id", instructorId);
  const currentUser = await getCurrentUser();

  const instructor = instructors ? instructors[0] : null;

  return (
    <div
      className={cn(
        "card card-side shadow-md bg-secondary h-40 w-1/3 max-w-sm",
        className
      )}
    >
      <figure className="w-1/3">
        <Image
          width={100}
          height={100}
          src={thumbnail}
          alt="cover"
          className="object-cover h-full"
        />
      </figure>
      <div
        className={cn("card-body justify-center", {
          "py-4": type === "enroll",
        })}
      >
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

        {type === "enroll" && currentUser ? (
          <form action={enrollToClass} className="w-20">
            <input value={id} name="class_id" className="hidden" />
            <Button
              type="submit"
              title="Enroll"
              className="h-7 bg-primary text-xs rounded-md"
            />
          </form>
        ) : null}
      </div>
    </div>
  );
}
