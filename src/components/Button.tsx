import Save from "@/assets/save.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ButtonProps extends React.ComponentProps<"button"> {
  title: string;
  icon?: boolean;
  variant?: "inverse" | "primary";
  onClick?: () => void;
  isSubmitting?: boolean;
}

export default function Button({
  title,
  icon,
  className,
  onClick,
  variant,
  isSubmitting,
  ...props
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center bg-primary text-white h-12 px-2.5 rounded-[10px] w-full hover:bg-gray-900",
        className,
        {
          "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white":
            variant === "inverse",
        }
      )}
    >
      {isSubmitting ? (
        <span className="loading loading-dots loading-sm"></span>
      ) : (
        <>
          {icon ? (
            <Image src={Save} alt="Save Icon" className="mr-2.5" />
          ) : null}
          {title}
        </>
      )}
    </button>
  );
}
