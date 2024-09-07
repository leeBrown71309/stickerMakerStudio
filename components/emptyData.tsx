import { CircleOff } from "lucide-react";

export default function EmptyData({ title, subTitle }: any) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center my-20 p-5 rounded-lg ">
        <CircleOff size={54} className="text-primary-500" />
        <span className="text-2xl font-bold"> {title} </span>
        <span className="text-sm text-slate-600 mt-2">{subTitle}</span>
      </div>
    </div>
  );
}
