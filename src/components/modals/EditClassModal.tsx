"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category, ClassType } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";

import Dialog from ".";
import ClassForm from "../form/ClassForm";

export default function EditClassModal() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [classData, setClassData] = useState<ClassType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchClassData = async () => {
      const { data, error } = await supabase
        .from("class")
        .select()
        .match({ id })
        .single();

      const classData: ClassType = data;
      setClassData(classData);
    };

    const fetchCategories = async () => {
      const { data } = await supabase.from("category").select();
      const categories: Category[] = data ?? [];
      setCategories(categories);
    };

    fetchClassData();
    fetchCategories();
  }, [id, supabase]);

  const handleCLoseModal = () => {
    router.back();
  };

  return (
    <>
      {id ? (
        <Dialog
          title={classData?.code ?? ""}
          closeModal={handleCLoseModal}
          aside
        >
          {classData ? (
            <ClassForm
              categories={categories}
              data={classData}
              closeModal={handleCLoseModal}
            />
          ) : null}
        </Dialog>
      ) : null}
    </>
  );
}
