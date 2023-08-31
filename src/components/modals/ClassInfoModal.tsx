"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { ClassType } from "@/lib/types";
import Supa from "@/assets/supaman.jpeg";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { format } from "date-fns";
import Button from "../Button";
import Dialog from ".";
import Loader from "../Loader";
import { getCurrentUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/utils";

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
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        setIsLoading(true);
        const { data: classes } = await supabase
          .from("class")
          .select(`*, category(name), profile(name, avatar_url)`)
          .eq("id", id);

        const classData = classes ? (classes[0] as Data) : null;
        setData(classData);
      } catch (error) {
        console.log({ error });
      } finally {
        setIsLoading(false);
      }
    };

    if (selected) {
      dialogRef?.current?.showModal();
      fetchData(selected);
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
        router.refresh();
        onClose();
        notify("You have enrolled to " + code);
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
                    : Supa
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
            <section className="mt-10">
              <h4 className="mb-3 font-semibold">Description</h4>
              <p className="text-gray-600 text-sm">{description}</p>
            </section>
          ) : null}

          <section className="mt-3 ">
            <div className="flex items-center space-x-3">
              <Image
                className="rounded-full h-10 w-10"
                height={40}
                width={40}
                alt="instructor_avatar"
                src={
                  profile.avatar_url
                    ? `${process.env.NEXT_PUBLIC_STORAGE_BUCKET_URL}/avatars/${profile.avatar_url}`
                    : Supa
                }
              />
              <p>
                Instructor:{" "}
                <span className=" text-blue-800">{profile.name}</span>
              </p>
            </div>

            <p className="text-xs mt-1.5 text-gray-500">
              Starts on {format(new Date(start_date), "MMMM dd")}
            </p>

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
