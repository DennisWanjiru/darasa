"use client";

import { cn } from "@/lib/utils";
import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Button from "./Button";
import ClassInfoModal from "./modals/ClassInfoModal";
import Link from "next/link";
import { enrollToClass, getCurrentUser } from "@/lib/actions";
import { useEffect, useState } from "react";
import { CurrentUser, Profile } from "@/lib/types";

type Props = {
  id: string;
  thumbnail: any;
  code: string;
  name: string;
  type?: "enroll" | "normal";
  instructorId: string;
  className?: string;
  isEnrolled?: boolean;
  showInfo?: (id: string) => void;
};

export default function ClassCard({
  thumbnail,
  name,
  code,
  type,
  id,
  showInfo,
  className,
  isEnrolled,
  instructorId,
}: Props) {
  const [instructor, setInstructor] = useState<Profile | null>(null);
  const supabase = createClientComponentClient();
  const [currentUser, setCurrentUser] = useState<CurrentUser>();

  useEffect(() => {
    const fetchInstructors = async () => {
      const { data: instructors } = await supabase
        .from("profile")
        .select()
        .eq("id", instructorId);

      const instructor: Profile | null = instructors ? instructors[0] : null;
      setInstructor(instructor);
    };

    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };

    fetchCurrentUser();
    fetchInstructors();
  }, [supabase, instructorId]);

  return (
    <button
      className={cn(
        "card card-side shadow-md bg-secondary h-40 w-1/3 max-w-sm",
        className
      )}
      onClick={() => showInfo && showInfo(id)}
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
        <h4 className="invert-[.3] text-left">{code}</h4>
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
          <>
            {isEnrolled ? (
              <p className="text-sm text-gray-600 text-left">Enrolled</p>
            ) : (
              <form action={enrollToClass} className="w-20">
                <input value={id} name="class_id" className="hidden" />

                <Button
                  type="submit"
                  title="Enroll"
                  className="h-7 bg-primary text-xs rounded-md"
                />
              </form>
            )}
          </>
        ) : null}
      </div>
    </button>
  );
}
