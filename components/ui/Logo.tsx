"use client";

import Image from "next/image";
import Link from "next/link";
import RellTalk from "@/assets/RellTalk.png";

export default function Logo() {
  return (
    <div className="w-full flex justify-center items-center mt-12 sm:mt-8 md:mt-12 lg:mt-16">
      <Link href="/">
        <Image
          src={RellTalk}
          alt="ReelTalk 로고"
          width={200}
          height={80}
          className="sm:w-40 sm:h-16 md:w-64 md:h-24 lg:w-72 lg:h-28 object-contain"
          priority
        />
      </Link>
    </div>
  );
}
