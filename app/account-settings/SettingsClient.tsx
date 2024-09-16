'use client';

import { Suspense, useState } from "react";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import { SafeListing, SafeUser } from "../types";
import type { CurrentUser } from "../actions/getCurrentUser";

import { Button, Input, InputProps, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
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
    const router = useRouter();

    // Define state to store input values
    const [username, setUsername] = useState(currentUser?.name ?? "");
    const [email, setEmail] = useState(currentUser?.email ?? "");
    // const [location, setLocation] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handleSaveChanges = () => {
        if (newPassword !== confirmNewPassword) {
            return toast.error("New password and confirm password do not match");
        }

        const payload = {
            name: username,
            email,
            password: newPassword, 
        };

        axios
            .patch('/api/user/update', payload)
            .then(() => {
                toast.success('Changes saved successfully');
                router.refresh();
            })
            .catch((error: unknown) => { 
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
                        label='Your username'
                        className='z-0'
                        placeholder='Enter your username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}  // Capture input value
                    />
                    <Input
                        variant='flat'
                        radius='sm'
                        className='z-0'
                        labelPlacement='outside'
                        label='Your email'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}  // Capture input value
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
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}  // Capture input value
                    />
                    <PasswordInput
                        label='Confirm New Password'
                        placeholder='Enter new password again'
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}  // Capture input value
                    />
                </div>
            </section>

            {/* Save Changes Button */}
            <section className='mx-6 md:mx-16 pt-6'>
                <Button
                    color='success'
                    variant='solid'
                    className='!font-bold'
                    endContent={<IconCircleDashedCheck />}
                    onClick={handleSaveChanges}  // Handle form submission
                >
                    Save Changes
                </Button>
            </section>
            <DeleteAccountButton />

            <section className='mx-6 md:mx-16 flex max-md:flex-col md:items-start gap-x-12 gap-y-6 border-b-2 py-6'>
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
                router.push("/goodbye"); // Redirect the user or refresh the page
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
            <section className='mx-6 md:mx-16 py-6 border-b-2'>
                <Button
                    color='danger'
                    variant='solid'
                    className='!font-bold'
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
