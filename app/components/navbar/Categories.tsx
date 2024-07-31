"use client";

import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import Container from "../Container";
import {
  GiHuntingHorn,
  GiAerialSignal,
  GiLifeBar,
  GiFullMotorcycleHelmet,
  GiLovers,
  GiBoatFishing
} from "react-icons/gi";
import {
  MdOutlineFitnessCenter,
  MdOutlineTravelExplore,
  MdRealEstateAgent,
  MdFamilyRestroom,
  MdProductionQuantityLimits,
  MdSportsHandball,
  MdEvent,
  MdOutlineCorporateFare
} from "react-icons/md";
import {
  FaShoppingBag,
  FaJournalWhills,
  FaHeart,
  FaHatCowboy,
  FaWater
} from "react-icons/fa";
import { LiaUserAstronautSolid } from "react-icons/lia";
import { FaPersonMilitaryPointing } from "react-icons/fa6";
import { SiPowerautomate } from "react-icons/si";
import { BsFileImage } from "react-icons/bs";
import { Suspense } from "react";

import CategoryBox from "./CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";

import { HiDocumentDuplicate } from "react-icons/hi";

export const categories = [
  {
    label: "Hunting",
    icon: GiHuntingHorn,
    description: "Get content creators for hunting!"
  },
  {
    label: "Moto",
    icon: GiFullMotorcycleHelmet,
    description: "Get content creators for moto activities!"
  },
  {
    label: "Auto",
    icon: SiPowerautomate,
    description: "Get content creators for auto activities!"
  },
  {
    label: "Portraits",
    icon: BsFileImage,
    description: "Get content creators for portraits!"
  },
  {
    label: "Family",
    icon: MdFamilyRestroom,
    description: "Get content creators for family activities!"
  },
  {
    label: "Wedding",
    icon: GiLovers,
    description: "Get content creators for weddings!"
  },
  {
    label: "Product",
    icon: MdProductionQuantityLimits,
    description: "Get content creators for products!"
  },
  {
    label: "Lifestyle",
    icon: GiLifeBar,
    description: "Get content creators for lifestyle!"
  },
  {
    label: "Documentary",
    icon: HiDocumentDuplicate,
    description: "Get content creators for documentaries!"
  },
  {
    label: "Sport",
    icon: MdSportsHandball,
    description: "Get content creators for sports!"
  },
  {
    label: "Event",
    icon: MdEvent,
    description: "Get content creators for events!"
  },
  {
    label: "Corporate",
    icon: MdOutlineCorporateFare,
    description: "Get content creators for corporate activities!"
  },
  {
    label: "Astro",
    icon: LiaUserAstronautSolid,
    description: "Get content creators for astro activities!"
  },
  {
    label: "Aerial",
    icon: GiAerialSignal,
    description: "Get content creators for aerial views!"
  },
  {
    label: "Fishing",
    icon: GiBoatFishing,
    description: "Get content creators for fishing!"
  },
  {
    label: "Fashion",
    icon: FaShoppingBag,
    description: "Get content creators for fashion!"
  },
  {
    label: "Journalism",
    icon: FaJournalWhills,
    description: "Get content creators for journalism!"
  },
  {
    label: "Couples",
    icon: FaHeart,
    description: "Get content creators for couples!"
  },
  {
    label: "Rodeo",
    icon: FaHatCowboy,
    description: "Get content creators for rodeo!"
  },
  {
    label: "Travel",
    icon: MdOutlineTravelExplore,
    description: "Get content creators for travel!"
  },
  {
    label: "Real Estate",
    icon: MdRealEstateAgent,
    description: "Get content creators for real estate!"
  },
  {
    label: "Military/LEO",
    icon: FaPersonMilitaryPointing,
    description: "Get content creators for military/LEO!"
  },
  {
    label: "Water",
    icon: FaWater,
    description: "Get content creators for water activities!"
  },
  {
    label: "Fitness",
    icon: MdOutlineFitnessCenter,
    description: "Get content creators for fitness!"
  }
];

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category") || "";
  const catArr = category?.split(",");

  const pathname = usePathname();

  const isMainPage = pathname == "/";

  if (!isMainPage) {
    return null;
  }
  const scroll = (width: any) => {
    const container = document.getElementById("categoriesContainer");
    if (container) {
      container.scrollBy({
        left: width, // Adjust this value as needed
        behavior: "smooth" // Optional: adds smooth scrolling effect
      });
    }
  };

  return (
    <Suspense>
      <Container>
        <div className='flex items-center'>
          <button
            onClick={() => scroll(-300)}
            type='button'
            className='text-black border shadow-sm  bg-white hidden font-medium rounded-full text-sm p-2 h-fit text-center sm:inline-flex items-center mr-4  hover:shadow-md'
          >
            <svg
              className='w-4 h-4 rotate-180'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 14 10'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M1 5h12m0 0L9 1m4 4L9 9'
              />
            </svg>
          </button>
          <div
            id='categoriesContainer'
            className='pt-4 flex flex-row shadow-y-md items-center justify-between overflow-x-auto no-scrollbar'
          >
            {categories.map(item => (
              <CategoryBox
                key={item.label}
                label={item.label}
                selected={catArr.includes(item.label)}
                icon={item.icon}
              />
            ))}
          </div>
          <button
            onClick={() => scroll(300)}
            type='button'
            className='text-black border shadow-sm  bg-white font-medium rounded-full text-sm p-2 h-fit text-center hidden sm:inline-flex items-center ml-4  hover:shadow-md'
          >
            <svg
              className='w-4 h-4'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 14 10'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M1 5h12m0 0L9 1m4 4L9 9'
              />
            </svg>
          </button>
        </div>
      </Container>
    </Suspense>
  );
};

export default Categories;
