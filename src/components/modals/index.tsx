"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import Image from "next/image";

import Cancel from "@/assets/cancel.svg";

type Props = {
  title: string;
  aside?: boolean;
  closeModal: () => void;
  children: React.ReactNode;
};

export default function Dialog({ title, aside, children, closeModal }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const closeDialog = () => {
    dialogRef.current?.close();
    closeModal();
  };

  return (
    <dialog
      ref={dialogRef}
      className={cn("modal visible opacity-100 ", {
        "justify-end align-bottom": aside,
      })}
    >
      <section
        className={cn("modal-box bg-secondary text-primary", {
          "rounded-xl  w-full max-w-[700px] p-8": !aside,
          "h-screen max-h-[calc(100vh)] border-b-raius rounded-e-none rounded-es-none rounded-tr-xl rounded-tl-xl w-[369px] mr-3 mt-4":
            aside,
        })}
      >
        <div className="flex justify-between items-center">
          <div className="opacity-0"></div>
          <h4>{title}</h4>
          <Image
            src={Cancel}
            alt="Close"
            onClick={closeDialog}
            className="cursor-pointer"
          />
        </div>

        {children}
      </section>
    </dialog>
  );
}
