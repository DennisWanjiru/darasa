import Heart from "@/assets/heart.svg";
import Plus from "@/assets/plus.svg";
import Briefcase from "@/assets/briefcase.svg";
import OverviewCard from "@/components/OverviewCard";
import Image from "next/image";
import Supa from "@/assets/supaman.jpeg";
import ClassCard from "@/components/ClassCard";
import Button from "@/components/Button";
import ClassTable from "@/components/ClassTable";

export default async function Home() {
  const classes: any[] = new Array(5).fill(1);
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="font-bold text-2xl">Good morning, Dennis</h2>

      <section className="flex justify-between items-center space-x-9 mt-11">
        <OverviewCard title="10" subTitle="Enrolled Classes" Icon={Heart} />
        <OverviewCard title="B+" subTitle="Average Grade" Icon={Plus} />
        <OverviewCard title="3.5" subTitle="GPA" Icon={Briefcase} />
      </section>

      <section className="mt-10">
        <h3 className="font-semibold text-lg">Today&apos;s Classes</h3>

        <div className="flex space-x-9 mt-4">
          <ClassCard
            code="SC-101"
            name="Artificial Intelligence"
            thumbnail={Supa}
            instructor="Prof. Ernest Younger"
          />
          <ClassCard
            code="SC-101"
            name="Artificial Intelligence"
            thumbnail={Supa}
            instructor="Prof. Ernest Younger"
          />
          <ClassCard
            code="SC-101"
            name="Artificial Intelligence"
            thumbnail={Supa}
            instructor="Prof. Ernest Younger"
          />
        </div>
      </section>

      <section className="mt-10 p-7 bg-secondary rounded-2xl shadow-md">
        <h3 className="font-semibold text-lg">My Classes</h3>
        {classes.length ? (
          <ClassTable classes={classes} />
        ) : (
          <div className="flex h-96 items-center justify-center">
            <p className="font-medium text-lg text-gray-700">
              No Classes Found
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
