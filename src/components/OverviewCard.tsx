import Image from "next/image";

type Props = {
  title: string;
  subTitle: string;
  Icon: any;
};

export default function OverviewCard({ title, subTitle, Icon }: Props) {
  return (
    <div className="flex w-1/3 max-w-sm h-28 bg-secondary rounded-2xl items-center justify-start px-9 space-x-11 shadow-md">
      <Image src={Icon} alt="icon" />
      <div className="flex flex-col">
        <h4 className=" font-extrabold invert-[.3] text-2xl">{title}</h4>
        <p className="invert-[.3]">{subTitle}</p>
      </div>
    </div>
  );
}
