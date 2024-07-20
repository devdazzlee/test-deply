"use client";

import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href='/'>
      <Image
        alt='Logo'
        className='ml-1 block cursor-pointer'
        height={100}
        width={100}
        src='/images/SGBoxDark.png'
      />
    </Link>
  );
};

export default Logo;
