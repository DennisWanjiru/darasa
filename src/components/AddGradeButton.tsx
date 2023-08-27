"use client";

import React, { useState } from "react";
import AddGradeModal from "./modals/AddGradeModal";
import Image from "next/image";
import Edit from "@/assets/edit.svg";
import { GradeData } from "@/lib/types";

export default function AddGradeButton({
  gradeData,
}: {
  gradeData: GradeData;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Image src={Edit} alt="edit" onClick={() => setIsOpen(true)} />
      <AddGradeModal
        data={gradeData}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      />
    </div>
  );
}
