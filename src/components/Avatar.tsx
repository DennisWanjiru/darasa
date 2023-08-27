import { cn, createAvatarUrl, getUserFirstLetter } from "@/lib/utils";
import Image from "next/image";

type Size = "sm" | "md" | "lg";
type Variant = "circle" | "square";

type Props = {
  url?: string;
  name: string;
  size?: Size;
  variant?: Variant;
};

export default function Avatar({ url, name, variant, size }: Props) {
  const getSize = (_size?: Size) => {
    switch (_size) {
      case "sm":
        return "h-12 w-12";
      case "md":
        return "h20 w-20";
      case "lg":
        return "h-28 w-28";

      default:
        return "";
    }
  };

  return (
    <div className="avatar">
      <div
        className={cn(
          "mask mask-circle w-12 h-12 bg-green-800",
          getSize(size),
          {
            "mask-square rounded-3xl": variant === "square",
            "mask-circle": variant === "circle",
          }
        )}
      >
        {url ? (
          <Image
            src={createAvatarUrl(url)}
            alt="cover"
            height={48}
            width={48}
            className="object-cover h-full"
          />
        ) : (
          <div
            className={cn(
              "flex items-center justify-center text-2xl h-12 w-12 text-white",
              getSize(size)
            )}
          >
            {getUserFirstLetter(name)}
          </div>
        )}
      </div>
    </div>
  );
}
