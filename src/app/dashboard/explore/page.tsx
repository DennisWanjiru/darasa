"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { getCurrentUser } from "@/lib/actions";
import ClassCard from "@/components/ClassCard";
import type { ClassType, CurrentUser } from "@/lib/types";
import { createAvatarUrl, getStatus } from "@/lib/utils";
import noImage from "@/assets/noImage.jpg";
import ClassInfoModal from "@/components/modals/ClassInfoModal";
import Loader from "@/components/Loader";

type Category = {
  id: string;
  name: string;
  class: ClassType[];
};

export default function Index() {
  const supabase = createClientComponentClient();
  const [currentUser, setCurrentUser] = useState<CurrentUser>();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [currentUserClasses, setCurrentUserClasses] = useState<
    Record<string, boolean>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("category")
        .select(`id, name, class(*)`);

      const categories: Category[] | null = data;
      setCategories(categories);
    };

    const fetchEnrollments = async () => {
      const { data: enrollments } = await supabase
        .from("enrollment")
        .select(`id, class(id)`)
        .eq("student_id", currentUser?.id ?? "");

      let currentUserClasses: Record<string, boolean> = {};

      enrollments
        ? enrollments.forEach((enrollment) => {
            // @ts-ignore
            currentUserClasses[enrollment.class?.id] = true;
          })
        : [];

      setCurrentUserClasses(currentUserClasses);
    };

    const fetchCurrentUser = async () => {
      const currentUser = await getCurrentUser();
      setCurrentUser(currentUser);
    };

    Promise.all([fetchCurrentUser(), fetchCategories(), fetchEnrollments()])
      .catch(() => setError("Something went wrong"))
      .finally(() => setIsLoading(false));
  }, [supabase, currentUser?.id]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">{error}</div>
    );
  }

  const renderClassCards = (data: ClassType[]) => {
    const cards = data.map(
      ({ id, code, start_date, end_date, thumbnail, name, instructor_id }) => {
        const isEnrolled = !!currentUserClasses[id];

        return (
          <ClassCard
            id={id}
            key={id}
            code={code}
            name={name}
            showInfo={(id) => setSelected(id)}
            type={
              getStatus(start_date, end_date) === "Completed"
                ? "normal"
                : "enroll"
            }
            isEnrolled={isEnrolled}
            thumbnail={thumbnail ? createAvatarUrl(thumbnail) : noImage}
            instructorId={instructor_id}
            className="w-full"
          />
        );
      }
    );

    return cards;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="font-bold text-2xl">Explore All Classes</h2>

      {categories
        ? categories?.map(({ id, name, class: classes }) => (
            <div key={id}>
              {classes.length ? (
                <section className="mt-10">
                  <h3 className=" font-semibold text-xl">{name}</h3>

                  <div className="grid sm:grid-cols-3 sm:grid-flow-dense gap-6 mt-5">
                    {classes ? renderClassCards(classes) : null}
                  </div>
                </section>
              ) : null}
            </div>
          ))
        : null}

      {selected ? (
        <ClassInfoModal
          selected={selected}
          onClose={() => setSelected(null)}
          enroll={!currentUserClasses[selected]}
        />
      ) : null}
    </div>
  );
}
