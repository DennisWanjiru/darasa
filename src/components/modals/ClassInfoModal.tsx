"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Cancel from "@/assets/cancel.svg";
import { ClassType } from "@/lib/types";
import Supa from "@/assets/supaman.jpeg";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { format } from "date-fns";
import Button from "../Button";

type Data = ClassType & {
  category: { name: string };
  profile: { name: string; avatar_url: string | null };
};

export default function ClassInfoModal() {
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const classId = searchParams.get("classId");
  const [data, setData] = useState<Data | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const fetchData = async (id: string) => {
    try {
      const { data: classes } = await supabase
        .from("class")
        .select(`*, category(name), profile(name, avatar_url)`)
        .eq("id", classId);

      const classData = classes ? (classes[0] as Data) : null;
      setData(classData);
    } catch (error) {}
  };

  useEffect(() => {
    if (classId) {
      dialogRef?.current?.showModal();
      fetchData(classId);
    } else {
      dialogRef?.current?.close();
    }
  }, [classId]);

  if (!data) {
    return <p>Loading,,,,</p>;
  }

  const { code, thumbnail, name, category, description, profile, start_date } =
    data;

  return (
    <dialog
      ref={dialogRef}
      id="class-info"
      className="modal justify-end align-bottom"
    >
      <div className="modal-box h-screen max-h-[calc(100vh)] border-b-raius rounded-e-none rounded-es-none rounded-tr-xl rounded-tl-xl bg-secondary text-primary w-[369px] mr-3 mt-4">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => {
              console.log("first");
            }}
            className="btn bg-transparent hover:bg-transparent border-none"
          >
            <Image src={Cancel} alt="Close" />
          </button>
          <h3 className="font-bold text-lg ml-10">{code}</h3>
        </div>

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
              Instructor: <span className=" text-blue-800">{profile.name}</span>
            </p>
          </div>
          <p className="text-sm mt-1.5 text-gray-500">
            Starts on {format(new Date(start_date), "MMMM dd")}
          </p>

          <Button title="Enroll Now" className="mt-8" />
        </section>
      </div>
    </dialog>
  );
}
