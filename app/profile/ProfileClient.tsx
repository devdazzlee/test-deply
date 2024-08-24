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

      {/* Contact Info */}
      <section className='mx-6 md:mx-16 flex max-md:flex-col md:items-start gap-x-12 gap-y-6 border-b-2 py-6'>
        <div className='md:min-w-56 wl:min-w-96'>
          <h4 className='font-semibold'>Contact Information</h4>
          <p className='text-sm text-gray-600'>
            This is your personal information
          </p>
        </div>

        <div className='flex-1 md:max-w-lg space-y-11'>
          <Input
            variant='flat'
            radius='sm'
            labelPlacement='outside'
            label='Your name'
            className='z-0'
            placeholder='Enter your name'
            defaultValue={currentUser.name ?? ""}
          />
          <Input
            variant='flat'
            radius='sm'
            className='z-0'
            labelPlacement='outside'
            label='Phone Number'
            placeholder='Enter your phone number'
          />
          <Input
            variant='flat'
            radius='sm'
            className='z-0'
            labelPlacement='outside'
            label='Location'
            placeholder='Enter your location'
          />
        </div>
      </section>

      {/* Password */}
      <section className='mx-6 md:mx-16 flex max-md:flex-col md:items-start gap-x-12 gap-y-6 border-b-2 py-6'>
        <div className='md:min-w-56 wl:min-w-96'>
          <h4 className='font-semibold'>Password</h4>
          <p className='text-sm text-gray-600'>
            You can change the password here
          </p>
        </div>

        <div className='flex-1 md:max-w-lg space-y-11'>
          <PasswordInput
            label='Current Password'
            placeholder='Enter current password'
            className='z-0'
          />
          <PasswordInput
            label='New Password'
            className='z-0'
            placeholder='Enter new password'
          />
          <PasswordInput
            className='z-0'
            label='Confirm New Password'
            placeholder='Enter new password again'
          />
        </div>
      </section>

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

      {/* Listing photos reordering */}
      {listing && (
        <section className='mx-6 md:mx-16 border-b-2 py-6'>
          <h4 className='font-semibold'>Listing Photos</h4>
          <p className='text-sm text-gray-600'>Drag to move photos around</p>

          <PhotoSection listing={listing} />
          <ListingDeleter listing={listing} />
        </section>
      )}

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

function ListingDeleter({ listing }: { listing: any }) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = () => {
    if (!listing) return;

    setIsDeleting(true);

    const id = listing.id;
    axios
      .delete(`/api/listings/${id}`)
      .then(() => {
        toast.success("Listing deleted");
        router.refresh();
      })
      .catch(error => {
        toast.error(error?.response?.data?.error);
      }).finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <Button
      color='danger'
      variant='solid'
      className='!font-bold mt-6'
      endContent={<IconAlertTriangle />}
      onClick={onDelete}
      isLoading={isDeleting}
    >
      Delete Listing
    </Button>
  );
}

function PhotoSection({ listing }: any) {
  let images: string[] = listing?.imageSrc || [];
  const [items, setItems] = useState(
    images.map((url: string, index: number) => ({
      id: index,
      url
    }))
  );

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setItems(array => arrayMoveImmutable(array, oldIndex, newIndex));
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <SortableList
      onSortEnd={onSortEnd}
      className={clsx(
        "mt-6 select-none",
        "grid gap-4",
        "md:max-w-lg grid-cols-[repeat(2,1fr)] ph:grid-cols-[repeat(3,1fr)]"
      )}
      draggedItemClassName='dragged'
    >
      {items.map(item => (
        <SortableItem key={item.id}>
          <div className='aspect-square rounded-xl relative overflow-hidden'>
            <div className='relative w-full h-full'>
              <Image
                src={item.url}
                className='object-cover'
                alt=''
                layout='fill'
              />
            </div>
            <div
              className={clsx(
                //
                "absolute inset-0 cursor-grab bg-black/70",
                "hover:opacity-100 opacity-0 transition-opacity",
                "p-1.5 dark"
              )}
            >
              <Button
                isIconOnly
                variant='ghost'
                color='danger'
                size='sm'
                radius='sm'
              >
                <IconTrash size={20} />
              </Button>
            </div>
          </div>
        </SortableItem>
      ))}
    </SortableList>
  );
}
