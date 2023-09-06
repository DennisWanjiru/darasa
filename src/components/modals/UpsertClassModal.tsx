"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import InputField from "../form/InputField";
import { notify } from "@/lib/utils";
import ImageUploader from "../ImageUploader";
import { Database } from "@/lib/schema";
import TextAreaField from "../form/TextAreaField";
import Button from "../Button";
import { Category, ClassType, CurrentUser } from "@/lib/types";
import DatePickerField from "../form/DatePickerField";
import { useRouter, useSearchParams } from "next/navigation";
import Dialog from ".";

type FormData = Database["public"]["Tables"]["class"]["Row"];
type Props = {
  isOpen: boolean;
  closeModal: () => void;
  categories: Category[];
  classData?: ClassType;
  currentUser: CurrentUser;
};

const schema = z.object({
  id: z.string().optional(),
  thumbnail: z.string().optional(),
  code: z
    .string()
    .nonempty("Class code is required")
    .min(6, "Code should be exactly 6 letters e.g. AB-123")
    .max(6, "Code should be exactly 6 letters e.g. AB-123"),
  name: z
    .string()
    .nonempty("Name is required")
    .min(2, "Name should be at least 2 letters"),
  category_id: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  instructor_id: z.string(),
  description: z.string().optional(),
});

export default function UpsertClassModal({
  isOpen,
  categories,
  closeModal,
  currentUser,
  classData,
}: Props) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    handleSubmit,
    register,
    setValue,
    setError,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      instructor_id: currentUser.id,
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
    },
  });

  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    if (classData) {
      setValue("id", classData.id);
      setValue("code", classData.code);
      setValue("name", classData.name);
      setValue("category_id", classData.category_id);
      setValue("start_date", classData.start_date);
      setValue("end_date", classData.end_date);
      setValue("description", classData.description);
      setThumbnailUrl(classData.thumbnail);
    }
  }, [classData, setValue]);

  const handleClose = () => {
    reset();
    setThumbnailUrl(null);
    closeModal();
  };

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const { data, error } = await supabase
      .from("class")
      .upsert({
        ...formData,
      })
      .select();

    if (error) {
      if (error.code === "23505") {
        setError("code", {
          type: "custom",
          message: "Class code already taken",
        });
      } else {
        notify("Something went wrong!", "error");
      }
    } else {
      handleClose();
      router.refresh();
      notify("The class was saved!");
    }
  };

  const options = categories.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      aside
      closeModal={handleClose}
      title={id ? "Edit Class" : "Create Class"}
    >
      <form method="dialog" onSubmit={handleSubmit(onSubmit)}>
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
          disabled={
            classData?.start_date
              ? new Date(classData.start_date) < new Date()
              : false
          }
          defaultDate={new Date(classData?.start_date ?? Date.now())}
          setDate={(date) => {
            setValue("start_date", date.toISOString());
          }}
        />
        {errors.start_date?.message ? (
          <span className="text-red-700">{errors.start_date.message}</span>
        ) : null}

        <DatePickerField
          label="End Date"
          name="end_date"
          defaultDate={new Date(classData?.end_date ?? Date.now())}
          setDate={(date) => {
            setValue("end_date", date.toISOString());
          }}
          disabled={
            classData?.end_date
              ? new Date(classData.end_date) < new Date()
              : false
          }
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
    </Dialog>
  );
}
