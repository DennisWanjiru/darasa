"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/form/InputField";
import Button from "@/components/Button";
import TextAreaField from "@/components/form/TextAreaField";
import Avatar from "@/components/Avatar";
import { Database } from "@/lib/schema";
import { Major, Role } from "@/lib/types";
import { Session } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type FormData = Database["public"]["Tables"]["profile"]["Row"];
type Props = {
  roles: Role[];
  majors: Major[];
  session: Session;
};

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

const AccountForm = ({ majors, roles, session }: Props) => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: session.user.email,
    },
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const { data: user, error } = await supabase
        .from("profile")
        .insert({
          ...formData,
          role_id: roles[1]?.id ?? "f4233bf9-f115-4e4d-b8b0-7ecf27ccbdd3",
        })
        .select();

      if (error) {
        throw error;
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const options = majors.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-4 w-full md:w-1/3 mt-10"
    >
      <div className="justify-center flex">
        <Avatar
          uid={"user.id"}
          url={avatarUrl}
          onUpload={(url) => {
            setAvatarUrl(url);
            setValue("avatar_url", url);
          }}
        />
      </div>

      <InputField
        label="Prefix"
        name="prefix"
        error={errors.prefix?.message}
        register={register}
      />

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
      />

      <InputField
        label="Major"
        name="major_id"
        type="select"
        options={options}
        register={register}
      />

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
        title={isSubmitting ? "Creating Profile..." : "Create Profile"}
      />
    </form>
  );
};

export default AccountForm;
