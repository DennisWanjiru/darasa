import getCurrentUser from "@/actions/getCurrentUser";
import ClassCard from "@/components/ClassCard";
import { Class } from "@/lib/types";
import { createAvatarUrl } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Supa from "@/assets/supaman.jpeg";
import Link from "next/link";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });
  const currentUser = await getCurrentUser();

  const { data } = await supabase
    .from("category")
    .select(`name, class(id, code, name, thumbnail, instructor_id)`);

  const categories = data as { name: string; class: Class[] }[] | null;

  const { data: enrollments } = await supabase
    .from("enrollment")
    .select(`id, class(id)`)
    .eq("student_id", currentUser?.id ?? "");

  const currentUserClasses = enrollments
    ? // @ts-ignore
      (enrollments.map((enrollment) => enrollment.class?.id) as string[])
    : [];

  return (
    <div>
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
                          .slice(0, 2)
                          .map(
                            ({ id, code, name, thumbnail, instructor_id }) => (
                              <ClassCard
                                key={id}
                                code={code}
                                name={name}
                                type={
                                  !currentUserClasses.includes(id)
                                    ? "enroll"
                                    : undefined
                                }
                                thumbnail={
                                  thumbnail ? createAvatarUrl(thumbnail) : Supa
                                }
                                instructorId={instructor_id}
                                className="mt-6"
                              />
                            )
                          )
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
