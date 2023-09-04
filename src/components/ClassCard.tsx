"use client";

import { cn, notify } from "@/lib/utils";
import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Button from "./Button";
import { getCurrentUser } from "@/lib/actions";
import { useEffect, useState } from "react";
import { CurrentUser, Profile } from "@/lib/types";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleEnrollToClass = async () => {
    const currentUser = await getCurrentUser();

    if (currentUser) {
      setIsSubmitting(true);

      const { error } = await supabase
        .from("enrollment")
        .insert({ student_id: currentUser.id, class_id: id })
        .select();

      setIsSubmitting(false);

      if (error) {
        notify("Something went wrong!", "error");
      } else {
        router.replace("/dashboard/explore");
        notify("You have enrolled to " + code);
      }
    }
  };

  return (
    <div
      className={cn(
        "card card-side shadow-md bg-secondary h-40 w-1/3 max-w-sm cursor-pointer",
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
        className={cn("card-body justify-center text-left", {
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
              <p className="text-sm text-gray-600">Enrolled</p>
            ) : (
              <Button
                type="submit"
                title="Enroll"
                isSubmitting={isSubmitting}
                className="h-7 bg-primary text-xs rounded-md w-20"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  handleEnrollToClass();
                }}
              />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
