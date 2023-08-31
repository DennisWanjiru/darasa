"use client";

import { cn, notify } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Cancel from "@/assets/cancel.svg";
import ImageUploader from "../ImageUploader";
import { SubmitHandler, useForm } from "react-hook-form";
import { Database } from "@/lib/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../form/InputField";
import TextAreaField from "../form/TextAreaField";
import Button from "../Button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category, CurrentUser } from "@/lib/types";

import DatePickerField from "../form/DatePickerField";
import { useRouter } from "next/navigation";

type FormData = Database["public"]["Tables"]["class"]["Row"];
type Props = {
  isOpen: boolean;
  closeModal: () => void;
  categories: Category[];
  currentUser: CurrentUser;
};

const schema = z.object({
  thumbnail: z.string().optional(),
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
  description: z.string().optional(),
});

export default function CreateClassModal({
  isOpen,
  categories,
  closeModal,
  currentUser,
}: Props) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      instructor_id: currentUser.id,
    },
  });
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // @ts-ignore
      window.add_class.showModal();
    } else {
      // @ts-ignore
      window.add_class.close();
    }
  }, [isOpen]);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const { data: classData, error } = await supabase
      .from("class")
      .insert({
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
    <dialog
      id="add_class"
      className={cn("modal justify-end align-bottom", {
        "visible opacity-100": isOpen,
      })}
    >
      <form
        method="dialog"
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box h-full border-b-raius rounded-e-none rounded-es-none rounded-tr-xl rounded-tl-xl bg-secondary text-primary w-[369px] mr-3 mt-7 max-h-screen"
      >
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => closeModal()}
            className="btn bg-transparent hover:bg-transparent border-none"
          >
            <Image src={Cancel} alt="Close" />
          </button>
          <h3 className="font-bold text-lg ml-10">Add a Class</h3>
        </div>

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
          setStartDate={(date) => {
            setValue("start_date", date.toISOString());
          }}
        />

        <DatePickerField
          label="End Date"
          name="end_date"
          setStartDate={(date) => {
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
    </dialog>
  );
}
