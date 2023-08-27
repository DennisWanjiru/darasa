"use client";

import Cancel from "@/assets/cancel.svg";
import { getUserFirstLetter } from "@/lib/utils";
import Image from "next/image";
import InputField from "./form/InputField";
import { SubmitHandler, useForm } from "react-hook-form";
import { CurrentUser, Major } from "@/lib/types";
import { Database } from "@/lib/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextAreaField from "./form/TextAreaField";
import Button from "./Button";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Avatar from "./Avatar";

type Props = {
  user: CurrentUser;
};

type Options = {
  value: string;
  label: string;
}[];

type FormData = Database["public"]["Tables"]["profile"]["Row"];

const schema = z.object({
  avatar_url: z.string().optional(),
  prefix: z.string().optional(),
  name: z
    .string()
    .nonempty("Name is required")
    .min(2, "Name should be at least 2 letters"),
  major_id: z.string().optional(),
  email: z.string().email(),
  bio: z.string().optional(),
});

export default function ProfileModal({ user }: Props) {
  const { id, avatar_url, email, name, major_id, bio, prefix } = user;
  const supabase = createClientComponentClient();
  const [majors, setMajors] = useState<Options>();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email,
      name,
      bio,
      major_id,
      prefix,
    },
  });

  const getMajors = async () => {
    const res = await supabase.from("major").select("*").eq("id", major_id);
    const majors = res.data as Major[] | null;

    if (majors) {
      const options = majors.map(({ id, name }) => ({
        value: id,
        label: name,
      }));

      setMajors(options);
    }
  };

  useEffect(() => {
    getMajors();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const { data: user, error } = await supabase
        .from("profile")
        .update(formData)
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      } else {
        console.log({ user });
        // TODO: Close modal and refetch data
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const avatar = user?.avatar_url
    ? `${process.env.NEXT_PUBLIC_STORAGE_BUCKET_URL}/avatars/${user.avatar_url}`
    : null;

  const prefixes = [
    { label: "Prof", value: "Prof" },
    { label: "Dr", value: "Dr" },
    { label: "PhD", value: "PhD" },
    { label: "Mr", value: "Mr" },
    { label: "Mrs", value: "Mrs" },
  ];

  return (
    <dialog id="profile" className="modal justify-end align-bottom">
      <form
        method="dialog"
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box h-screen max-h-[calc(100vh)] border-b-raius rounded-e-none rounded-es-none rounded-tr-xl rounded-tl-xl bg-secondary text-primary w-[369px] mr-3 mt-4"
      >
        <div className="flex items-center">
          <button
            type="button"
            className="btn bg-transparent hover:bg-transparent border-none"
          >
            <Image src={Cancel} alt="Close" />
          </button>
          <h3 className="font-bold text-lg ml-10">Edit Profile</h3>
        </div>

        <section className="flex mt-20 justify-center w-full">
          <div className="justify-center flex">
            <Avatar
              uid={"user.id"}
              url={avatar}
              onUpload={(url) => {
                console.log({ url });
                setAvatarUrl(url);
                setValue("avatar_url", url);
              }}
            />
          </div>
        </section>

        <section className=" mt-14">
          {user.role === "instructor" ? (
            <InputField
              label="Prefix"
              name="prefix"
              type="select"
              options={prefixes}
              register={register}
            />
          ) : null}

          <InputField
            label="Name"
            name="name"
            error={errors.name?.message}
            register={register}
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            error={errors.email?.message}
            register={register}
            disabled
          />

          {user.role === "student" ? (
            <InputField
              label="Major"
              name="major_id"
              type="select"
              options={majors}
              register={register}
              disabled
            />
          ) : null}

          <TextAreaField
            label="Bio"
            name="bio"
            error={errors.bio?.message}
            register={register}
            rows={10}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-14"
            icon
            title={isSubmitting ? "Updating Profile..." : "Update Profile"}
          />
        </section>
      </form>
    </dialog>
  );
}
