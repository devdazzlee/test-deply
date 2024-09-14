"use client";

import axios from "axios";

import {
  IconAlertTriangle,
  IconCircleDashedCheck,
  IconEyeClosed,
  IconEyeFilled,
  IconPhotoFilled,
  IconTrash
} from "@tabler/icons-react";
import clsx from "clsx";

import { Button, Textarea } from "@nextui-org/react";
import { Input, InputProps } from "@nextui-org/react";
import { useState } from "react";
import { arrayMoveImmutable } from "array-move";
import SortableList, { SortableItem } from "react-easy-sort";
import type { CurrentUser } from "../actions/getCurrentUser";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function PasswordInput(props: InputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      {...props}
      variant='flat'
      radius='sm'
      labelPlacement='outside'
      type='password'
      endContent={
        <Button
          isIconOnly
          variant='light'
          size='sm'
          onClick={toggleVisibility}
          aria-label='toggle password visibility'
          className='translate-x-2'
        >
          {isVisible ? (
            <IconEyeClosed size={18} className='text-default-500' />
          ) : (
            <IconEyeFilled size={18} className='text-default-500' />
          )}
        </Button>
      }
    />
  );
}

export default function ProfileClient({
  currentUser,
  listing
}: {
  currentUser: CurrentUser;
  listing: any;
}) {
  return (
    <>
      {/* Cover photo */}
      <div className='bg-[#ECECEE] h-40 -mt-10'></div>

      {/* Profile photo + name */}
      <div className='flex mb-16'>
        <div
          className={clsx(
            "w-36 h-36 rounded-full bg-blue-500 shadow-xl -my-12 ml-10",
            "overflow-hidden relative group",
            "border-white border-3"
          )}
        >
          <Image
            width={200}
            height={200}
            // src='/images/profile-image.jpg'
            alt='profile picture'
            src={currentUser.image || "/images/placeholder.jpg"}
            className='w-full max-w-full h-full max-h-full object-cover'
          />

          <button
            className={clsx(
              "group-hover:opacity-100 opacity-0 transition-opacity",
              "bg-black/70 text-white absolute inset-0",
              "flex items-center justify-center gap-x-2 font-bold text-sm"
            )}
          >
            <IconPhotoFilled size={18} /> Change
          </button>
        </div>

        <div className='pt-5 pl-4'>
          <h1 className='text-2xl font-bold'>{currentUser.name}</h1>
          <p className='text-gray-500'>{currentUser.email}</p>
        </div>
      </div>



      {/* Bio */}
      <section className='mx-6 md:mx-16 flex max-md:flex-col md:items-start gap-x-12 gap-y-6 border-b-2 py-6'>
        <div className='md:min-w-56 wl:min-w-96'>
          <h4 className='font-semibold'>Bio</h4>
          <p className='text-sm text-gray-600'>Tell us about yourself</p>
        </div>

        <div className='flex-1 md:max-w-lg space-y-11'>
          <Textarea
            variant='flat'
            label='Your Bio'
            labelPlacement='outside'
            placeholder='Enter your bio'
            disableAutosize
            // className='col-span-12 md:col-span-6 mb-6 md:mb-0'
            classNames={{
              input: "resize-y min-h-[140px]",
              label: "z-0"
            }}
          />
        </div>
      </section>

      {/* Social links */}
      <section className='mx-6 md:mx-16 flex max-md:flex-col md:items-start gap-x-12 gap-y-6 border-b-2 py-6'>
        <div className='md:min-w-56 wl:min-w-96'>
          <h4 className='font-semibold'>Social links</h4>
          <p className='text-sm text-gray-600'>
            Link your social accounts here
          </p>
        </div>

        <div className='flex-1 md:max-w-lg space-y-4'>
          <Input
            variant='flat'
            radius='sm'
            labelPlacement='outside-left'
            label='Facebook'
            placeholder='https://facebook.com/yourusername'
            classNames={{
              label: "!min-w-20 z-0",
              base: "flex",
              mainWrapper: "flex-1"
            }}
          />
          <Input
            variant='flat'
            radius='sm'
            labelPlacement='outside-left'
            label='Instagram'
            placeholder='https://instagram.com/yourusername'
            classNames={{
              label: "!min-w-20 z-0",
              base: "flex",
              mainWrapper: "flex-1"
            }}
          />
          <Input
            variant='flat'
            radius='sm'
            labelPlacement='outside-left'
            label='LinkedIn'
            placeholder='https://linkedin.com/yourusername'
            classNames={{
              label: "!min-w-20 z-0",
              base: "flex",
              mainWrapper: "flex-1"
            }}
          />
        </div>
      </section>


      <section className='mx-6 md:mx-16 py-6'>
        <Button
          color='success'
          variant='solid'
          className='!font-bold'
          endContent={<IconCircleDashedCheck />}
        >
          Save Changes
        </Button>
      </section>
    </>
  );
}




