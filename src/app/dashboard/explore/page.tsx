import { getCurrentUser } from "@/lib/actions";
import ClassCard from "@/components/ClassCard";
import { ClassType } from "@/lib/types";
import { createAvatarUrl } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Supa from "@/assets/supaman.jpeg";
import Link from "next/link";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });
  const currentUser = await getCurrentUser();

  const { data } = await supabase.from("category").select(`name, class(*)`);

  const categories = data as { name: string; class: ClassType[] }[] | null;

  const { data: enrollments } = await supabase
    .from("enrollment")
    .select(`id, class(id)`)
    .eq("student_id", currentUser?.id ?? "");

  const currentUserClasses = enrollments
    ? // @ts-ignore
      (enrollments.map((enrollment) => enrollment.class?.id) as string[])
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="font-bold text-2xl">Explore All Classes</h2>

      {categories
        ? categories?.map(({ name, class: classes }) => (
            <>
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
                            <ClassCard
                              id={data.id}
                              key={data.id}
                              code={data.code}
                              name={name}
                              type={
                                !currentUserClasses.includes(data.id)
                                  ? "enroll"
                                  : undefined
                              }
                              thumbnail={
                                data.thumbnail
                                  ? createAvatarUrl(data.thumbnail)
                                  : Supa
                              }
                              instructorId={data.instructor_id}
                              className="mt-6"
                            />
                          ))
                      : null}
                  </div>
                </section>
              ) : null}
            </>
          ))
        : null}
    </div>
  );
}
