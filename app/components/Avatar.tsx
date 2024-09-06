"use client";

import Image from "next/image";

interface AvatarProps {
  src?: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
  return (
    <Image
      className='rounded-full'
      height={30}
      width={30}
      alt='Avatar'
      src={src || "/images/placeholder.jpg"}
      style={{
        "border": `double 3.5px transparent`,
        // "backgroundImage": `linear-gradient(white, white), radial-gradient(circle at top left, #008f68, #fae042)`,
        "backgroundImage": `linear-gradient(white, white), radial-gradient(circle at top left, #d7f01a, #f0c11a)`,
        "backgroundOrigin": `border-box`,
        "backgroundClip": `content-box, border-box`,
      }}
    />
  );
};

export default Avatar;
