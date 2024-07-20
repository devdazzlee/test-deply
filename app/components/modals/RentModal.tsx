"use client";

import useRentModal from "@/app/hooks/useRentModal";

import { useCallback, useMemo, useState } from "react";
import Modal from "./Modal";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaHandPointUp } from "react-icons/fa";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<FieldValues>({
    defaultValues: {
      category: [],
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: [],
      price: 1,
      title: "",
      description: ""
    }
  });

  const category = watch("category");
  const location = watch("location");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  // const imageSrc = watch('imageSrc');

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false
      }),
    []
  );

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const onBack = () => {
    setStep(value => value - 1);
  };

  const onNext = () => {
    setStep(value => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = data => {
    if (step != STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

    imageSrc.forEach(element => {
      data.imageSrc.push(element);
    });

    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success("Listing Created!");
        router.refresh();
        setImageSrc([]);
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(error => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step == STEPS.PRICE) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step == STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  const handleSelectAllCategories = () => {
    const allCategories = categories.map(item => item.label);
    setValue("category", allCategories);
  };

  const handleSelectCat = (selectedCategory: string) => {
    const index = category.indexOf(selectedCategory);

    if (index === -1) {
      const newCategory = [...category, selectedCategory];
      setValue("category", newCategory);
    } else {
      const newCategory = [
        ...category.slice(0, index),
        ...category.slice(index + 1)
      ];
      setValue("category", newCategory);
    }
  };

  const [imageSrc, setImageSrc] = useState<string[]>([]); // State to hold image URLs

  const handleImageUpload = useCallback((imageUrl: string) => {
    setImageSrc(prevImageSrc => {
      if (prevImageSrc.includes(imageUrl)) {
        return prevImageSrc.filter(src => src !== imageUrl);
      } else {
        return [...prevImageSrc, imageUrl];
      }
    });
  }, []);

  let bodyContent = (
    <div className='flex flex-col gap-8'>
      <Heading
        title='Which of these category best describes your work?'
        subtitle='Pick a category'
      />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto'>
        {categories.map(item => (
          <div key={item.label} className='col-span-1'>
            <CategoryInput
              onClick={category => handleSelectCat(category)}
              selected={category.includes(item.label)}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
        <div
          onClick={handleSelectAllCategories}
          className={`
                rounded-xl
                border-2
                p-4
                flex
                flex-col
                gap-3
                hover:border-black
                transition
                cursor-pointer
                
            `}
        >
          <FaHandPointUp size={30} />
          <div className='font-semibold'>{"Select All"}</div>
        </div>
      </div>
    </div>
  );

  if (step == STEPS.LOCATION) {
    bodyContent = (
      <div className='flex flex-col gap-8 '>
        <Heading
          title='Where are you located?'
          subtitle='Help potential clients find you!'
        />
        <CountrySelect
          value={location}
          onChange={value => setCustomValue("location", value)}
        />

        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step == STEPS.INFO) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='Share some basic information about your work'
          subtitle='Description can help potential clients?'
        />
        <Counter
          title='Experiance'
          subtitle='How many years of experiance do you have?'
          value={guestCount}
          onChange={value => setCustomValue("guestCount", value)}
        />
        <hr />
        <Counter
          title='Maximum'
          subtitle='Maximum days availability? set 0 for no max'
          value={roomCount}
          onChange={value => setCustomValue("roomCount", value)}
        />
        <hr />
        <Counter
          title='Minimum'
          subtitle='Minimum days availability? set 0 for no minimum'
          value={bathroomCount}
          onChange={value => setCustomValue("bathroomCount", value)}
        />
      </div>
    );
  }

  if (step == STEPS.IMAGES) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='Add a photo of your work'
          subtitle='Show clients what your work looks like!'
        />
        <ImageUpload value={imageSrc} onChange={handleImageUpload} />
      </div>
    );
  }

  if (step == STEPS.DESCRIPTION) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='How would you describe your work?'
          subtitle='Short and sweet works best!'
        />
        <Input
          id='title'
          label='Title'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id='description'
          label='Description'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step == STEPS.PRICE) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='Now, set your price'
          subtitle='What would be your day rate?'
        />
        <Input
          id='price'
          label='Price'
          formatPrice
          type='number'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step == STEPS.CATEGORY ? undefined : onBack}
      title='Shutter giude your creativity!'
      body={bodyContent}
    />
  );
};

export default RentModal;
