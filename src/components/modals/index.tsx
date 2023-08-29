"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import Image from "next/image";

import Cancel from "@/assets/cancel.svg";

type Props = {
  title: string;
  closeModal: () => void;
  children: React.ReactNode;
};

export default function Dialog({ title, children, closeModal }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const closeDialog = () => {
    dialogRef.current?.close();
    closeModal();
  };

  return (
    <dialog ref={dialogRef} className={cn("modal visible opacity-100")}>
      <section className="modal-box rounded-xl bg-secondary text-primary w-full max-w-[700px] p-8">
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
