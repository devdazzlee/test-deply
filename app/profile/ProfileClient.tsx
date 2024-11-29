  "use client";

  import axios from "axios";

  import {
    IconAlertTriangle,
    IconCircleDashedCheck,
    IconEdit,
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

  // PasswordInput Component
  function PasswordInput(props: InputProps) {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
      <Input
        {...props}
        variant='flat'
        radius='sm'
        labelPlacement='outside'
        type={isVisible ? "text" : "password"}
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

  // EditableListing Component
  function EditableListing({
    listing,
    onUpdate
  }: {
    listing: { id: string; title: string; imageSrc: string[] };
    onUpdate: (updatedTitle: string) => void;
  }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(listing.title);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
      setIsSaving(true);

      try {
        await onUpdate(title); // Update title through the parent handler
        setIsEditing(false); // Exit editing mode
      } catch (error) {
        toast.error("Failed to update title.");
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className='flex flex-col gap-2'>
        {isEditing ? (
          <div className='flex items-center gap-2'>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Enter a new title'
              disabled={isSaving}
            />
            <Button
              onClick={handleSave}
              color='success'
              isLoading={isSaving}
              disabled={isSaving || title.trim() === ""}
            >
              Save
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            size='sm'
            startContent={<IconEdit size={16} />}
            aria-label={`Edit title for ${listing.title}`}
            color='success'
          >
            Edit
          </Button>
        )}
      </div>
    );
  }

  // PhotoSection Component
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
      setIsLoading(true);
      const imageSrc = items.map(item => item.url);

      axios
        .patch(`/api/listings/${listingId}/images`, imageSrc)
        .then(() => {
          toast.success("Changes saved successfully");
          setIsLoading(false);
          router.refresh();
        })
        .catch((error: unknown) => {
          setIsLoading(false);
          if (error instanceof Error) {
            toast.error(error.message || "Failed to save changes");
          } else {
            toast.error("Failed to save changes");
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
      <div className='mt-4'>
        <SortableList
          onSortEnd={onSortEnd}
          className={clsx(
            "select-none grid gap-4",
            "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          )}
          draggedItemClassName='dragged'
        >
          {items.map(item => (
            <SortableItem key={item.id}>
              <div className='relative rounded-xl overflow-hidden w-full h-40'>
                <Image
                  src={item.url}
                  className='object-cover w-full h-full'
                  alt={`Listing Image ${item.id}`}
                  fill
                />
                <div
                  className={clsx(
                    "absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
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
          <div className='relative rounded-xl overflow-hidden w-full h-40 flex items-center justify-center border-dashed border-2 border-gray-300'>
            <ImageUpload
              displayImages={false}
              value={items.map(item => item.url)}
              onChange={handleImageUpload}
            />
          </div>
        </SortableList>
        <div className='mt-2 flex justify-end'>
          <Button
            color='success'
            variant='solid'
            className='!font-bold disabled:cursor-not-allowed disabled:bg-opacity-75'
            endContent={<IconCircleDashedCheck />}
            disabled={loading}
            onClick={() => handleImageChanges(listing.id, items)} // Handle form submission
          >
            Save Changes
          </Button>
        </div>
      </div>
    );
  }

  // ProfileClient Component
  export default function ProfileClient({
    currentUser,
    listings: initialListings = []
  }: {
    currentUser: CurrentUser;
    listings: Listing[]; // Define a proper type
  }) {
    const router = useRouter();
    const [loading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [listings, setListings] = useState<Listing[]>(initialListings);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [town, setTown] = useState(currentUser?.town ?? "");
    const [bio, setBio] = useState(currentUser?.bio ?? "");
    const [facebook, setFacebook] = useState(currentUser?.facebook ?? "");
    const [instagram, setInstagram] = useState(currentUser?.instagram ?? "");
    const [linkedin, setLinkedin] = useState(currentUser?.linkedin ?? "");
    


    const [dateRange, setDateRange] = useState<Range>({
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        if (!file.type.startsWith("image/")) {
          toast.error("Invalid file. Please upload an image.");
          return;
        }

        uploadImage(file);
      } else {
        toast.error("No file selected.");
      }
    };

    const uploadImage = async (file: File) => {
      setIsLoading(true);

      try {
        console.log("Uploading file:", file.name, file.type, file.size); // Debugging

        const arrayBuffer = await file.arrayBuffer();

        await axios.patch(`/api/user/${currentUser.id}/avatar`, arrayBuffer, {
          headers: {
            "Content-Type": file.type
          }
        });

        router.refresh();
        toast.success("Profile picture updated!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image.");
      } finally {
        setIsLoading(false);
      }
    };

    const handleDeleteListing = async (id: string) => {
      if (!id) return;
      setIsLoading(true);

      try {
        await axios.delete(`/api/listings/${id}`);
        toast.success("Listing deleted!");
        // Remove the deleted listing from state
        setListings(prevListings =>
          prevListings.filter(listing => listing.id !== id)
        );
        // Optionally, you can also refresh the router
        router.refresh();
      } catch (error) {
        toast.error("Failed to delete listing.");
      } finally {
        setIsLoading(false);
      }
    };

    const handleUpdateListing = async (id: string, updatedTitle: string) => {
      if (!id || !updatedTitle.trim()) {
        toast.error("Invalid listing ID or title.");
        return;
      }

      setIsLoading(true);

      try {
        const patchUrl = `/api/listings/${id}/edittitle/title`;
        console.log(`Sending PATCH request to ${patchUrl}`); // Debugging

        const response = await axios.patch(patchUrl, {
          title: updatedTitle
        });

        if (response.status === 200) {
          toast.success("Listing title updated!");

          // Update the local state to reflect the change
          setListings(prev =>
            prev.map(listing =>
              listing.id === id ? { ...listing, title: updatedTitle } : listing
            )
          );
        }
      } catch (error: any) {
        console.error("Error updating listing:", error);
        // Display specific error message if available
        if (error.response && error.response.data && error.response.data.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Failed to update listing title.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    function ToggleAvailability({
      listingId,
      isAvailable,
      onToggle
    }: {
      listingId: string;
      isAvailable: boolean;
      onToggle: (updatedAvailability: boolean) => void;
    }) {
      const [loading, setLoading] = useState(false);

      const toggleAvailability = async () => {
        try {
          const response = await fetch(
            `/api/listings/${listingId}/availability`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ available: !isAvailable })
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update availability");
          }

          const data = await response.json();
          onToggle(data.available);
          toast.success("Availability updated successfully");
        } catch (error) {
          console.error(error);
          toast.error("An error occurred while updating availability");
        }
      };

      return (
        <Button
          color={isAvailable ? "success" : "danger"}
          onClick={toggleAvailability}
          isLoading={loading}
        >
          {isAvailable ? "Available" : "Unavailable"}
        </Button>
      );
    }
    const handleSaveProfile = async () => {
      if (!town.trim() || !bio.trim()) {
        toast.error("Town and bio cannot be empty.");
        return;
      }
    
      setIsLoading(true);
      try {
        await axios.patch("/api/user/update", {
          userId: currentUser.id,
          town: town.trim(),
          bio: bio.trim(),
          facebook: facebook.trim() || null,
          instagram: instagram.trim() || null,
          linkedin: linkedin.trim() || null,
        });
    
        toast.success("Profile updated successfully!");
        router.refresh();
      } catch (error) {
        toast.error("Failed to save profile.");
      } finally {
        setIsLoading(false);
      }
    };
    

    
    return (
      <>
        {/* Cover photo */}
        <div className='bg-[#ECECEE] h-40 -mt-10'></div>

        {/* Profile photo + name */}
        <div className='flex md:flex-row flex-col mb-16 items-center md:items-start'>
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
              type='file'
              accept='image/*'
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>

          <div className='pt-5 pl-4 text-center md:text-left'>
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

          <div className='flex-1 md:max-w-lg space-y-4'>
          <Textarea
              variant="flat"
              label="Your Bio"
              labelPlacement="outside"
              placeholder="Enter your bio"
              disableAutosize
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              classNames={{
                input: "resize-y min-h-[140px]",
                label: "z-0",
              }}
            />
          </div>
        </section>
        
        <section className="mx-6 md:mx-16 flex max-md:flex-col md:items-start gap-x-12 gap-y-6 border-b-2 py-6">
    <div className="md:min-w-56 wl:min-w-96">
      <h4 className="font-semibold">Town</h4>
      <p className="text-sm text-gray-600">Where are you located?</p>
    </div>

    <div className="flex-1 md:max-w-lg space-y-4">
    <Input
              variant="flat"
              radius="sm"
              labelPlacement="outside"
              label="Town"
              placeholder="Enter your town"
              value={town}
              onChange={(e) => setTown(e.target.value)} // Bind to town state
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
              variant="flat"
              radius="sm"
              labelPlacement="outside-left"
              label="Facebook"
              placeholder="https://facebook.com/yourusername"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)} // Bind to facebook state
            />
          <Input
              variant="flat"
              radius="sm"
              labelPlacement="outside-left"
              label="Instagram"
              placeholder="https://instagram.com/yourusername"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)} // Bind to instagram state
            />
            <Input
              variant="flat"
              radius="sm"
              labelPlacement="outside-left"
              label="LinkedIn"
              placeholder="https://linkedin.com/yourusername"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)} // Bind to linkedin state
            />
          </div>
        </section>

        {/* Availability Calendar */}
        <section className='mx-6 md:mx-16 py-6'>
          <h2 className='font-semibold text-xl mb-4'>
            Set yourself as unavailable
          </h2>
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

        {/* Save Changes Button */}
        <section className='mx-6 md:mx-16 py-6'>
          <Button
            color='success'
            variant='solid'
            className='!font-bold w-full md:w-48'
            endContent={<IconCircleDashedCheck />}
                onClick={handleSaveProfile}


          >
            Save Changes First Save 
          </Button>
        </section>

        {/* Your Listings */}
        <section className='mx-6 md:mx-16 py-6 border-b-2'>
          <h4 className='font-semibold text-xl mb-2'>Your Listings</h4>
          <p className='text-sm text-gray-600 mb-4'>Drag to move photos around</p>

          {listings.map((listing: any) => (
            <div key={listing.id} className='border-b p-4 mb-4'>
              <div className='flex flex-col md:flex-row md:items-center justify-between'>
                <h1 className='font-semibold text-lg mb-2 md:mb-0'>
                  {listing.title}
                </h1>
                <div className='flex items-center gap-2'>
                  {/* Delete Listing Button */}
                  <Button
                    color='danger'
                    variant='solid'
                    size='sm'
                    onClick={() => handleDeleteListing(listing.id)} // Function to handle deletion
                    startContent={<IconTrash size={16} />}
                  >
                    Delete
                  </Button>

                  {/* Editable Listing Title */}
                  <EditableListing
                    listing={listing}
                    onUpdate={(updatedTitle: string) =>
                      handleUpdateListing(listing.id, updatedTitle)
                    }
                  />
                  <ToggleAvailability
                    listingId={listing.id}
                    isAvailable={listing.available}
                    onToggle={updatedAvailability =>
                      setListings(prevListings =>
                        prevListings.map(l =>
                          l.id === listing.id
                            ? { ...l, available: updatedAvailability }
                            : l
                        )
                      )
                    }
                  />
                </div>
              </div>

              {/* PhotoSection for Individual Image Management */}
              <PhotoSection
                listing={listing}
                loading={loading}
                setIsLoading={setIsLoading}
              />
            </div>
          ))}
        </section>
      </>
    );
  }
