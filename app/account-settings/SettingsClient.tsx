'use client';

import { Suspense, useState } from "react";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import { SafeListing, SafeUser } from "../types";
import type { CurrentUser } from "../actions/getCurrentUser";

import { Button, Input, InputProps } from "@nextui-org/react";
import { IconAlertTriangle, IconCircleDashedCheck, IconEyeClosed, IconEyeFilled, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { arrayMoveImmutable } from "array-move";
import SortableList, { SortableItem } from "react-easy-sort";
import clsx from "clsx";
import Image from "next/image";

interface SettingsClientProps {
    listing: any;
    currentUser: CurrentUser;
}

const SettingsClient: React.FC<SettingsClientProps> = ({
    listing,
    currentUser
}) => {
    return (
        <>
            {/* Contact Info */}
            <section className='md:mt-0 mt-12 mx-6 md:mx-16 flex max-md:flex-col md:items-start gap-x-12 gap-y-6 border-b-2 py-6'>
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
                        label='Your username'
                        className='z-0'
                        placeholder='Enter your username'
                        defaultValue={currentUser.name ?? ""}
                    />
                    <Input
                        variant='flat'
                        radius='sm'
                        className='z-0'
                        labelPlacement='outside'
                        label='Your email'
                        placeholder='Enter your email'
                        defaultValue={currentUser.email ?? ""}
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
            <section className='mx-6 md:mx-16 flex max-md:flex-col md:items-start gap-x-12 gap-y-6 py-6'>
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
            {listing && (
                <section className='mx-6 md:mx-16 border-b-2 py-6'>
                    <h4 className='font-semibold'>Listing Photos</h4>
                    <p className='text-sm text-gray-600'>Drag to move photos around</p>

                    <PhotoSection listing={listing} />
                    <ListingDeleter listing={listing} />
                </section>
            )}

            <section className='mx-6 md:mx-16 py-6 border-b-2'>
                <Button
                    color='success'
                    variant='solid'
                    className='!font-bold'
                    endContent={<IconCircleDashedCheck />}
                >
                    Save Changes
                </Button>
            </section>
            <section className='mx-6 md:mx-16 flex max-md:flex-col md:items-start gap-x-12 gap-y-6 border-b-2 py-6'>
                <Heading title="Reviews you got on your listings" />
            </section>

        </>
    )
};

function PasswordInput(props: InputProps) {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <Input
            {...props}
            variant='flat'
            radius='sm'
            labelPlacement='outside'
            type={isVisible ? 'text' : 'password'}
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
export default SettingsClient;
