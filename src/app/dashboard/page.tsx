import Heart from "@/assets/heart.svg";
import Plus from "@/assets/plus.svg";
import Briefcase from "@/assets/briefcase.svg";
import OverviewCard from "@/components/OverviewCard";
import noImage from "@/assets/noImage.jpg";
import ClassCard from "@/components/ClassCard";
import StudentClassesTable from "@/components/tables/StudentClassesTable";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ClassType } from "@/lib/types";
import {
  calculateGPA,
  calculateGrade,
  createAvatarUrl,
  getStatus,
  getTime,
} from "@/lib/utils";
import { getCurrentUser } from "@/lib/actions";
import InstructorClassesTable from "@/components/tables/InstructorClassesTable";
import EditClassModal from "@/components/modals/EditClassModal";

type OverallScore = {
  gpa: string;
  grade: string;
};

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const currentUser = await getCurrentUser();
  const role = currentUser?.role;

  const { data: enrollments } = await supabase
    .from("enrollment")
    .select(`id, class(*)`)
    .eq("student_id", currentUser?.id ?? "");

  const { data: instructorClasses } = await supabase
    .from("class")
    .select()
    .match({ instructor_id: currentUser?.id ?? "" });

  const getCount = async (id: string) => {
    const { data } = await supabase
      .from("enrollment")
      .select("count")
      .match({ class_id: id })
      .single();

    if (data) {
      const count: number = data.count;
      return count;
    }

    return 0;
  };

  const mostEnrolled = {
    count: 0,
    code: undefined,
  };

  const counts = instructorClasses?.map(async ({ id, code }) => {
    const total = await getCount(id);

    if (total > mostEnrolled.count) {
      mostEnrolled.count = total;
      mostEnrolled.code = code;
    }
    return total;
  });

  const totalStudents = (await Promise.all(counts ?? [])).reduce(
    (curr, prev) => curr + prev,
    0
  );

  const enrolledClasses = enrollments?.map((enrollment) => enrollment.class) as
    | ClassType[]
    | undefined;

  const classes: ClassType[] | null =
    role === "instructor" ? instructorClasses : enrolledClasses ?? null;

  const getAverageGrade = async () => {
    const { data: grades, error } = await supabase
      .from("grade")
      .select("grade")
      .eq("student_id", currentUser?.id ?? "");

    const averageScore = grades
      ? grades
          .map((grade) => grade.grade as number)
          .reduce((curr, prev) => curr + prev, 0) / grades.length
      : null;

    if (!averageScore) {
      return {
        gpa: "N/A",
        grade: "N/A",
      };
    }

    const gpa = calculateGPA(averageScore);
    const grade = calculateGrade(averageScore);

    return {
      gpa,
      grade,
    };
  };

  const overallScore: OverallScore =
    role === "student"
      ? await getAverageGrade()
      : {
          grade: "",
          gpa: "",
        };

  const upcomingClasses = classes
    ? classes.filter(({ start_date, end_date }) => {
        const isUpcoming = getStatus(start_date, end_date) === "Upcoming";
        return isUpcoming;
      })
    : [];

  return (
    <div className="mx-2 sm:max-w-6xl sm:mx-auto">
      <h2 className="font-bold text-2xl">
        Good {getTime()}, {currentUser?.prefix ? `${currentUser?.prefix}.` : ""}{" "}
        {currentUser?.name.split(" ")[0]}
      </h2>

      <section className="flex flex-col sm:flex-row justify-between items-center space-y-9 sm:space-y-0 sm:space-x-9 mt-11">
        <OverviewCard
          title={String(classes?.length ?? 0)}
          subTitle={
            role === "instructor" ? "Total Classes" : "Enrolled Classes"
          }
          Icon={Heart}
        />
        <OverviewCard
          title={
            role === "instructor" ? String(totalStudents) : overallScore.grade
          }
          subTitle={role === "instructor" ? "Total Students" : "Average Grade"}
          Icon={Plus}
        />
        <OverviewCard
          title={
            role === "instructor"
              ? mostEnrolled?.code ?? "N/A"
              : overallScore.gpa
          }
          subTitle={role === "instructor" ? "Most Enrolled" : "GPA"}
          Icon={Briefcase}
        />
      </section>

      {classes?.length ? (
        <section className="mt-10">
          <h3 className="font-semibold text-lg">Upcoming Classes</h3>

          <div className="flex flex-col sm:flex-row space-y-9 sm:space-x-9 sm:space-y-0 mt-4">
            {upcomingClasses
              ? upcomingClasses
                  .slice(0, 3)
                  .map(({ id, code, name, thumbnail, instructor_id }) => (
                    <ClassCard
                      id={id}
                      key={id}
                      code={code}
                      name={name}
                      thumbnail={
                        thumbnail ? createAvatarUrl(thumbnail) : noImage
                      }
                      instructorId={instructor_id}
                    />
                  ))
              : null}
          </div>
        </section>
      ) : null}

      <section className="mt-10 p-7 bg-secondary rounded-2xl shadow-md">
        <h3 className="font-semibold text-lg">My Classes</h3>
        {role === "student" ? (
          <>
            {classes && classes.length ? (
              <StudentClassesTable classes={classes} />
            ) : (
              <div className="flex h-96 items-center justify-center">
                <p className="font-medium text-lg text-gray-700">
                  No Classes Found
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {instructorClasses && instructorClasses.length ? (
              <InstructorClassesTable classes={instructorClasses} />
            ) : (
              <div className="flex h-96 items-center justify-center">
                <p className="font-medium text-lg text-gray-700">
                  No Classes Found
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {currentUser?.role === "instructor" ? (
        <EditClassModal currentUser={currentUser} />
      ) : null}
    </div>
  );
}
