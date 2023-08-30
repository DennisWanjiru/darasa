import { Database } from "./schema";

export type Major = Database["public"]["Tables"]["major"]["Row"];
export type Role = Database["public"]["Tables"]["role"]["Row"];
export type Profile = Database["public"]["Tables"]["profile"]["Row"];
export type ClassType = Database["public"]["Tables"]["class"]["Row"];
export type Category = Database["public"]["Tables"]["category"]["Row"];
export type Enrollment = Database["public"]["Tables"]["enrollment"]["Row"];
export type Grade = Database["public"]["Tables"]["grade"]["Row"];

export type CurrentUser = Profile & {
  role: "student" | "instructor";
};

export type GradeData = {
  id?: string;
  email: string;
  name: string;
  major: string;
  grade?: number;
  student_id: string;
  class_id: string;
  avatar_url?: string;
};

export type GradeBoundary = {
  lowerBound: number;
  grade: string;
};

export type GPATableEntry = {
  minScore: number;
  gpa: string;
};
