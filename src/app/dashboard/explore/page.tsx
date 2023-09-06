"use client";

import Link from "next/link";
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
  name: string;
  class: ClassType[];
};

export default function Index() {
  const supabase = createClientComponentClient();
  const [currentUser, setCurrentUser] = useState<CurrentUser>();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [currentUserClasses, setCurrentUserClasses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("category").select(`name, class(*)`);
      const categories = data as { name: string; class: ClassType[] }[] | null;
      setCategories(categories);
    };

    const fetchEnrollments = async () => {
      const { data: enrollments } = await supabase
        .from("enrollment")
        .select(`id, class(id)`)
        .eq("student_id", currentUser?.id ?? "");

      const currentUserClasses = enrollments
        ? // @ts-ignore
          (enrollments.map((enrollment) => enrollment.class?.id) as string[])
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

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="font-bold text-2xl">Explore All Classes</h2>

      {categories
        ? categories?.map(({ name, class: classes }) => (
            <div key={name}>
              {classes.length ? (
                <section className="mt-10">
                  <div className="flex justify-between items-center">
                    <h3 className=" font-semibold text-base">{name}</h3>
                    {classes.length > 3 ? (
                      <Link href="#" className="text-blue-800">
                        See More
                      </Link>
                    ) : null}
                  </div>
                  <div className="flex space-x-6">
                    {classes
                      ? classes
                          .slice(0, 3)
                          .map((data) => (
                            <>
                              {getStatus(data.start_date, data.end_date) !==
                              "Completed" ? (
                                <ClassCard
                                  id={data.id}
                                  key={data.id}
                                  code={data.code}
                                  name={data.name}
                                  showInfo={(id) => setSelected(id)}
                                  type="enroll"
                                  isEnrolled={currentUserClasses.includes(
                                    data.id
                                  )}
                                  thumbnail={
                                    data.thumbnail
                                      ? createAvatarUrl(data.thumbnail)
                                      : noImage
                                  }
                                  instructorId={data.instructor_id}
                                  className="mt-6"
                                />
                              ) : null}
                            </>
                          ))
                      : null}
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
          enroll={!currentUserClasses.includes(selected)}
        />
      ) : null}
    </div>
  );
}
