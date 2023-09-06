"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { ClassType } from "@/lib/types";
import noImage from "@/assets/noImage.jpg";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { format } from "date-fns";
import Button from "../Button";
import Dialog from ".";
import Loader from "../Loader";
import { getCurrentUser } from "@/lib/actions";
import { notify } from "@/lib/utils";
import Avatar from "../Avatar";

type Data = ClassType & {
  category: { name: string };
  profile: { name: string; avatar_url: string | null };
};

type Props = {
  enroll: boolean;
  selected: string;
  onClose: () => void;
};

export default function ClassInfoModal({ onClose, selected, enroll }: Props) {
  const supabase = createClientComponentClient();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentsCount, setStudentsCount] = useState(0);

  useEffect(() => {
    const fetchData = async (id: string) => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("class")
        .select(`*, category(name), profile(name, avatar_url)`)
        .match({ id })
        .single();

      setIsLoading(false);

      if (error) {
        notify("Something went wrong!", "error");
      } else {
        const classData: Data = data ?? null;
        setData(classData);
      }
    };

    const fetchEnrollments = async (class_id: string) => {
      const { data } = await supabase
        .from("enrollment")
        .select("count")
        .match({ class_id })
        .single();

      setStudentsCount(data?.count ?? 0);
    };

    if (selected) {
      dialogRef?.current?.showModal();
      fetchData(selected);
      fetchEnrollments(selected);
    } else {
      dialogRef?.current?.close();
    }
  }, [selected, supabase]);

  if (!data) {
    return null;
  }

  const {
    id,
    code,
    thumbnail,
    name,
    category,
    description,
    profile,
    start_date,
  } = data;

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
        onClose();
        notify("You have enrolled to " + code);
        // TODO: Find a better solution for improved UX behavior
        document.location.reload();
      }
    }
  };

  const handleUnEnroll = async () => {
    const currentUser = await getCurrentUser();

    if (currentUser) {
      setIsSubmitting(true);

      const { error } = await supabase
        .from("enrollment")
        .delete()
        .match({ class_id: id, student_id: currentUser.id });

      setIsSubmitting(false);

      if (error) {
        notify("Something went wrong!", "error");
      } else {
        notify("You have unenrolled from " + code);
        onClose();
        // TODO: Find a better solution for improved UX behavior
        document.location.reload();
      }
    }
  };

  return (
    <Dialog title={code} closeModal={onClose} aside>
      {!isLoading ? (
        <>
          <section className="flex mt-20 justify-center w-full">
            <div className="justify-center items-center flex flex-col">
              <Image
                src={
                  thumbnail
                    ? `${process.env.NEXT_PUBLIC_STORAGE_BUCKET_URL}/avatars/${thumbnail}`
                    : noImage
                }
                alt="class_image"
                width={112}
                height={112}
                className="h-28 w-28 rounded-[20px] object-cover"
              />
              <h2 className="mt-4 text-lg font-semibold">{name}</h2>
              <p className="text-sm mt-1.5 text-gray-500">{category.name}</p>
              <p className="text-gray-500">{code}</p>
            </div>
          </section>

          {description ? (
            <section className="mt-10 max-h-[55%] overflow-scroll scroll-m-4">
              <h4 className="mb-3 font-semibold">Description</h4>
              <p className="text-gray-600 text-sm">{description}</p>
            </section>
          ) : null}

          <section className="mt-3">
            <div className="flex items-center space-x-3">
              <Avatar
                name={profile.name}
                url={profile.avatar_url ?? undefined}
                variant="circle"
              />

              <p>
                Instructor:{" "}
                <span className=" text-blue-800">{profile.name}</span>
              </p>
            </div>

            <p className="text-xs mt-1.5 text-gray-500">
              Starts on {format(new Date(start_date), "MMMM dd")}
            </p>

            {studentsCount ? (
              <div className="flex items-center mt-1">
                <p className="font-bold mr-1">{studentsCount}</p>
                <span className="font-normal text-sm">already enrolled</span>
              </div>
            ) : (
              <p className="mt-1 text-xs text-gray-600">
                Be the first to enroll
              </p>
            )}

            {enroll ? (
              <Button
                title="Enroll Now"
                className="mt-8"
                onClick={handleEnrollToClass}
                isSubmitting={isSubmitting}
              />
            ) : (
              <Button
                title="Unenroll"
                className="mt-8"
                variant="inverse"
                onClick={handleUnEnroll}
                isSubmitting={isSubmitting}
              />
            )}
          </section>
        </>
      ) : (
        <Loader />
      )}
    </Dialog>
  );
}
