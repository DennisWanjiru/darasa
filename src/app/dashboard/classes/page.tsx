import Button from "@/components/Button";
import InstructorClassesTable from "@/components/InstructorClassesTable";
import { getCurrentUser } from "@/lib/actions";
import { getStatus } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import React from "react";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });
  const currentUser = await getCurrentUser();
  const role = currentUser?.role;

  const { data: classes, error } = await supabase
    .from("class")
    .select()
    .eq("instructor_id", currentUser?.id ?? "");

  const currentClasses = classes
    ? classes.filter(({ start_date, end_date }) => {
        const isCurrent = getStatus(start_date, end_date) === "Active";
        return isCurrent;
      })
    : [];

  const futureClasses = classes
    ? classes.filter(({ start_date, end_date }) => {
        const isUpcoming = getStatus(start_date, end_date) === "Upcoming";
        return isUpcoming;
      })
    : [];

  const completedClasses = classes
    ? classes.filter(({ start_date, end_date }) => {
        const isCompleted = getStatus(start_date, end_date) === "Completed";
        return isCompleted;
      })
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-11">
        <h2 className="font-bold text-2xl">My Classes</h2>
        <div className="w-36">
          <Button title="Add a Class" />
        </div>
      </div>

      {currentClasses.length ? (
        <section className="mt-10 p-7 bg-secondary rounded-2xl shadow-md">
          <h3 className="font-semibold text-lg">Current Classes</h3>
          <InstructorClassesTable classes={currentClasses} />
        </section>
      ) : null}

      {futureClasses.length ? (
        <section className="mt-10 p-7 bg-secondary rounded-2xl shadow-md">
          <h3 className="font-semibold text-lg">Future Classes</h3>
          <InstructorClassesTable classes={futureClasses} />
        </section>
      ) : null}

      {completedClasses.length ? (
        <section className="mt-10 p-7 bg-secondary rounded-2xl shadow-md">
          <h3 className="font-semibold text-lg">Completed Classes</h3>
          <InstructorClassesTable classes={currentClasses} />
        </section>
      ) : null}
    </div>
  );
}
