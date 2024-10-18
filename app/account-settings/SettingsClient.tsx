'use client';

import { Suspense, useCallback, useState } from "react";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import { SafeListing, SafeUser } from "../types";
import type { CurrentUser } from "../actions/getCurrentUser";
import { signOut } from "next-auth/react";

import { Button, Input, InputProps, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { IconAlertTriangle, IconCircleDashedCheck, IconEyeClosed, IconEyeFilled, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { arrayMoveImmutable } from "array-move";
import SortableList, { SortableItem } from "react-easy-sort";
import clsx from "clsx";
import Image from "next/image";
import ImageUpload from "../components/inputs/ImageUpload";

interface SettingsClientProps {
    listings: any;
    currentUser: CurrentUser;
}

const SettingsClient: React.FC<SettingsClientProps> = ({
    listings,
    currentUser
}) => {
    const router = useRouter();

    // Define state to store input values
    const [formState, setFormState] = useState({
        name: currentUser?.name ?? "",
        email: currentUser?.email ?? "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value, // Update the specific field by name
        }));
    };
    const [loading, setIsLoading] = useState(false);

    const handleSaveChanges = () => {
        if (formState.newPassword !== formState.confirmNewPassword) {
            return toast.error("New password and confirm password do not match");
        }
        setIsLoading(true)
        const payload: { name?: string; email?: string; password?: string } = {};

        if (formState.name !== currentUser?.name)
            payload.name = formState.name;
        if (formState.email !== currentUser?.email)
            payload.email = formState.email;
        if (formState.newPassword !== "")
            payload.password = formState.newPassword;

        axios
            .patch('/api/user/update', payload)
            .then(() => {
                toast.success('Changes saved successfully');
                setIsLoading(false)
                router.refresh();
            })
            .catch((error: unknown) => {
                setIsLoading(false)
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to save changes');
                } else {
                    toast.error('Failed to save changes');
                }
            });
    };



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
                        label='Your name'
                        className='z-0'
                        name="name"
                        placeholder='Enter your name'
                        value={formState.name}
                        onChange={handleInputChange}
                    // Capture input value
                    />
                    <Input
                        variant='flat'
                        radius='sm'
                        className='z-0'
                        labelPlacement='outside'
                        label='Your email'
                        name="email"
                        placeholder='Enter your email'
                        value={formState.email}
                        onChange={handleInputChange}  // Capture input value
                    />
                    {/* <Input
                        variant='flat'
                        radius='sm'
                        className='z-0'
                        labelPlacement='outside'
                        label='Location'
                        placeholder='Enter your location'
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}  // Capture input value
                    /> */}
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
                        label='New Password'
                        placeholder='Enter new password'
                        name="newPassword"
                        value={formState.newPassword}
                        onChange={handleInputChange}  // Capture input value
                    />
                    <PasswordInput
                        label='Confirm New Password'
                        placeholder='Enter new password again'
                        name="confirmNewPassword"
                        value={formState.confirmNewPassword}
                        onChange={handleInputChange} // Capture input value
                    />
                </div>
            </section>

            {/* Save Changes Button */}
            <section className='mx-6 md:mx-16 pt-6'>
                <Button
                    color='success'
                    variant='solid'
                    className='!font-bold disabled:cursor-not-allowed w-48'
                    endContent={<IconCircleDashedCheck />}
                    disabled={loading}
                    onClick={handleSaveChanges}  // Handle form submission
                >
                    Save Changes
                </Button>
            </section>
            <DeleteAccountButton />

            <section className='mx-6 md:mx-16 py-6 border-b-2'>
                <h4 className='font-semibold'>Your listings</h4>
                <p className='text-sm text-gray-600'>Drag to move photos around</p>

                {listings.map((listing: any) =>
                    <div key={listing.id}>
                        <PhotoSection listing={listing} loading={loading} setIsLoading={setIsLoading} />
                    </div>
                )}
            </section>
            <section className='mx-6 md:mx-16 flex max-md:flex-col md:items-start gap-x-12 gap-y-6 border-b-2 py-4'>
                <Heading title="Reviews you got on your listings" />
            </section>
        </>
    );
};

const DeleteAccountButton = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [confirmText, setConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    // Function to handle account deletion
    const handleDeleteAccount = () => {
        if (confirmText !== "delete") {
            toast.error("You must type 'delete' to confirm");
            return;
        }

        setIsDeleting(true);
        // Call the API to delete the account
        axios
            .delete("/api/user/delete") // Replace with your actual delete API endpoint
            .then(() => {
                toast.success("Account deleted successfully");
                signOut() // Redirect the user or refresh the page
            })
            .catch((error) => {
                toast.error(error || "Failed to delete account");
            })
            .finally(() => {
                setIsDeleting(false);
                // setIsModalOpen(false);
            });
    };

    return (
        <>
            {/* Button to open the modal */}
            <section className='mx-6 md:mx-16 py-6 border-b-2 '>
                <Button
                    color='danger'
                    variant='solid'
                    className='!font-bold w-48'
                    endContent={<IconTrash />}
                    onClick={onOpen}
                >
                    Delete My Account
                </Button>
            </section>

            {/* Modal for account deletion confirmation */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Delete my account</ModalHeader>
                            <ModalBody>
                                <p className='text-sm text-gray-600'>
                                    Are you sure you want to delete your account? This action is irreversible.
                                </p>
                                <p className='text-sm text-gray-600 font-semibold mt-4'>
                                    Please type <span className="text-red-600">delete</span> to confirm:
                                </p>
                                <Input
                                    className='mt-2'
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder='Type delete here...'
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="danger" onPress={handleDeleteAccount} isLoading={isDeleting} disabled={confirmText !== "delete"} className="disabled:opacity-70 disabled:cursor-not-allowed">
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
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
            className="z-0"
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

export default SettingsClient;
