import Image from "next/image";
import Edit from "@/assets/edit.svg";
import { GradeData } from "@/lib/types";

type Props = {
  gradeData: GradeData;
  onSelectRow: () => void;
};

export default function AddGradeButton({ gradeData, onSelectRow }: Props) {
  return (
    <Image
      src={Edit}
      alt="edit"
      onClick={() => onSelectRow()}
      className="cursor-pointer"
    />
  );
}
