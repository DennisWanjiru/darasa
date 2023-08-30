import clsx from "clsx";
import { ClassValue } from "clsx";
import { differenceInDays } from "date-fns";
import { twMerge } from "tailwind-merge";
import { GPATableEntry, GradeBoundary } from "./types";
import { toast } from "react-toastify";

export const cn = (...values: ClassValue[]) => {
  return twMerge(clsx(values));
};

export const createThumnailUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_STORAGE_BUCKET_URL}/thumbnails/${path}`;
};

export const createAvatarUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_STORAGE_BUCKET_URL}/avatars/${path}`;
};

export const getUserFirstLetter = (name: string) =>
  name.charAt(0).toUpperCase();

export const getStatus = (start_date: string, end_date: string) => {
  const startDiff = differenceInDays(new Date(start_date), new Date());
  const endDiff = differenceInDays(new Date(end_date), new Date());

  if (startDiff <= 0 && endDiff >= 0) {
    return "Active";
  }

  if (startDiff > 0) {
    return "Upcoming";
  }

  if (endDiff < 0) {
    return "Completed";
  }

  return "Unknown";
};

export function calculateGrade(marks: number): string {
  if (marks < 0 || marks > 100) {
    throw new Error("Marks must be between 0 and 100");
  }

  const gradeBoundaries: GradeBoundary[] = [
    { lowerBound: 95, grade: "A+" },
    { lowerBound: 90, grade: "A" },
    { lowerBound: 85, grade: "A-" },
    { lowerBound: 80, grade: "B+" },
    { lowerBound: 75, grade: "B" },
    { lowerBound: 70, grade: "B-" },
    { lowerBound: 65, grade: "C+" },
    { lowerBound: 60, grade: "C" },
    { lowerBound: 55, grade: "C-" },
    { lowerBound: 50, grade: "D" },
    { lowerBound: 0, grade: "F" },
  ];

  for (const { lowerBound, grade } of gradeBoundaries) {
    if (marks >= lowerBound) {
      return grade;
    }
  }

  return "F";
}

export const getTime = () => {
  const now = new Date();
  const isMorning = now.getHours() > 5 && now.getHours() < 12;
  const isAfternoon = now.getHours() >= 12 && now.getHours() <= 16;

  if (isMorning) return "morning";
  if (isAfternoon) return "afternoon";
  return "evening";
};

export function calculateGPA(averageScore: number): string {
  if (averageScore < 0 || averageScore > 100) {
    throw new Error("Average score must be between 0 and 100");
  }

  const gpaTable: GPATableEntry[] = [
    { minScore: 97, gpa: "4.0" },
    { minScore: 93, gpa: "3.7" },
    { minScore: 90, gpa: "3.3" },
    { minScore: 87, gpa: "3.0" },
    { minScore: 83, gpa: "2.7" },
    { minScore: 80, gpa: "2.3" },
    { minScore: 77, gpa: "2.0" },
    { minScore: 73, gpa: "1.7" },
    { minScore: 70, gpa: "1.3" },
    { minScore: 67, gpa: "1.0" },
    { minScore: 63, gpa: "0.7" },
    { minScore: 60, gpa: "0.3" },
    { minScore: 0, gpa: "0.0" },
  ];

  for (const entry of gpaTable) {
    if (averageScore >= entry.minScore) {
      return entry.gpa;
    }
  }

  return "0.0";
}

export const notify = (
  message: string,
  type: "success" | "error" = "success"
) => {
  return toast[type](message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
