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
  const getSize = () => {
    switch (size) {
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

  const getVariant = () => {
    switch (variant) {
      case "circle":
        return "rounded-full";

      case "square":
        return !size || size === "sm" ? "rounded-xl" : "rounded-3xl";

      default:
        return "rounded-full";
    }
  };

  return (
    <div className="avatar">
      <div
        className={cn("w-12 h-12", getSize(), getVariant(), {
          "bg-green-800": !url,
        })}
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
              getSize()
            )}
          >
            {getUserFirstLetter(name)}
          </div>
        )}
      </div>
    </div>
  );
}
