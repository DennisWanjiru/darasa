"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/form/InputField";
import Button from "@/components/Button";
import TextAreaField from "@/components/form/TextAreaField";
import ImageUploader from "@/components/ImageUploader";
import { Database } from "@/lib/schema";
import { Major, Role } from "@/lib/types";
import { Session } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import RadioInputField from "@/components/form/RadioInputField";
import { prefixes } from "@/lib/contants";
import { notify } from "@/lib/utils";

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
  role_id: z.string().optional(),
  major_id: z.string().optional(),
  email: z.string().email(),
  bio: z.string().optional(),
});

const AccountForm = ({ majors, roles, session }: Props) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [checkedRole, setCheckedRole] = useState("");

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting, isValidating },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: session.user.email,
      role_id: roles[1]?.id ?? "",
    },
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const val = getValues("role_id");
    const role: Role = roles.filter((role) => role.id === val)[0];
    setCheckedRole(role?.name ?? "");
  }, [watch("role_id")]);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const { error } = await supabase
      .from("profile")
      .insert(
        checkedRole === "student"
          ? { ...formData, prefix: null }
          : { ...formData, major_id: null }
      )
      .select();

    if (error) {
      notify("Something went wrong!", "error");
    } else {
      notify("Welcome! Your profile was created.");
      router.push("/dashboard");
    }
  };

  const options = majors.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

  const roleOptions = roles.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-4 w-full md:w-1/3 mt-10"
    >
      <div className="justify-center flex mb-8">
        <ImageUploader
          uid={"user.id"}
          url={avatarUrl}
          onUpload={(url) => {
            setAvatarUrl(url);
            setValue("avatar_url", url);
          }}
        />
      </div>

      <div className="flex space-x-10 items-center">
        {roles.map(({ id, name }) => (
          <RadioInputField
            key={id}
            name="role_id"
            label={name}
            value={id}
            register={register}
          />
        ))}
      </div>

      {checkedRole === "instructor" ? (
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
        autoFocus
      />

      <InputField
        label="Email"
        name="email"
        type="email"
        error={errors.email?.message}
        register={register}
        disabled
      />

      {checkedRole === "student" ? (
        <InputField
          label="Major"
          name="major_id"
          type="select"
          options={options}
          register={register}
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
        isSubmitting={isSubmitting}
        title="Create Profile"
      />
    </form>
  );
};

export default AccountForm;
