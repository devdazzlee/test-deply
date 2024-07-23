"use client";

import React from "react";
import { IconType } from "react-icons";
import qs from "query-string";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected
}) => {
  const params = useSearchParams();

  let query = qs.parse(params?.toString() ?? "");

  // If this category filter is the active one, clicking
  // it should remove it instead.
  if (query['category'] === label) {
    delete query['category'];
  }
  else {
    query['category'] = label;
  }

  const url = qs.stringifyUrl({
    url: '/',
    query
  }, { skipNull: true });

  return (
    <Link
      href={url}
      className={`
            flex
            flex-col
            items-center
            justify-center
            gap-2
            p-3
            border-b-2
            hover:text-neutral-800
            text-nowrap
            transition
            cursor-pointer
            ${selected ? "border-b-neutral-800" : "border-transparent"}
            ${selected ? "text-neutral-800" : "text-neutral-500"}
        `}
    >
      <Icon size={26} />
      <div className='font-medium text-sm'>{label}</div>
    </Link>
  );
};

export default CategoryBox;
