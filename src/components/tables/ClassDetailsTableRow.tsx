"use client";

import { Enrollment, Grade, GradeData, Profile } from "@/lib/types";
import { calculateGrade } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Edit from "@/assets/edit.svg";
import { useEffect, useState } from "react";
import Avatar from "../Avatar";

type Props = {
  data: Enrollment;
  onSelectRow: (data: GradeData) => void;
};

export default function ClassDetailsTableRow({ data, onSelectRow }: Props) {
  const supabase = createClientComponentClient();
  const [student, setStudent] = useState<Partial<Profile> | null>(null);
  const [grade, setGrade] = useState<any>(null);
  const [major, setMajor] = useState<any>(null);

  useEffect(() => {
    const getStudent = async () => {
      const { data: students } = await supabase
        .from("profile")
        .select("name, avatar_url, email, major_id")
        .eq("id", data.student_id);

      const student = students ? students[0] : null;
      setStudent(student);
    };

    const getGrade = async () => {
      const { data: grades } = await supabase
        .from("grade")
        .select()
        .eq("student_id", data.student_id)
        .eq("class_id", data.class_id);

      const grade: Grade | null = grades ? grades[0] : null;
      setGrade(grade);
    };

    const getMajor = async () => {
      const { data: majors } = await supabase
        .from("major")
        .select()
        .eq("id", student?.major_id ?? "");

      const major = majors ? majors[0].name : "";
      setMajor(major);
    };

    getStudent();
    getGrade();
    getMajor();
  }, [supabase, data, student?.major_id]);

  const gradeData: GradeData = {
    id: grade?.id,
    student_id: data.student_id,
    class_id: data.class_id,
    email: student?.email ?? "",
    name: student?.name ?? "",
    major,
    grade: grade ? grade.grade : undefined,
    avatar_url: student?.avatar_url ?? "",
  };

  return (
    <tr className="border-0 text-gray-800">
      <td>{grade?.grade ? `${grade?.grade}%` : "-"}</td>
      <td className="text-blue-500">
        <div className="flex items-center space-x-3">
          {student?.name ? (
            <Avatar
              name={student.name}
              variant="circle"
              url={student?.avatar_url ?? undefined}
            />
          ) : null}

          <div>
            <div className="font-semibold text-blue-500">{student?.name}</div>
          </div>
        </div>
      </td>
      <td>{student?.email}</td>
      <td>{grade ? calculateGrade(grade.grade) : "-"}</td>
      <td>
        {student ? (
          <Image
            src={Edit}
            alt="edit"
            onClick={() => onSelectRow(gradeData)}
            className="cursor-pointer"
          />
        ) : null}
      </td>
    </tr>
  );
}
