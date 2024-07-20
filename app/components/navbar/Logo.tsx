"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <Image
      onClick={() => router.push("/")}
      alt='Logo'
      className='ml-1 block cursor-pointer'
      height={100}
      width={100}
      src='/images/SGBoxDark.png'
    />
  );
};

export default Logo;
