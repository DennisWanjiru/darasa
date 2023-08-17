import Save from "@/assets/save.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ButtonProps extends React.ComponentProps<"button"> {
  title: string;
  icon?: boolean;
}

export default function Button({
  title,
  icon,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center justify-center bg-primary text-white h-12 px-2.5 rounded-[10px] w-full",
        className
      )}
    >
      {icon ? <Image src={Save} alt="Save Icon" className="mr-2.5" /> : null}
      {title}
    </button>
  );
}
