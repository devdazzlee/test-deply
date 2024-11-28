"use client";

import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "./Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import CitySelect, { CitySelectValue } from "../inputs/CitySelect";
import qs from "query-string";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import SlidingScale from "../inputs/SlidingScale";
import Stars from "../inputs/Stars";
import { SlCalender } from "react-icons/sl";
import ContentType from "../inputs/ContentType";
import MilesSelect, { MilesSelectValue } from "../inputs/MilesSelect";

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2
}

const SearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  const [miles, setMiles] = useState<MilesSelectValue | null>(null); // State for selected miles
  const [country, setCountry] = useState<CountrySelectValue>();
  const [location, setLocation] = useState<CitySelectValue>();
  const [category, setCategory] = useState<string[]>([]);
  const [step, setStep] = useState(STEPS.LOCATION);
  const [experience, setExperience] = useState(1);
  const [averageRating, setAverageRating] = useState(3);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  });
  const [calenderOption, setCalenderOption] = useState<string>("Dates");

  const handleSelectCat = (selectedCategory: string) => {
    const index = category.includes(selectedCategory);

    if (!index) {
      const newCategories = [...category, selectedCategory];
      setCategory(newCategories);
    } else {
      const newCategories = [
        ...category.filter(cat => cat !== selectedCategory)
      ];
      setCategory(newCategories);
    }
  };

  const Map = useMemo(
    () =>
      dynamic(() => import("../GoogleMaps"), {
        ssr: false
      }),
    []
  );

  const onBack = useCallback(() => {
    setStep(value => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep(value => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {

console.log("miles?.value >>>" , miles?.value )
    if (step != STEPS.INFO) {
      return onNext();
    }
  
    let currentQuery = {};
  
    if (params) {
      currentQuery = qs.parse(params.toString());
    }
  
    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      miles: miles?.value, // Include miles range in query
      experience,
      averageRating,
    };
  
    if (category.length) updatedQuery.category = category.join(",");
  
    if (calenderOption === "Dates") {
      if (dateRange.startDate) {
        updatedQuery.startDate = formatISO(dateRange.startDate);
      }
  
      if (dateRange.endDate) {
        updatedQuery.endDate = formatISO(dateRange.endDate);
      }
    }
    console.log(updatedQuery);
  
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );
  
    setStep(STEPS.LOCATION);
    searchModal.onClose();
  
    router.push(url);
  }, [
    step,
    searchModal,
    location,
    miles,
    router,
    experience,
    averageRating,
    dateRange,
    onNext,
    params,
    category,
  ]);
  
  const experienceLabels = [
    "1+ years",
    "3+ years",
    "5+ years",
    "7+ years",
    "9+ years"
  ];

  const actionLabel = useMemo(() => {
    if (step == STEPS.INFO) {
      return "Search";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step == STEPS.LOCATION) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading title="Where are you based?" subtitle="Find creators near you!" />
      <CountrySelect
        value={country}
        onChange={(value) => setCountry(value as CountrySelectValue)}
      />
      {country && (
        <CitySelect
          value={location}
          countryCode={country.value}
          onChange={(value) => setLocation(value as CitySelectValue)}
        />
      )}
      {location && (
        <MilesSelect
          value={miles || undefined} 
          onChange={(value) => setMiles(value)} // Update state when a miles option is selected
        />
      )}
  
      <hr />
      <Map position={location?.latlng} miles={miles?.value} />
    </div>
  );
     

  if (step == STEPS.DATE) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='When are you looking to book?'
          subtitle='Ensure the creators are available for you!'
        />
        <div
          className={`flex self-center justify-center w-fit p-2 rounded-full bg-neutral-100 items-center gap-2 }`}
        >
          <button
            className={`"font-semibold py-1 px-2 rounded-full hover:shadow-md  active:bg-white   ${calenderOption === "Dates" && "bg-white"
              }`}
            onClick={() => setCalenderOption("Dates")}
          >
            Dates
          </button>

          <button
            className={`font-semibold py-1 px-2 rounded-full  hover:shadow-md  active:bg-white  ${calenderOption === "Anytime" && "bg-white"
              }`}
            onClick={() => setCalenderOption("Anytime")}
          >
            Anytime
          </button>
        </div>
        {calenderOption === "Dates" ? (
          <>
            <div className='lg:hidden xs:block'>
              <Calendar
                months={1}
                value={dateRange}
                onChange={value => setDateRange(value.selection)}
              />
            </div>
            <div className='hidden lg:block'>
              <Calendar
                months={2}
                value={dateRange}
                onChange={value => setDateRange(value.selection)}
              />
            </div>
          </>
        ) : (
         <></>
        )}
      </div>
    );
  }

  if (step == STEPS.INFO) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading title='More information' />

        <Stars
          title='Rating'
          subtitle='What rating do you want the creator to be?'
          value={averageRating}
          onChange={value => setAverageRating(value)}
        />
        <SlidingScale
          title='Experience'
          subtitle='How experienced do you want the creator to be?'
          value={experience}
          onChange={value => setExperience(value)}
          labels={experienceLabels}
        />

        <ContentType
          title='Pick multiple categories'
          subtitle=''
          category={category}
          onChange={item => handleSelectCat(item)}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      title='Filters'
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step == STEPS.LOCATION ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default SearchModal;
