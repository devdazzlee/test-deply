"use client";

import Link from "next/link";

interface MenuItemProps {
  label: string;
  href?: string;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, href, onClick }) => {
  return (
    <Link
      href={href ?? "#"}
      onClick={onClick}
      className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'
    >
      {label}
    </Link>
  );
};

export default MenuItem;
