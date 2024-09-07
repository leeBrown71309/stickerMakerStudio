import Image from "next/image";
import Link from "next/link";

export default function header() {
  return (
    <div className="h-14 w-full bg-pureBackground border-b border-slate-800 flex items-center justify-center gap-3">
      <Link href="/" className="flex items-center">
        <div className="mx-3">
          <Image
            width={50}
            height={50}
            src="/assets/logo.png"
            alt="sticker"
            className="rounded-lg"
          ></Image>
        </div>

        <span className="text-md">Sticker Maker</span>
      </Link>
    </div>
  );
}
