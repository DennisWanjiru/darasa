import Heart from "@/assets/heart.svg";
import Plus from "@/assets/plus.svg";
import Briefcase from "@/assets/briefcase.svg";
import OverviewCard from "@/components/OverviewCard";
import Supa from "@/assets/supaman.jpeg";
import ClassCard from "@/components/ClassCard";
import ClassTable from "@/components/ClassTable";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Class } from "@/lib/types";
import { createAvatarUrl } from "@/lib/utils";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const studentId = session?.user.id;

  const { data: enrollments } = await supabase
    .from("enrollment")
    .select(`id, class(*)`)
    .eq("student_id", studentId ?? "");

  const classes = enrollments?.map((enrollment) => enrollment.class) as
    | Class[]
    | undefined;

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="font-bold text-2xl">Good morning, Dennis</h2>

      <section className="flex justify-between items-center space-x-9 mt-11">
        <OverviewCard
          title={String(classes?.length ?? 0)}
          subTitle="Enrolled Classes"
          Icon={Heart}
        />
        <OverviewCard title="B+" subTitle="Average Grade" Icon={Plus} />
        <OverviewCard title="3.5" subTitle="GPA" Icon={Briefcase} />
      </section>

      <section className="mt-10">
        <h3 className="font-semibold text-lg">Today&apos;s Classes</h3>

        <div className="flex space-x-9 mt-4">
          {classes
            ? classes.map(({ id, code, name, thumbnail, instructor_id }) => (
                <ClassCard
                  key={id}
                  code={code}
                  name={name}
                  thumbnail={thumbnail ? createAvatarUrl(thumbnail) : Supa}
                  instructorId={instructor_id}
                />
              ))
            : null}
        </div>
      </section>

      <section className="mt-10 p-7 bg-secondary rounded-2xl shadow-md">
        <h3 className="font-semibold text-lg">My Classes</h3>
        {classes && classes.length ? (
          <ClassTable classes={classes} />
        ) : (
          <div className="flex h-96 items-center justify-center">
            <p className="font-medium text-lg text-gray-700">
              No Classes Found
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
