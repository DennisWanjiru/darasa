"use client";

import { notify } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import ImageUploader from "../ImageUploader";
import { SubmitHandler, useForm } from "react-hook-form";
import { Database } from "@/lib/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../form/InputField";
import TextAreaField from "../form/TextAreaField";
import Button from "../Button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category, ClassType } from "@/lib/types";

import DatePickerField from "../form/DatePickerField";
import { useRouter } from "next/navigation";

type FormData = Database["public"]["Tables"]["class"]["Row"];

const schema = z.object({
  id: z.string().optional(),
  code: z
    .string()
    .nonempty("Class code is required")
    .min(4, "Name should be at least 2 letters"),
  name: z
    .string()
    .nonempty("Name is required")
    .min(2, "Name should be at least 2 letters"),
  category_id: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  instructor_id: z.string(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});

type Props = {
  data: ClassType;
  closeModal: () => void;
  categories: Category[];
};

export default function ClassForm({ data, categories, closeModal }: Props) {
  const {
    id,
    code,
    thumbnail,
    name,
    category_id,
    description,
    start_date,
    end_date,
    instructor_id,
  } = data;
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(thumbnail);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    setValue,
    control,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id,
      code,
      thumbnail: thumbnail ?? "",
      name,
      category_id,
      description,
      start_date,
      end_date,
      instructor_id,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const { data: classData, error } = await supabase
      .from("class")
      .upsert({
        ...formData,
      })
      .select();

    if (error) {
      // TODO: Unique code error
      notify("Something went wrong!", "error");
    } else {
      reset();
      closeModal();
      router.refresh();
      notify("The class was created!");
    }
  };

  const options = categories.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className="flex mt-20 justify-center w-full">
        <div className="justify-center flex">
          <ImageUploader
            uid="thumbnail"
            url={thumbnailUrl}
            onUpload={(url) => {
              setThumbnailUrl(url);
              setValue("thumbnail", url);
            }}
          />
        </div>
      </section>

      <InputField
        label="Name"
        name="name"
        error={errors.name?.message}
        register={register}
      />

      <InputField
        label="Code"
        name="code"
        error={errors.code?.message}
        register={register}
      />

      <InputField
        label="Category"
        name="category_id"
        type="select"
        options={options}
        register={register}
      />

      <DatePickerField
        label="Start Date"
        name="start_date"
        defaultDate={new Date(start_date)}
        setDate={(date) => {
          console.log({ date });
          setValue("start_date", date.toISOString());
        }}
      />

      <DatePickerField
        label="End Date"
        name="end_date"
        defaultDate={new Date(end_date)}
        setDate={(date) => {
          setValue("end_date", date.toISOString());
        }}
      />

      <TextAreaField
        label="Description"
        name="description"
        error={errors.description?.message}
        register={register}
        rows={10}
      />

      <Button
        icon
        type="submit"
        isSubmitting={isSubmitting}
        title="Save Class"
      />
    </form>
  );
}
