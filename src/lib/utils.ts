import clsx from "clsx";
import { ClassValue } from "clsx";
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
