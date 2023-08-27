import clsx from "clsx";
import { ClassValue } from "clsx";
import { differenceInDays } from "date-fns";
import { twMerge } from "tailwind-merge";

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
  if (marks >= 90) {
    return "A";
  } else if (marks >= 80) {
    return "B";
  } else if (marks >= 70) {
    return "C";
  } else if (marks >= 60) {
    return "D";
  } else {
    return "F";
  }
}
