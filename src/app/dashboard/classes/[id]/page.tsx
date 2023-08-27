import ClassDetailsTableRow from "@/components/ClassDetailsTableRow";
import { Enrollment } from "@/lib/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type Props = { params: { id: string } };

export default async function Index({ params }: Props) {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase
    .from("enrollment")
    .select()
    .eq("class_id", params.id ?? "");

  const { data: classes, error } = await supabase
    .from("class")
    .select("code")
    .eq("id", params.id);

  const code = classes ? classes[0].code : "";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-11">
        {code ? <h2 className="font-bold text-2xl">{code} Students</h2> : null}
      </div>

      <section className="mt-10 p-7 bg-secondary rounded-2xl shadow-md">
        <h3 className="font-semibold text-lg">All Students</h3>

        <div className="overflow-x-auto overflow-y-scroll mt-7 max-h-[650px]">
          <table className="table">
            <thead>
              <tr className="text-primary invert-[.1] border-0 text-base">
                <th>Total Marks</th>
                <th>Student Name</th>
                <th>Student Email</th>
                <th>Grade</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data ? (
                <>
                  {data.map((enrollment: Enrollment) => (
                    <ClassDetailsTableRow
                      key={enrollment.id}
                      data={enrollment}
                    />
                  ))}
                </>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
