"use client";

import { IconType } from "react-icons";

interface ListingCategoryProps {
  // icon: IconType;
  label: string;
  // description: string;
}

const ListingCategory: React.FC<ListingCategoryProps> = ({
  // icon: Icon,
  label
  // description
}) => {
  return (
    <div className='flex flex-col rounded-xl bg-theme text-white px-2 py-1 w-fit'>
      {/* <div className="flex flex-row items-center"> */}
      {/* <Icon 
                    size={40}
                    className="text-neutral-600"
                /> */}
      {/* <div className="flex flex-col"> */}
      <div className='text-md '>{label}</div>
      {/* <div className="text-neutral-500 font-light">
                        {description}
                    </div> */}
      {/* </div> */}
      {/* </div> */}
    </div>
  );
};

export default ListingCategory;
