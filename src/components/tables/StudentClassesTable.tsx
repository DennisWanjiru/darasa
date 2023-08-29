import { ClassType } from "@/lib/types";
import InstructorClassRow from "./InstructorClassRow";
import ClassRow from "./ClassRow";

type Props = {
  classes: ClassType[];
};

export default function StudentClassesTable({ classes }: Props) {
  return (
    <div className="overflow-x-auto overflow-y-scroll mt-7 max-h-[650px]">
      <table className="table">
        <thead>
          <tr className="text-primary invert-[.1] border-0">
            <th>Class Code</th>
            <th>Class Name</th>
            <th>Instuctor</th>
            <th>Marks</th>
            <th>Grade</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {classes.map((data) => (
            <ClassRow key={data.id} data={data} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

{
}
