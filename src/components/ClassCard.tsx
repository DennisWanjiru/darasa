import Image from "next/image";

type Props = {
  thumbnail: any;
  code: string;
  name: string;
  instructor: string;
};

export default function ClassCard({
  thumbnail,
  name,
  code,
  instructor,
}: Props) {
  return (
    <div className="card card-side shadow-md bg-secondary">
      <figure className="w-1/3">
        <Image src={thumbnail} alt="cover" className="object-cover h-full" />
      </figure>
      <div className="card-body">
        <h4 className="invert-[.3]">{code}</h4>
        <h3 className="card-title truncate invert-[.2]">{name}</h3>
        <p className="text-sm truncate">
          Instructor:{" "}
          <span className="text-blue-500">Prof. Ernest Younger</span>
        </p>
      </div>
    </div>
  );
}
