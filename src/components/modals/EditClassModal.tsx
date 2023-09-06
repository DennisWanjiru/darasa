"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";

import { Category, ClassType, CurrentUser } from "@/lib/types";
import UpsertClassModal from "./UpsertClassModal";

type Props = {
  currentUser: CurrentUser;
};

export default function EditClassModal({ currentUser }: Props) {
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
      {id && classData ? (
        <UpsertClassModal
          isOpen
          classData={classData}
          categories={categories}
          currentUser={currentUser}
          closeModal={handleCLoseModal}
        />
      ) : null}
    </>
  );
}
