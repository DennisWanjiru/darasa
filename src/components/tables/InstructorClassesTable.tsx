import { ClassType } from "@/lib/types";
import InstructorClassRow from "./InstructorClassRow";

type Props = {
  classes: ClassType[];
};

export default function InstructorClassesTable({ classes }: Props) {
  return (
    <div className="overflow-x-auto overflow-y-scroll mt-7 max-h-[650px]">
      <table className="table">
        <thead>
          <tr className="text-primary invert-[.1] border-0 text-base">
            <th>Class Code</th>
            <th>Class Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Students</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {classes.map((data) => (
            <InstructorClassRow key={data.id} data={data} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

{
}
