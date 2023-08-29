"use client";

import InputField from "../form/InputField";
import { SubmitHandler, useForm } from "react-hook-form";
import { Database } from "@/lib/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Avatar from "../Avatar";
import Button from "../Button";
import { GradeData } from "@/lib/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Dialog from ".";

type Props = {
  data: GradeData;
  closeModal: () => void;
};
type FormData = Database["public"]["Tables"]["grade"]["Row"];

const schema = z.object({
  grade: z.string(),
  class_id: z.string(),
  student_id: z.string(),
  id: z.string().optional(),
});

export default function AddGradeModal({ data, closeModal }: Props) {
  const { id, class_id, student_id, name, email, major, grade, avatar_url } =
    data;
  const supabase = createClientComponentClient();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id,
      grade: Number(grade),
      class_id,
      student_id,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const { data: classData, error } = await supabase
        .from("grade")
        .upsert({
          ...formData,
        })
        .eq("id", id)
        .select();

      if (error) {
        throw error;
        // TODO: Unique code error
      } else {
        closeModal();
        // TODO: Show success alert
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Dialog title="Add Grade" closeModal={closeModal}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col px-32 py-20"
      >
        <div className="flex flex-col justify-center items-center">
          <Avatar url={avatar_url} name={name} size="lg" variant="square" />
          <h5 className="text-base font-semibold mt-4">{name}</h5>
          <p className="text-xs text-gray-600">{email}</p>
          <p className="text-sm">{major}</p>
        </div>

        <InputField
          label="Total Marks"
          name="grade"
          type="number"
          register={register}
          className="mt-24"
          autoFocus
          error={errors.grade?.message}
        />
        <Button
          title={isSubmitting ? "Saving Grade..." : "Save Grade"}
          icon
          className="mt-2"
        />
      </form>
    </Dialog>
  );
}
