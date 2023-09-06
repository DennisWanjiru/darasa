import { cn } from "@/lib/utils";
import React from "react";
import { type UseFormRegister } from "react-hook-form";

interface TextAreaFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  placeholder?: string;
  rows?: number;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  register,
  error,
  placeholder = "",
  rows = 4,
}) => {
  return (
    <div className="flex flex-col">
      <label className="font-semibold" htmlFor={name}>
        {label}
      </label>{" "}
      <textarea
        id={name}
        {...register(name, { required: `${label} is required` })}
        placeholder={placeholder}
        rows={rows}
        className="max-h-28 p-2 bg-gray-100 mt-4 rounded-[10px] px-5 outline-0 focus:ring-2 focus:ring-black"
      />
      <span
        className={cn("text-red-700 text-xs mt-2 h-2", {
          "opacity-1": error,
          "opacity-0": !error,
        })}
      >
        {error ?? ""}
      </span>
    </div>
  );
};

export default TextAreaField;
