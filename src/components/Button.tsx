import Save from "@/assets/save.svg";
import Image from "next/image";

interface ButtonProps extends React.ComponentProps<"button"> {
  title: string;
  icon?: boolean;
}

export default function Button({ title, icon }: ButtonProps) {
  return (
    <button className="flex items-center justify-center bg-primary text-white h-12 px-2.5 rounded-[10px] w-full">
      {icon ? <Image src={Save} alt="Save Icon" className="mr-2.5" /> : null}
      {title}
    </button>
  );
}
