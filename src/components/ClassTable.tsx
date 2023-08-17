import React from "react";
import Button from "./Button";
import Image from "next/image";

import thumbnail from "@/assets/supaman.jpeg";

type Props = {
  classes: any[];
};

export default function ClassTable({ classes }: Props) {
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
          {classes.map((idx) => (
            <tr key={idx + Math.random()} className="border-0">
              <td className="invert-[.3]">SC-101</td>
              <td className="text-blue-500">Artificial Intelligence</td>
              <td>
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-circle w-12 h-12 bg-gray-300">
                      <Image
                        src={thumbnail}
                        alt="cover"
                        className="object-cover h-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-500">
                      Prof. Hart Hagerty
                    </div>
                  </div>
                </div>
              </td>

              <td className="invert-[.3]">91</td>
              <td className="invert-[.3]">A</td>
              <td className="w-28">
                <Button title="Active" className="h-7 bg-green-800 text-xs" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

{
}
