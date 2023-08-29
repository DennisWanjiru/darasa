"use client";

import ClassDetailsTableRow from "@/components/tables/ClassDetailsTableRow";
import AddGradeModal from "@/components/modals/AddGradeModal";
import { Enrollment, GradeData } from "@/lib/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

type Props = { params: { id: string } };

export default function Index({ params }: Props) {
  const supabase = createClientComponentClient();
  const [classCode, setClassCode] = useState("");
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null);
  const [selectedRow, setSelectedRow] = useState<GradeData | null>(null);

  useEffect(() => {
    const getEnrollments = async () => {
      const { data } = await supabase
        .from("enrollment")
        .select()
        .eq("class_id", params.id ?? "");

      setEnrollments(data);
    };

    const getClassCode = async () => {
      const { data: classes, error } = await supabase
        .from("class")
        .select("code")
        .eq("id", params.id);

      const code = classes ? classes[0].code : "";
      setClassCode(code);
    };

    getEnrollments();
    getClassCode();
  }, [supabase, params.id]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-11">
        {classCode ? (
          <h2 className="font-bold text-2xl">{classCode} Students</h2>
        ) : null}
      </div>

      <section className="mt-10 p-7 bg-secondary rounded-2xl shadow-md">
        <h3 className="font-semibold text-lg">All Students</h3>

        <div className="overflow-x-auto overflow-y-scroll mt-7 max-h-[650px]">
          <table className="table">
            <thead>
              <tr className="text-primary invert-[.1] border-0 text-base">
                <th>Total Marks</th>
                <th>Student Name</th>
                <th>Student Email</th>
                <th>Grade</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {enrollments ? (
                <>
                  {enrollments.map((enrollment: Enrollment) => (
                    <ClassDetailsTableRow
                      key={enrollment.id}
                      data={enrollment}
                      onSelectRow={(data: GradeData) => setSelectedRow(data)}
                    />
                  ))}
                </>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {selectedRow ? (
        <AddGradeModal
          data={selectedRow}
          closeModal={() => setSelectedRow(null)}
        />
      ) : null}
    </div>
  );
}
