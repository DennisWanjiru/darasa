"use client";

import { notify } from "@/lib/utils";
import InputField from "../form/InputField";
import { SubmitHandler, useForm } from "react-hook-form";
import { CurrentUser, Major } from "@/lib/types";
import { Database } from "@/lib/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextAreaField from "../form/TextAreaField";
import Button from "../Button";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ImageUploader from "../ImageUploader";
import { prefixes } from "@/lib/contants";
import { getCurrentUser } from "@/lib/actions";
import Dialog from ".";

type Props = {
  user: CurrentUser;
  onClose: () => void;
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
  role_id: z.string(),
  email: z.string().email(),
  bio: z.string().optional(),
});

export default function ProfileModal({ user, onClose }: Props) {
  const { id, avatar_url, email, name, major_id, bio, prefix, role_id } = user;
  const supabase = createClientComponentClient();
  const [majors, setMajors] = useState<Options>();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(avatar_url);

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
      major_id: major_id ?? "",
      prefix: prefix ?? "",
      avatar_url: avatar_url ?? null,
      role_id,
    },
  });

  useEffect(() => {
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

    getMajors();
  }, [major_id, supabase]);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const user = await getCurrentUser();

    if (user) {
      const { data, error } = await supabase
        .from("profile")
        .upsert(
          user.role === "student"
            ? { ...formData, id, prefix: null }
            : { ...formData, id, major_id: null }
        )
        .select();

      if (error) {
        notify("Something went wrong!", "error");
      } else {
        notify("Profile has been updated!");
        onClose();
        // TODO: Find a better solution for improved UX behavior
        document.location.reload();
      }
    }
  };

  return (
    <Dialog title="Edit Profile" closeModal={onClose} aside>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="flex mt-20 justify-center w-full">
          <div className="justify-center flex">
            <ImageUploader
              uid={id}
              url={avatarUrl}
              onUpload={(url) => {
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
            icon
            type="submit"
            isSubmitting={isSubmitting}
            className="mt-14"
            title="Update Profile"
          />
        </section>
      </form>
    </Dialog>
  );
}
