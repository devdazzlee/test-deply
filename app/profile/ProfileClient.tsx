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
import { Range } from "react-date-range";

import { Button, Textarea } from "@nextui-org/react";
import { Input, InputProps } from "@nextui-org/react";
import { useCallback, useRef, useState } from "react";
import { arrayMoveImmutable } from "array-move";
import SortableList, { SortableItem } from "react-easy-sort";
import type { CurrentUser } from "../actions/getCurrentUser";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ImageUpload from "../components/inputs/ImageUpload";
import Calendar from "../components/inputs/Calendar";

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
  listings
}: {
  currentUser: CurrentUser;
  listings: any;
}) {
  const router = useRouter()
  const [loading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      uploadImage(file);
    }
  };

  const uploadImage = (file: File) => {
    setIsLoading(true)
    const formData = new FormData();
    formData.append('file', file);
    // Verify FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value); // Should log "file: [object File]"
    }


    const response = axios.patch(`/api/user/${currentUser.id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(() => {
      router.refresh()
    }).catch((error) => {
      console.log(error);

      toast.error('Error uploading image:');
    }).finally(() => {
      setIsLoading(false)
    });
  }


  return (
    <>
      {/* Cover photo */}
      <div className='bg-[#ECECEE] h-40 -mt-10'></div>

      {/* Profile photo + name */}
      <div className='flex md:flex-row flex-col mb-16'>
        <div
          className={clsx(
            "md:w-36 md:h-36 lg:mb-0 mb-4 w-24 h-24 rounded-full bg-blue-500 shadow-xl -my-12 ml-10",
            "overflow-hidden relative group",
            "border-white border-3"
          )}
        >
          <Image
            width={200}
            height={200}
            alt='profile picture'
            src={currentUser.image || "/images/placeholder.jpg"}
            className='w-full max-w-full h-full max-h-full object-cover'
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className={clsx(
              "group-hover:opacity-100 opacity-0 transition-opacity",
              "bg-black/70 text-white absolute inset-0",
              "flex items-center justify-center gap-x-2 font-bold text-sm"
            )}
            disabled={loading}
          >
            <IconPhotoFilled size={18} /> Change
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>

        <div className='pt-5 pl-4'>
          <h1 className='text-2xl font-bold'>{currentUser.name}</h1>
          <p className='text-gray-500'>{currentUser.email}</p>
        </div>
      </div>



      {/* Bio */}
      < section className='mx-6 md:mx-16 flex max-md:flex-col md:items-start gap-x-12 gap-y-6 border-b-2 py-6' >
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
      </section >

      {/* Social links */}
      < section className='mx-6 md:mx-16 flex max-md:flex-col md:items-start gap-x-12 gap-y-6 border-b-2 py-6' >
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
      </section >

      <section className='mx-6 md:mx-16 py-6'>
        <h2 className='font-semibold text-xl'>Set yourself as unavailable</h2>
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

      <section className='mx-6 md:mx-16 py-6 border-b-2'>
        <h4 className='font-semibold'>Your listings</h4>
        <p className='text-sm text-gray-600'>Drag to move photos around</p>

        {listings.map((listing: any) =>
          <div key={listing.id}>
            <PhotoSection listing={listing} loading={loading} setIsLoading={setIsLoading} />
          </div>
        )}
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


type Item = {
  id: number;
  url: string;
};

type Listing = {
  id: string;
  title: string;
  imageSrc: string[];
};

interface PhotoSectionProps {
  listing: Listing;
  loading: boolean;
  setIsLoading: (loading: boolean) => void;
}

function PhotoSection({ listing, loading, setIsLoading }: PhotoSectionProps) {
  const router = useRouter();
  const images: string[] = listing?.imageSrc || [];

  const [items, setItems] = useState<Item[]>(
    images.map((url: string, index: number) => ({
      id: index,
      url
    }))
  );

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setItems(array => arrayMoveImmutable(array, oldIndex, newIndex));
  };

  const handleImageChanges = (listingId: string, items: Item[]) => {
    setIsLoading(true)
    const imageSrc = items.map(item => item.url);

    axios
      .patch(`/api/listings/${listingId}/images`, imageSrc)
      .then(() => {
        toast.success('Changes saved successfully');
        setIsLoading(false);
        router.refresh();
      })
      .catch((error: unknown) => {
        setIsLoading(false);
        if (error instanceof Error) {
          toast.error(error.message || 'Failed to save changes');
        } else {
          toast.error('Failed to save changes');
        }
      });
  };

  const onRemove = (id: number) => {
    setItems(items => items.filter(item => item.id !== id));
  };

  const handleImageUpload = useCallback((imageUrl: string) => {
    setItems(prevItems => {
      const itemExists = prevItems.some(item => item.url === imageUrl);
      if (itemExists) {
        return prevItems.filter(item => item.url !== imageUrl);
      } else {
        const newItem: Item = { id: prevItems.length, url: imageUrl };
        return [...prevItems, newItem];
      }
    });
  }, []);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="border-b p-4">
      <h1 className="font-semibold text-lg">{listing.title}</h1>
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
            <div className='aspect-square rounded-xl relative overflow-hidden w-full h-full'>
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
                  onClick={() => onRemove(item.id)} // Handle image removal
                >
                  <IconTrash size={20} />
                </Button>
              </div>
            </div>
          </SortableItem>
        ))}
        <div className="aspect-square rounded-xl w-full h-full">

          <ImageUpload displayImages={false} value={items.map(item => item.url)} onChange={handleImageUpload} />
        </div>
      </SortableList>
      <section className='pt-6'>
        <Button
          color='success'
          variant='solid'
          className='!font-bold disabled:cursor-not-allowed disabled:bg-opacity-75 w-48'
          endContent={<IconCircleDashedCheck />}
          disabled={loading}
          onClick={() => handleImageChanges(listing.id, items)}  // Handle form submission
        >
          Save Changes
        </Button>
      </section>
    </div>
  );
}

